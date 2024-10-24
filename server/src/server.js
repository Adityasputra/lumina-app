import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { connectToDatabase, getDatabase } from "./config/mongodb";

if (process.env.NODE_ENV === "production") {
  require("dotenv").config();
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

(async function startServer() {
  try {
    await connectToDatabase();
    const db = getDatabase();

    const { url } = await startStandaloneServer(server, {
      listen: { port: process.env.PORT || 4000 },
      context: async () => ({
        db,
      }),
    });

    console.log(`🚀 Server ready at: ${url}`);
  } catch (error) {
    console.error("Failed to start the server", error);
  }
})();
