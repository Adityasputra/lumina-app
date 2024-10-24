import { GraphQLError } from "graphql";
import { hashPassword } from "../../utils/bcrptjs.js";

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
  },
};

export default resolvers;
