import { GraphQLError } from "graphql";
import { getDatabase } from "../config/mongodb.js";
import { verifyToken } from "../utils/jwt.js";
import { ObjectId } from "mongodb";

export const authentication = async (req) => {
  try {
    const db = getDatabase();

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new GraphQLError("You must be logged in to access this resource");
    }

    const token = authHeader.split(" ")[1];
    if (!token) throw new GraphQLError("Authentication token is missing");

    const verifiedToken = verifyToken(token);
    if (!verifiedToken) throw new GraphQLError("Invalid or expired token");

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(verifiedToken.id) });

    if (!user) throw new GraphQLError("User not found");

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
    };
  } catch (error) {
    throw new GraphQLError(error.message);
  }
};
