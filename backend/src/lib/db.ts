import mongoose from "mongoose";

import { databaseConfig } from "../config/database.config";

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseConnection?: Promise<typeof mongoose>;
};

export async function connectDatabase(): Promise<typeof mongoose> {
  if (!databaseConfig.uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  // 1 = connected, 2 = connecting
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
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

  await globalForMongoose.mongooseConnection;
  return mongoose;
}
