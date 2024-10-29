import { GraphQLError } from "graphql";
import { comparePassword, hashPassword } from "../../utils/bcrptjs.js";
import { signToken } from "../../utils/jwt.js";
import { ObjectId } from "mongodb";

const resolvers = {
  Query: {
    me: async (_, __, { db, authentication }) => {
      const user = await authentication();
      if (!user) {
        throw new GraphQLError("User not found", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      const userData = await db.collection("users").findOne({ _id: user.id });
      if (!userData) {
        throw new GraphQLError("User not found", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      return userData;
    },

    users: async (_, __, { db }) => {
      return await db.collection("users").find().toArray();
    },
    getUserById: async (_, { id }, { db }) => {
      const user = await db
        .collection("users")
        .aggregate([
          {
            $match: {
              _id: new ObjectId(id),
            },
          },
          {
            $lookup: {
              from: "follows",
              localField: "_id",
              foreignField: "followingId",
              as: "followers",
            },
          },
          {
            $lookup: {
              from: "follows",
              localField: "_id",
              foreignField: "followerId",
              as: "following",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "followers.followerId",
              foreignField: "_id",
              as: "followerDetails",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "following.followingId",
              foreignField: "_id",
              as: "followingDetails",
            },
          },
          {
            $project: {
              name: 1,
              username: 1,
              email: 1,
              followers: "$followerDetails",
              following: "$followingDetails",
            },
          },
        ])
        .toArray();

      if (!user || user.length === 0) {
        throw new GraphQLError("User not found");
      }

      return user[0];
    },
    searchUser: async (_, { keyword }, { db }) => {
      const result = await db
        .collection("users")
        .find(
          {
            $or: [
              { name: { $regex: keyword, $options: "i" } },
              { username: { $regex: keyword, $options: "i" } },
            ],
          },
          {
            projection: {
              password: 0,
            },
            limit: 10,
          }
        )
        .toArray();

      return result;
    },
  },
  Mutation: {
    register: async (_, { input }, { db }) => {
      const { name, username, email, password } = input;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new GraphQLError("Invalid email");
      }

      const checkUsername = await db.collection("users").findOne({ username });
      if (checkUsername) {
        throw new GraphQLError("Username already exists");
      }

      const checkEmail = await db.collection("users").findOne({ email });
      if (checkEmail) {
        throw new GraphQLError("Email already exists");
      }

      if (password.length < 6) {
        throw new GraphQLError("Password must be at least 6 characters long");
      }

      const hashedPassword = hashPassword(password);
      const newUser = {
        name,
        username,
        email,
        password: hashedPassword,
        followers: [],
        following: [],
      };

      const result = await db.collection("users").insertOne(newUser);
      //   console.log(result, "<< This Result");
      return { ...newUser, _id: result.insertedId };
    },
    login: async (_, { input }, { db }) => {
      const { email, password } = input;

      const user = await db.collection("users").findOne({ email });
      if (!user) {
        throw new GraphQLError("User not found");
      }

      const isPasswordValid = comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new GraphQLError("Invalid password");
      }

      const access_token = signToken({
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      });

      return {
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
        },
        access_token,
      };
    },
  },
};

export default resolvers;
