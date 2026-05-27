import mongoose from "mongoose";

import { databaseConfig } from "../config/database.config";

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseConnection?: Promise<typeof mongoose>;
};

export async function connectDatabase(): Promise<typeof mongoose> {
  if (!databaseConfig.uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (!globalForMongoose.mongooseConnection) {
    globalForMongoose.mongooseConnection = mongoose.connect(
      databaseConfig.uri,
      databaseConfig.options,
    );
  }

  return globalForMongoose.mongooseConnection;
}
