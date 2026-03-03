import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URL!)

export async function rateLimit(ip: string) {
  const key = `chat_limit:${ip}`

  const count = await redis.incr(key)

  if (count === 1) {
    await redis.expire(key, 60) // 60 seconds window
  }

  return count <= 20 // 20 requests per minute
}