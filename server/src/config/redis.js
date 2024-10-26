import Redis from "ioredis";
const redis = new Redis();

export const getCachedData = async (key) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

export const setCacheData = async (key, value, ttl) => {
  await redis.set(key, JSON.stringify(value), "EX", ttl);
};
