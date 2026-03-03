import { CollectionAfterChangeHook } from "payload";
import { aiJobQueue } from "@/lib/redis";

export const triggerAgentSync: CollectionAfterChangeHook = async ({
    doc,
    req: { payload },
    collection
}) => {
    // Spawn translation jobs
        console.log(`[Agent Sync] Creating AGENT_SYNC job for doc ${doc}`);

        // if(doc.status == 'published'){
            const job = await payload.create({
                collection: 'ai-jobs',
                data: {
                    type: "AGENT_SYNC",
                    status: 'pending',
                    input_payload: {
                        sourceId: doc.id,
                        collection: collection.slug,
                        sourceType: collection.slug === 'posts' ? 'post' : 'page'
                    }
                }
            });
            console.log(`[Agent Sync] Job created with ID ${job.id} for doc ${doc.id}`);
    
            // Trigger job in background
            await aiJobQueue.add(
                `ai-job-${job.id}`,
                { aiJobId: job.id },
                {
                    attempts: 3,
                    backoff: { type: 'exponential', delay: 5000 },
                    removeOnComplete: true
                }
            );
    
            console.log(`[AGENT_SYNC] Job ${job.id} queued in aiJobQueue for doc ${doc.id}`);
        // }

};
