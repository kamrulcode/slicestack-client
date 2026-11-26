import { MongoClient, ObjectId } from "mongodb";

const mongoUrl = process.env.MONGODB_URL;

if (!mongoUrl) {
  throw new Error("MONGODB_URL must be set to connect to MongoDB.");
}

const DATABASE_NAME = "slicestack";

type MongoGlobal = typeof globalThis & {
  __slicestackMongoClient?: MongoClient;
  __slicestackMongoClientPromise?: Promise<MongoClient>;
};

const globalForMongo = globalThis as MongoGlobal;

/**
 * Keep one MongoClient and one in-flight connection promise per Node.js
 * runtime. Caching the promise prevents concurrent cold requests or Next.js
 * module reloads from starting overlapping connection attempts.
 *
 * Connect before exporting the database. Better Auth's MongoDB adapter starts
 * creating its indexes when the adapter is initialized, so the connection
 * must be ready before auth.ts creates that adapter.
 *
 * Do not close this client in request handlers. A MongoClient becomes
 * permanently unusable after close(); the shared client must live for the
 * lifetime of this serverless runtime.
 */
export const mongoClient =
  globalForMongo.__slicestackMongoClient ?? new MongoClient(mongoUrl);

globalForMongo.__slicestackMongoClient = mongoClient;

const mongoClientPromise =
  globalForMongo.__slicestackMongoClientPromise ?? mongoClient.connect();

globalForMongo.__slicestackMongoClientPromise = mongoClientPromise;

try {
  await mongoClientPromise;
} catch (error) {
  // Do not leave a rejected connection promise in the global cache. A fresh
  // server runtime can then create a new client instead of reusing a failed one.
  if (globalForMongo.__slicestackMongoClient === mongoClient) {
    delete globalForMongo.__slicestackMongoClient;
    delete globalForMongo.__slicestackMongoClientPromise;
  }

  throw error;
}

export const db = mongoClient.db(DATABASE_NAME);

/** Convert a Better Auth user id (24-char hex string) to a Mongo ObjectId. */
export function objectIdFromString(value: string): ObjectId | null {
  return ObjectId.isValid(value) ? new ObjectId(value) : null;
}
