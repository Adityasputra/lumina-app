import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";

const resolvers = {
  Mutation: {
    followUser: async (_, { followingId }, { db, authentication }) => {
      const user = await authentication();
      // console.log(user, "This is the user");

      if (!user) {
        throw new GraphQLError("User not found");
      }

      if (user.id === followingId) {
        throw new GraphQLError("You cannot follow yourself");
      }

      const checkUser = await db
        .collection("users")
        .findOne({ _id: new ObjectId(followingId) });
      if (!checkUser) {
        throw new GraphQLError("User not found");
      }

      const checkFollow = await db
        .collection("follows")
        .findOne({ followerId: user.id, followingId });
      if (checkFollow) {
        throw new GraphQLError("You already follow this user");
      }

      const newFollow = {
        followerId: user.id,
        followingId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await db.collection("follows").insertOne(newFollow);
      // console.log(result, "This is the result");

      await db.collection("users").updateOne(
        { _id: new ObjectId(followingId) },
        {
          $addToSet: { followers: user.id },
        }
      );

      await db.collection("users").updateOne(
        { _id: new ObjectId(user.id) },
        {
          $addToSet: { following: followingId },
        }
      );

      return { ...newFollow, _id: result.insertedId };
    },
  },
};

export default resolvers;
