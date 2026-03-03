import { aiJobQueue } from "@/lib/redis";

// Add a bew AI Job to the queue

export const addAIJob = async (aiJobId: string, type:string) => {
    await aiJobQueue.add(
        type,
        { aiJobId },
        {
            attempts: 3,
            backoff: {type: 'exponential', delay: 5000},
            removeOnComplete: true,
            removeOnFail: false
        }
    )
}