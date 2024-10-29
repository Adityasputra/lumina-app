import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";

const resolvers = {
  Mutation: {
    followUser: async (_, { followingId }, { db, authentication }) => {
      const user = await authentication();

      if (!user) {
        throw new GraphQLError("User not found", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      const followingObjectId = new ObjectId(followingId);

      if (user.id === followingObjectId.toString()) {
        throw new GraphQLError("You cannot follow yourself", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const checkUser = await db
        .collection("users")
        .findOne({ _id: followingObjectId });
      if (!checkUser) {
        throw new GraphQLError("User not found", {
          extensions: {
            code: "NOT_FOUND",
          },
        });
      }

      const checkFollow = await db
        .collection("follows")
        .findOne({ followerId: user.id, followingId: followingObjectId });
      if (checkFollow) {
        throw new GraphQLError("You already follow this user", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const newFollow = {
        followerId: user.id,
        followingId: followingObjectId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await db.collection("follows").insertOne(newFollow);

      await db.collection("users").updateOne(
        { _id: followingObjectId },
        {
          $addToSet: { followers: user.id },
        }
      );

      await db.collection("users").updateOne(
        { _id: new ObjectId(user.id) },
        {
          $addToSet: { following: followingObjectId },
        }
      );

      return { ...newFollow, _id: result.insertedId };
    },
  },
};

export default resolvers;
