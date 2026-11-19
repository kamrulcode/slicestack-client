import { MongoClient, ObjectId } from "mongodb";

const mongoUrl = process.env.MONGODB_URL;

if (!mongoUrl) {
  throw new Error("MONGODB_URL must be set to connect to MongoDB.");
}

/**
 * Reuse one client across hot reloads in development (Next.js re-evaluates
 * modules on change) and across Better Auth + application queries.
 */
const globalForMongo = globalThis as typeof globalThis & {
  __slicestackMongoClient?: MongoClient;
};

export const mongoClient =
  globalForMongo.__slicestackMongoClient ?? new MongoClient(mongoUrl);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.__slicestackMongoClient = mongoClient;
}

export const db = mongoClient.db("slicestack");

/** Convert a Better Auth user id (24-char hex string) to a Mongo ObjectId. */
export function objectIdFromString(value: string): ObjectId | null {
  return ObjectId.isValid(value) ? new ObjectId(value) : null;
}
