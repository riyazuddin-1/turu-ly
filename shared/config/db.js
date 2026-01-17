import { MongoClient, ObjectId } from "mongodb";
import { MONGODB_URI } from "./env.js";

const client = new MongoClient(MONGODB_URI);
client
  .connect()
  .then(() => {
    console.log("Connected successfully to server");
  })
  .catch((e) => {
    console.error(e);
  });

const shutdown = () => {
  console.log("\nShutting down the server...\n");
  client.close();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export default client;
