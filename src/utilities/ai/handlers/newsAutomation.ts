import { runNewsFetchJob } from "@/utilities/news/newsFetcher";
import { processRawNews } from "@/utilities/news/processNews";
import { BasePayload } from "payload";

export const handleNewsAutomation = async (jobId: string | number, job: any, payload: BasePayload) => {
    console.log(`[News Automation] Starting job ${jobId} with input:`, job.input_payload);

    try{
        // Step 1: Fetch News From APITube

        await payload.update({
            collection: 'ai-jobs' as any,
            id: jobId,
            data: { step: 'FETCHING_NEWS' }
        });

        await runNewsFetchJob(payload);

        //Step 2: Process the raw news into blogs posts

        await payload.update({
            collection: 'ai-jobs' as any,
            id: jobId,
            data: { step: 'PROCESSING_NEWS' }
        });
        await processRawNews(payload);

        // Finalize
        await payload.update({
            collection: 'ai-jobs' as any,
            id: jobId,
            data: {
                status: 'completed',
                step: 'COMPLETED'
            }
        });
        console.log(`[News Automation Handler] Job ${jobId} completed successfully.`);

    } catch (error) {
        console.error(`[News Automation Handler] Job ${jobId} failed:`, error);
        throw error; // Re-throw to be caught by orchestrator
    }
}