import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { AiJob } from '@/payload-types'
import { planWebsiteStructure } from './planner'
import { buildPageContent } from './pageBuilder'
import { postProcessLayout } from './postProcessor'
import { WebsiteInfo, Page } from '@/payload-types'

/**
 * Main entry point for running an AI job.
 * This should be called by the triggering endpoint or a background worker.
 */
export const runAIJob = async (jobId: string | number) => {
    const payload = await getPayload({ config: configPromise })

    let job: AiJob | null = null

    try {
        // 1. Fetch the job
        job = await payload.findByID({
            collection: 'ai-jobs',
            id: jobId,
        }) as AiJob

        if (!job || job.status !== 'pending') {
            console.warn(`[AI Orchestrator] Job ${jobId} not found or not in pending state.`)
            return
        }

        // 2. Mark as running
        await payload.update({
            collection: 'ai-jobs',
            id: jobId,
            data: {
                status: 'running',
                step: 'INITIALIZATION',
            }
        })

        console.log(`[AI Orchestrator] Starting job ${jobId} of type ${job.type}`)

        // 3. Route to specific handler
        switch (job.type) {
            case 'GENERATE_WEBSITE': {
                // 1. Get business context
                const websiteInfo = await payload.findGlobal({
                    slug: 'website-info'
                }) as unknown as WebsiteInfo

                // 2. Run the plan
                await payload.update({
                    collection: 'ai-jobs',
                    id: jobId,
                    data: { step: 'PLANNING' }
                })

                const { data: plan, prompt } = await planWebsiteStructure(websiteInfo)

                if (!plan) throw new Error('AI failed to generate a website plan.')

                // 3. Save the plan to output and store prompt
                await payload.update({
                    collection: 'ai-jobs',
                    id: jobId,
                    data: {
                        output_payload: plan as any,
                        prompt: prompt,
                        step: 'SPAWNING_PAGES'
                    } as any
                })

                // 4. Create child jobs for each page
                for (const p of plan.pages) {
                    await payload.create({
                        collection: 'ai-jobs',
                        data: {
                            type: 'GENERATE_PAGE',
                            status: 'pending',
                            parent_job: job.id,
                            input_payload: {
                                slug: p.slug,
                                title: p.title,
                                blocks: p.blocks
                            }
                        }
                    })
                }

                // 5. Mark master job as completed
                await payload.update({
                    collection: 'ai-jobs',
                    id: jobId,
                    data: {
                        status: 'completed',
                        step: 'COMPLETED',
                        completed_at: new Date().toISOString()
                    }
                })
                break
            }
            case 'GENERATE_PAGE': {
                // 1. Get business context
                const websiteInfo = await payload.findGlobal({
                    slug: 'website-info'
                }) as unknown as WebsiteInfo

                const input = job.input_payload as any
                if (!input || !input.slug) throw new Error('Invalid page input payload.')

                // 2. Generate content
                await payload.update({
                    collection: 'ai-jobs',
                    id: jobId,
                    data: { step: 'GENERATING_CONTENT' }
                })

                const { data: pageData, prompt } = await buildPageContent(input, websiteInfo)

                if (!pageData) throw new Error('AI failed to generate page content.')

                // Save prompt to job
                await payload.update({
                    collection: 'ai-jobs',
                    id: jobId,
                    data: {
                        prompt: prompt,
                        output_payload: { ai_output: pageData as any }
                    } as any
                })

                // 3. Post-process: Convert strings to Lexical JSON, upload Media, and transform Links
                const processedLayout = await postProcessLayout(pageData.layout, payload)

                // 4. Create the page
                await payload.update({
                    collection: 'ai-jobs',
                    id: jobId,
                    data: { step: 'CREATING_DOCUMENT' }
                })

                let newPage;
                try {
                    newPage = await payload.create({
                        collection: 'pages',
                        data: {
                            title: input.title || input.slug,
                            slug: input.slug,
                            layout: processedLayout,
                            _status: 'published',
                            language: 'en',
                        } as any,
                    })
                } catch (createError: any) {
                    console.error(`[AI Orchestrator] Failed to create page "${input.slug}":`)
                    console.error(createError) // Log full error object for non-stringifiable properties

                    if (createError.data) {
                        console.error('[AI Orchestrator] Validation Details:', JSON.stringify(createError.data, null, 2))
                    }

                    // Log a snippet of the problematic layout for debugging
                    console.error('[AI Orchestrator] Problematic Layout Snippet (First Block):', JSON.stringify(processedLayout[0], null, 2))

                    throw createError
                }

                // 5. Mark as completed
                await payload.update({
                    collection: 'ai-jobs',
                    id: jobId,
                    data: {
                        status: 'completed',
                        step: 'COMPLETED',
                        output_payload: { ai_output: pageData as any, pageId: newPage.id },
                        completed_at: new Date().toISOString()
                    }
                })

                break
            }
            case 'REGENERATE_PAGE': {
                // 1. Get business context
                const websiteInfo = await payload.findGlobal({
                    slug: 'website-info'
                }) as unknown as WebsiteInfo

                const input = job.input_payload as any
                if (!input || !input.pageId) throw new Error('Invalid regeneration input payload (missing pageId).')

                // 2. Refresh page data from AI
                await payload.update({
                    collection: 'ai-jobs',
                    id: jobId,
                    data: { step: 'GENERATING_CONTENT' }
                })

                const { data: pageData, prompt } = await buildPageContent(input, websiteInfo)
                if (!pageData) throw new Error('AI failed to generate page content.')

                // Save prompt to job
                await payload.update({
                    collection: 'ai-jobs',
                    id: jobId,
                    data: {
                        prompt: prompt
                    } as any
                })

                // 3. Post-process: Convert strings to Lexical JSON, upload Media, and transform Links
                const processedLayout = await postProcessLayout(pageData.layout, payload)

                // 3. Update the existing page
                await payload.update({
                    collection: 'ai-jobs',
                    id: jobId,
                    data: { step: 'CREATING_DOCUMENT' }
                })

                try {
                    await payload.update({
                        collection: 'pages',
                        id: input.pageId,
                        data: {
                            layout: processedLayout,
                        } as any
                    })
                } catch (updateError: any) {
                    console.error(`[AI Orchestrator] Failed to update page ID ${input.pageId}:`)
                    console.error(updateError)

                    if (updateError.data) {
                        console.error('[AI Orchestrator] Validation Details:', JSON.stringify(updateError.data, null, 2))
                    }

                    console.error('[AI Orchestrator] Problematic Layout Snippet (First Block):', JSON.stringify(processedLayout[0], null, 2))
                    throw updateError
                }

                // 4. Mark as completed
                await payload.update({
                    collection: 'ai-jobs',
                    id: jobId,
                    data: {
                        status: 'completed',
                        step: 'COMPLETED',
                        completed_at: new Date().toISOString()
                    }
                })
                break
            }
            default:
                throw new Error(`Unknown job type: ${job.type}`)
        }

    } catch (error: any) {
        console.error(`[AI Orchestrator] Job ${jobId} failed:`, error)

        await payload.update({
            collection: 'ai-jobs',
            id: jobId,
            data: {
                status: 'failed',
                error: {
                    message: error.message,
                    stack: error.stack,
                }
            }
        })

        // 6. Failure Bubbling: If this was a child job, mark parent as failed
        if (job && job.parent_job) {
            const parentId = typeof job.parent_job === 'object' ? job.parent_job.id : job.parent_job
            await payload.update({
                collection: 'ai-jobs',
                id: parentId,
                data: {
                    status: 'failed',
                    error: {
                        message: `Child job ${jobId} failed: ${error.message}`,
                        stack: error.stack,
                    }
                }
            })
        }
    }
}
