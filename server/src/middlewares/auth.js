import { GraphQLError } from "graphql";
import { getDatabase } from "../config/mongodb";
import { verifyToken } from "../utils/jwt";

export const authentication = async (req) => {
  try {
    const db = getDatabase();
    if (!req.headers.authorization)
      throw new GraphQLError("You must be logged in to access this resource");

    const token = req.headers.authorization.split(" ")[1];
    if (!token)
      throw new GraphQLError("You must be logged in to access this resource");

    const verifiedToken = verifyToken(token);
    if (!verifiedToken) throw new GraphQLError("Invalid token");

    const user = await db
      .collection("users")
      .findOne({ _id: verifiedToken.id });

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
