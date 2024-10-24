import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { connectToDatabase, getDatabase } from "./config/mongodb.js";
import dotenv from "dotenv";

dotenv.config();

// Importing the resolvers and typeDefs
import userResolvers from "./graphql/resolvers/resolverUser.js";
import userTypeDefs from "./graphql/schemas/schemaUser.js";
import postResolver from "./graphql/resolvers/resolverPost.js";
import postTypeDefs from "./graphql/schemas/schemaPost.js";
import followResolver from "./graphql/resolvers/resolverFollow.js";
import followTypeDefs from "./graphql/schemas/schemaFollow.js";

// Importing the authentication middleware
import { authentication } from "./middlewares/auth.js";

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
  resolvers: [userResolvers, postResolver, followResolver],
  introspection: true,
});

(async function startServer() {
  try {
    await connectToDatabase();
    const db = getDatabase();

    const { url } = await startStandaloneServer(server, {
      listen: { port: process.env.PORT || 4000 },
      context: async ({ req }) => {
        return {
          db,
          authentication: () => authentication(req),
        };
      },
    });

    console.log(`🚀 Server ready at: ${url}`);
  } catch (error) {
    console.error("Failed to start the server", error);
  }
})();
