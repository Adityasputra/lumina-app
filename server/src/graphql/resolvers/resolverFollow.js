import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";

const resolvers = {
  Mutation: {
    followUser: async (_, { followingId }, { db, authentication }) => {
      const user = await authentication();

      if (!user) {
        throw new GraphQLError("User not found");
      }

      if (user.id === followingId) {
        throw new GraphQLError("You cannot follow yourself");
      }

      // Mengubah followingId dari string ke ObjectId
      const followingObjectId = new ObjectId(followingId);

      const checkUser = await db
        .collection("users")
        .findOne({ _id: followingObjectId });
      if (!checkUser) {
        throw new GraphQLError("User not found");
      }

      const checkFollow = await db
        .collection("follows")
        .findOne({ followerId: user.id, followingId: followingObjectId });
      if (checkFollow) {
        throw new GraphQLError("You already follow this user");
      }

      const newFollow = {
        followerId: user.id,
        followingId: followingObjectId, // Simpan sebagai ObjectId
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
          $addToSet: { following: followingObjectId }, // Simpan sebagai ObjectId
        }
      );

      return { ...newFollow, _id: result.insertedId };
    },
  },
};

export default resolvers;
