const requiredEnvVars = ["MONGODB_URI", "NEXTAUTH_SECRET"] as const;

export function getEnv(key: (typeof requiredEnvVars)[number]): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  mongodbUri: process.env.MONGODB_URI ?? "",
  nextAuthSecret: process.env.NEXTAUTH_SECRET ?? "",
  nodeEnv: process.env.NODE_ENV ?? "development",
} as const;
