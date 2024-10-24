import { GraphQLError } from "graphql";
import { comparePassword, hashPassword } from "../../utils/bcrptjs.js";
import { signToken } from "../../utils/jwt.js";

const resolvers = {
  Query: {
    users: async (_, __, { db }) => {
      return await db.collection("users").find().toArray();
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

      const token = signToken({
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
        token,
      };
    },
  },
};

export default resolvers;
