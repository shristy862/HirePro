import mongoose from "mongoose";

import { databaseConfig } from "../config/database.config";

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseConnection?: Promise<typeof mongoose>;
};

export async function connectDatabase(): Promise<typeof mongoose> {
  if (!databaseConfig.uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  // 1 = connected
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!globalForMongoose.mongooseConnection) {
    globalForMongoose.mongooseConnection = mongoose
      .connect(databaseConfig.uri, databaseConfig.options)
      .catch((error) => {
        // Reset cached promise on failure so next request can retry.
        globalForMongoose.mongooseConnection = undefined;
        throw error;
      });
  }

  // If connecting, await the in-flight promise instead of returning early.
  await globalForMongoose.mongooseConnection;
  return mongoose;
}
