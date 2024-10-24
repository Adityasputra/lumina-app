import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";

const resolvers = {
  Query: {
    getPosts: async (_, __, { db }) => {
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
              createdAt: 1,
              updatedAt: 1,
              "author.username": 1,
              "author.name": 1,
            },
          },
        ])
        .toArray();

      // console.log(posts, "<< This Posts");

      return posts.map((post) => ({
        ...post,
        author: {
          username: post.author.username,
          name: post.author.name,
        },
      }));

      // return posts;
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
        updatedAt: new Date().toISOString(),
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

      // console.log(result, "<< This Result");
      return { ...post, comments: [...post.comments, newComment] };
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

      // console.log(result, "<< This Result");
      return { ...post, likes: [...post.likes, newLike] };
    },
  },
};

export default resolvers;
