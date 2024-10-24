import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGO_URI;
const client = new MongoClient(mongoUri);

export const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Failed to connect to the database", error);
    await client.close();
  }
};

export const getDatabase = () => {
  return client.db("lumina_db");
};
