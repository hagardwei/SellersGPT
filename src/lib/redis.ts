import { Queue } from 'bullmq';
import Redis from 'ioredis';

let connectionCount = 0;


function createRedisConnection(name: string) {
  const redis = new Redis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  connectionCount++;

  return redis;
}

// Single Redis instance for BullMQ (reused)
export const bullConnection =  createRedisConnection('bullConnection');

// Queue for AI jobs
export const aiJobQueue = new Queue('ai-jobs', { connection: bullConnection });
