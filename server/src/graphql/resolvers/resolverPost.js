import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";
import {
  deleteCache,
  getCachedData,
  setCacheData,
} from "../../config/redis.js";

const resolvers = {
  Query: {
    getPosts: async (_, __, { db }) => {
      const cachedPosts = await getCachedData("posts");
      if (cachedPosts) {
        return cachedPosts;
      }

      const posts = await db
        .collection("posts")
        .aggregate([
          {
            $lookup: {
              from: "users",
              localField: "authorId",
              foreignField: "_id",
              as: "author",
            },
          },
          {
            $unwind: {
              path: "$author",
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $project: {
              _id: 1,
              content: 1,
              tags: 1,
              imgUrls: 1,
              authorId: 1,
              likes: 1,
              comments: 1,
              createdAt: 1,
              updatedAt: 1,
              "author.username": 1,
              "author.name": 1,
            },
          },
        ])
        .toArray();

      // console.log(posts, "<< This Posts");

      await setCacheData("posts", posts, 60);
      return posts.map((post) => ({
        ...post,
        author: {
          username: post.author.username,
          name: post.author.name,
        },
      }));

      // return posts;
    },
    getPostById: async (_, { id }, { db }) => {
      const cachedPost = await getCachedData(`post:${id}`);
      if (cachedPost) {
        return cachedPost;
      }

      const post = await db
        .collection("posts")
        .aggregate([
          {
            $match:
              /**
               * query: The query in MQL.
               */
              {
                _id: new ObjectId(id),
              },
          },
          {
            $lookup:
              /**
               * from: The target collection.
               * localField: The local join field.
               * foreignField: The target join field.
               * as: The name for the results.
               * pipeline: Optional pipeline to run on the foreign collection.
               * let: Optional variables to use in the pipeline field stages.
               */
              {
                from: "users",
                localField: "authorId",
                foreignField: "_id",
                as: "author",
              },
          },
          {
            $unwind:
              /**
               * path: Path to the array field.
               * includeArrayIndex: Optional name for index.
               * preserveNullAndEmptyArrays: Optional
               *   toggle to unwind null and empty values.
               */
              {
                path: "$author",
                includeArrayIndex: "string",
                preserveNullAndEmptyArrays: true,
              },
          },
          {
            $project:
              /**
               * specifications: The fields to
               *   include or exclude.
               */
              {
                _id: 1,
                content: 1,
                tags: 1,
                imgUrls: 1,
                authorId: 1,
                likes: 1,
                comments: 1,
                createdAt: 1,
                updatedAt: 1,
                "author.name": 1,
                "author.username": 1,
              },
          },
        ])
        .toArray();

      await setCacheData(`post:${id}`, post[0], 60);
      return post[0]
        ? {
            ...post[0],
            author: {
              name: post[0].author.name,
              username: post[0].author.username,
            },
          }
        : null;
    },
  },
  Mutation: {
    createPost: async (_, { input }, { db, authentication }) => {
      const { content, tags, imgUrls } = input;

      const user = await authentication();
      console.log(user, "<<<< This User");
      if (!user) {
        throw new GraphQLError("User not found");
      }

      if (!content) {
        throw new GraphQLError("Content is required");
      }

      if (imgUrls && typeof imgUrls !== "string") {
        throw new GraphQLError("Invalid image URL format");
      }

      const newPost = {
        content: content,
        tags: tags || [],
        imgUrls: imgUrls || "",
        authorId: user.id,
        comments: [],
        likes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await db.collection("posts").insertOne(newPost);
      // console.log(result, "<< This Result");
      return { ...newPost, _id: result.insertedId };
    },
    commentPost: async (_, { postId, content }, { db, authentication }) => {
      const user = await authentication();
      if (!user) {
        throw new GraphQLError("User not found");
      }

      if (!content) {
        throw new GraphQLError("Content is required");
      }

      const post = await db
        .collection("posts")
        .findOne({ _id: new ObjectId(postId) });
      if (!post) {
        throw new GraphQLError("Post not found");
      }

      const newComment = {
        content,
        username: user.username,
        createdAt: new Date().toISOString(),
      };

      const result = await db.collection("posts").updateOne(
        { _id: new ObjectId(postId) },
        {
          $push: {
            comments: newComment,
          },
        }
      );

      if (result.modifiedCount === 0) {
        throw new GraphQLError("Failed to comment on the post");
      }

      await deleteCache("posts");

      const updatedPost = await db
        .collection("posts")
        .findOne({ _id: new ObjectId(postId) });

      return updatedPost;
    },

    likePost: async (_, { postId }, { db, authentication }) => {
      const user = await authentication();
      if (!user) {
        throw new GraphQLError("User not found");
      }

      const post = await db
        .collection("posts")
        .findOne({ _id: new ObjectId(postId) });
      if (!post) {
        throw new GraphQLError("Post not found");
      }

      const checkLike = post.likes.find(
        (like) => like.username === user.username
      );
      if (checkLike) {
        throw new GraphQLError("You have already liked this post");
      }

      const newLike = {
        username: user.username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await db.collection("posts").updateOne(
        { _id: new ObjectId(postId) },
        {
          $push: {
            likes: newLike,
          },
        }
      );

      if (result.modifiedCount === 0) {
        throw new GraphQLError("Failed to like the post");
      }

      await deleteCache("posts");

      const updatedPost = await db
        .collection("posts")
        .findOne({ _id: new ObjectId(postId) });

      return updatedPost;
    },
  },
};

export default resolvers;
