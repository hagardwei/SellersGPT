import { getPayload } from 'payload'
import crypto from 'crypto'
import configPromise from '@payload-config'
import { AiJob } from '@/payload-types'
import { planWebsiteStructure } from './planner'
import { buildPageContent, PageContent } from './pageBuilder'
import { postProcessLayout } from './postProcessor'
import { reviewContent, ReviewResult } from './reviewer'
import { WebsiteInfo, Page } from '@/payload-types'
import { buildPageSEO } from './seoBuilder'
import { translateContent } from './translator'
import { aiJobQueue } from '@/lib/redis'
import { should } from 'vitest'
import { handleGenerateWebsite } from './handlers/generateWebsite'
import { handleGeneratePage } from './handlers/generatePage'
import { handleRegeneratePage } from './handlers/regeneratePage'
import { handleTranslateDocument } from './handlers/translateDocument'
import { handleBulkKeyword } from './handlers/bulkKeyWord'
import { handleAgentSync } from './handlers/agentSync'
import { handleNewsAutomation } from './handlers/newsAutomation'


 const MAX_REVIEW_RETRIES = 2
 const MIN_REVIEW_SCORE = 70
 const MAX_RETRIES = 3
//  Main Netry Point for running an AI job.
//  This should be called by the triggering endpoint or a backgrounf worker.

export const runAIJob = async (jobId: string | number): Promise<void> => {
  const payload = await getPayload({config: configPromise})

  let job: AiJob | null = null

  try{
    // 1. Fetch the job
    job = (await payload.findByID({
      collection: 'ai-jobs',
      id: jobId,
    })) as AiJob 


    if (!job) throw new Error('AI job not found')

    if(job.status === 'completed'){
      console.log(`[AI Orchestartor] Job ${jobId} already completed.`);
      return;
    }

    console.log(`[AI Orchestrator] Running Job ${jobId} of type ${job.type}`);




    //2. Route to specific handler

    switch(job.type){
      case 'GENERATE_WEBSITE':
       await handleGenerateWebsite(jobId, job, payload, aiJobQueue);
       break;

      case 'GENERATE_PAGE':
        await handleGeneratePage(jobId, job, payload);
        break;
    
      case 'REGENERATE_PAGE':
        await handleRegeneratePage(jobId, job, payload);
        break;

      // case 'TRANSLATE_DOCUMENT':
      //   await handleTranslateDocument(jobId, job, payload);
      //   break

      case 'BULK_KEYWORD_GENERATION':
        await handleBulkKeyword(jobId, job, payload, aiJobQueue);
        break;

      case 'AGENT_SYNC':
        await handleAgentSync(jobId, job, payload);
        break;

      case 'INDUSTRY_NEWS_AUTOMATION':
        await handleNewsAutomation(jobId, job, payload);
        break
      default:
        throw new Error(`Unknown job type: ${job.type}`)
    }
  } catch (error: any) {
    console.error(`[AI Orchestrator] Job ${jobId} failed. Job object:`, job)
    console.error('Error message:', error.message)
    console.error('Stack trace:', error.stack)
    const retries = (job?.retry_count || 0) + 1;
    // const shouldRetry = retries <= MAX_RETRIES;
    const shouldRetry = false;

    await payload.update({
      collection: 'ai-jobs',
      id: jobId,
      data: {
        status: shouldRetry ? 'pending' : 'failed',
        step: shouldRetry ? 'RETRY_PENDING' : 'FAILED',
        retry_count: retries,
        error: {
          message: error.message,
          stack: error.stack,
        },
      },
    })

    if(shouldRetry){
      console.log(`[AI Orchestrator] Retrying Job ${jobId} in ${Math.pow(2, retries) * 10000}ms`);
      await aiJobQueue.add('ai-job', { aiJobId: jobId }, { delay: Math.pow(2, retries) * 10000 });
    }

    if(job && job.parent_job){
      const parentId = typeof job.parent_job === 'object' ? job.parent_job.id : job.parent_job
      if (parentId) {
        await payload.update({
          collection: 'ai-jobs',
          id: parentId,
          data: {
            status: 'failed',
            error: {
              message: `Child job ${jobId} failed: ${error.message}`,
              stack: error.stack,
            },
          },
        })
      }
    }
  }
}