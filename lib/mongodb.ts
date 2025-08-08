import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Fix for TypeScript: extend the global type
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGODB_URI) {
  throw new Error("❌ Please add MONGODB_URI to your .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect()
      .then((client) => {
        console.log("✅ Connected to MongoDB (dev)");
        return client;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error (dev):", err);
        throw err;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect()
    .then((client) => {
      console.log("✅ Connected to MongoDB (prod)");
      return client;
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error (prod):", err);
      throw err;
    });
}

export default clientPromise;

