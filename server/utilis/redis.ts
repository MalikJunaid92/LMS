import { Redis } from "ioredis";
require("dotenv").config();

let redisInstance: Redis | null = null;

export const redis = (() => {
  if (!redisInstance) {
    if (process.env.REDIS_URL) {
      redisInstance = new Redis(process.env.REDIS_URL);
      redisInstance.on("connect", () => console.log("Redis connected"));
      redisInstance.on("error", (err) => console.error("Redis connection error:", err));
    } else {
      throw new Error("REDIS_URL not configured in environment variables");
    }
  }
  return redisInstance;
})();
