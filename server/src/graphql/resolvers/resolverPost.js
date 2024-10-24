import { GraphQLError } from "graphql";

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
      console.log(result, "<< This Result");
      return { ...newPost, _id: result.insertedId };
    },
  },
};

export default resolvers;
