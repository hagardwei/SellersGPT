import { getPayload } from "payload"
import configPromise from '@payload-config'
import { aiJobQueue } from "@/lib/redis"

export async function GET(req: Request) {
    const authHeader = req.headers.get('authorization')
    // if(authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return new Response('Unauthorized', { status: 401 })
    // }

    const payload = await getPayload({ config: configPromise })

    try {
        console.log('[Cron] Triggering Industry News Automation...');

        // 1. Create the job
        const job = await payload.create({
            collection: 'ai-jobs',
            data: {
                type: 'INDUSTRY_NEWS_AUTOMATION' as any,
                status: 'pending',
                input_payload: {
                    triggeredBy: 'cron'
                }
            }
        })

        // 2. Enqueue the job for the worker
        await aiJobQueue.add('ai-job', { aiJobId: job.id }) 

        return Response.json({ success: true, jobId: job.id })
    } catch (error: any) {
        console.error('[Cron] Error triggering Industry News Automation:', error);
        return Response.json({ success: false, error: error.message }, { status: 500 })
    }
}