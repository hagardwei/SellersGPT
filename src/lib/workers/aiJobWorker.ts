import 'dotenv/config';
import {Worker, QueueEvents} from 'bullmq';
import { connection } from '@/lib/redis';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { runAIJob } from '@/utilities/ai/orchestrator';


const worker = new Worker('ai-jobs', async (job) => {
    const payload = await getPayload({config: configPromise});
    const { aiJobId } = job.data;

    // Idempotency: skip already completed jobs
    const existingJob = await payload.findByID({ collection: 'ai-jobs', id: aiJobId });
    if (!existingJob) throw new Error('Job not found');
    if (existingJob.status === 'completed') return;

    try{
        await payload.update({
            collection: 'ai-jobs',
            id: aiJobId,
            data: {status: 'running', step: 'STARTED'},
        });

        await runAIJob(aiJobId);

        await payload.update({
            collection: 'ai-jobs',
            id: aiJobId,
            data: {status: 'completed', step: 'COMPLETED'}
        });
    } catch (err: any) {
        await payload.update({
            collection: 'ai-jobs',
            id: aiJobId,
            data: {status: 'failed', error: {message: err.message}, step: 'FAILED'},
        });

        throw err;
    }
}, {connection, concurrency: 5});

// Queue events for logging & dashboard
const queueEvents = new QueueEvents('ai-jobs', { connection });

queueEvents.on('completed', ({ jobId }) => {
  console.log(`[Worker] Job ${jobId} completed successfully.`);
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
  console.error(`[Worker] Job ${jobId} failed: ${failedReason}`);
});

export default worker;