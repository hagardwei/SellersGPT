import { TaskConfig } from 'payload'
import { aiJobQueue } from '@/lib/redis'

export const newsAutomationTask: any = {
  slug: 'newsAutomation',
  inputSchema: [
    {
      name: 'triggeredBy',
      type: 'text',
      defaultValue: 'native-cron',
    },
  ],
  handler: async ({ payload, input }: any) => {
    payload.logger.info('[Task] Triggering Industry News Automation...')
    console.log("+++++ News Automation Task Running +++++")

    try {
      // 1. Create the AI Job
      const job = await payload.create({
        collection: 'ai-jobs' as any,
        data: {
          type: 'INDUSTRY_NEWS_AUTOMATION' as any,
          status: 'pending',
          input_payload: {
            triggeredBy: input?.triggeredBy || 'native-cron',
          },
        },
      })

      // 2. Enqueue the job for the BullMQ worker
      await aiJobQueue.add('ai-job', { aiJobId: job.id })

      return {
        output: {
          success: true,
          jobId: job.id,
        },
      }
    } catch (error: any) {
      payload.logger.error(`[Task] Error triggering News Automation: ${error.message}`)
      throw error
    }
  },
  schedule: [
    {
      cron: '* * * * *', // Every minute for testing
    },
  ],
}
