import { AiJob, WebsiteInfo } from "@/payload-types"
import { planWebsiteStructure } from "../planner"
import { aiJobQueue } from "@/lib/redis"

export const handleGenerateWebsite = async (jobId: any, job: AiJob, payload: any, queue: any) => {
    const websiteInfo = (await payload.findGlobal({ slug: 'website-info'})) as unknown as WebsiteInfo

    await payload.update({
        collection: 'ai-jobs',
        id: jobId,
        data: {step: 'PLANNING'}
    })

    const { data: plan, prompt } = await planWebsiteStructure(websiteInfo)

    if(!plan) throw new Error('AI failed to generate a website plan')

    await payload.update({
        collection: 'ai-jobs',
        id: jobId,
        data: {
            output_payload: plan as any,
            prompt: prompt,
            step: 'SPAWING_PAGES'
        } as any,
    })

    console.log(`[AI Orchestartor] Website plan created with ${plan?.pages?.length} pages`)

    const allPlannedSlugs = plan.pages.map((p: any) => p.slug)
    for(const p of plan.pages){
        console.log(`[AI Orchestartor] Creating child job for page ${p.slug}`)

        if(!job.id){
            throw new Error('Parent job has no id - cannot create child jobs')
        }

        const childJob = await payload.create({
            collection: 'ai-jobs',
            data: {
                type: 'GENERATE_PAGE',
                status: 'pending',
                parent_job: job.id,
                input_payload: {
                    slug: p.slug,
                    title: p.title,
                    block: p.blocks,
                    allPlannedSlugs: allPlannedSlugs,
                }
            }
        })

        console.log(`[AI Orchestrator] Child job created with ID: ${childJob.id}`)
        console.log(`[AI Orchestrator] Running Child job for page: ${p.slug}`)

        await queue.add('ai-job', { aiJobId: childJob.id });
    }

    await payload.update({
        collection: 'ai-jobs',
        id: job.id,
        data: { status: 'completed', step: 'COMPLETED', completed_at: new Date().toISOString() },
    });
};   