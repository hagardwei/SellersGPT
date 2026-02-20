import { WebsiteInfo } from "@/payload-types"
import { buildPageContent } from "../pageBuilder"
import { postProcessLayout } from "../postProcessor"
import { buildPageSEO } from "../seoBuilder"
import { reviewContent } from "../reviewer"

export const handleGeneratePage = async (jobId: any, job: any, payload: any) => {
    const websiteInfo = (await payload.findGlobal({ slug: 'website-info' })) as unknown as WebsiteInfo
    const input = job.input_payload as any
    const currentRetryCount = (job as any).retry_count || 0

    if (!input || !input.slug) throw new Error('Invalid page input payload')

    console.log(`[AI Orchestrator] Starting page generation for ${input.slug}  (attempt ${currentRetryCount + 1})`)
    console.log(`Input payload: `, JSON.stringify(input, null, 2))

    if (input.template === "seo-article") {
        input.blocks = [
            "hero",
            "tableOfContents",
            "content",
            "featureGrid",
            "content",
            "faq",
            "relatedPosts",
            "cta",
        ]
    }

    await payload.update({
        collection: 'ai-jobs',
        id: jobId,
        data: { step: 'GENERATING_CONTENT' },
    })

    const { data: pageData, prompt } = await buildPageContent(input, websiteInfo)
    console.log(pageData, "*********")

    if (!pageData) throw new Error(`AI failed to generate page content.`)

    await payload.update({
        collection: 'ai-jobs',
        id: jobId,
        data: {
            prompt: prompt,
            output_payload: { ai_output: pageData as any },
        } as any,
    })

    //REVIEWING_CONTENT Step

    await payload.update({
        collection: 'ai-jobs',
        id: jobId,
        data: { step: 'REVIEWING_CONTENT' }
    })

    console.log(`[AI Orchestrator] Reviewing content for ${input.slug}`)

    const reviewResult = await reviewContent(pageData, {
        pageTitle: input.title || input.slug,
        pageSlug: input.slug,
        brandTone: websiteInfo.brandTone || 'professional',
        industry: websiteInfo.industry || 'general',
        skipAIReview: currentRetryCount > 0,
    })

    // Store review results

    await payload.update({
        collection: 'ai-jobs',
        id: jobId,
        data: {
            review_score: reviewResult.score,
            review_issues: {
                seoIssues: reviewResult.seoIssues,
                contentIssues: reviewResult.contentIssues,
                suggestions: reviewResult.suggestions,
            },
        } as any,
    })
    console.log(`[AI Orchestrator] Review score: ${reviewResult.score}, Approved: ${reviewResult.approved}`)

    // Check if we need to retry due to low score
    // if(!reviewResult.approved && currentRetryCount < MAX_REVIEW_RETRIES){
    //   console.log(`[AI Orchestrator] Score below ${MIN_REVIEW_SCORE}, triggering retry (${currentRetryCount + 1}/${MAX_REVIEW_RETRIES})`)

    //   await payload.update({
    //     collection: 'ai-jobs',
    //     id: jobId,
    //     data: {
    //       status: 'pending',
    //       step: 'PENDING_RETRY',
    //       retry_count: currentRetryCount + 1,
    //       retry_reason: `Review score ${reviewResult.score} below threshold ${MIN_REVIEW_SCORE}`,
    //     } as any,
    //   })

    //   //recursive retry
    //   return runAIJob(jobId)
    // }

    //END REVIEW STEP

    const { processedLayout, validationErrors } = await postProcessLayout(pageData.layout, payload)
    console.log(`Processed Layout length: ${processedLayout.length}`)
    if (processedLayout.length > 0) {
        console.log('First block snippet:', JSON.stringify(processedLayout[0], null, 2))
    } else {
        console.warn('[AI Orchestrator] Processed layout is empty! All blocks may have failed validation.')
    }

    await payload.update({
        collection: 'ai-jobs',
        id: jobId,
        data: {
            step: 'CREATING_DOCUMENT',
            skipped_blocks: validationErrors as any,
        },
    })

    if (processedLayout.length === 0) {
        throw new Error('All generated blocks failed validation. No page created.')
    }

    let pageIdToUpdate: string | number | null = null
    console.log(`[AI Orchestrator] Checking if page exists with slug="${input.slug}"`)

    const seo = await buildPageSEO(input, websiteInfo, processedLayout)

    const existingPages = await payload.find({
        collection: 'pages',
        where: {
            slug: { equals: input.slug }
        },
        limit: 1
    })
    console.log('[AI Orchestrator] Existing pages result:', JSON.stringify(existingPages, null, 2))

    if (existingPages?.docs?.length > 0) {
        pageIdToUpdate = existingPages?.docs[0]?.id
        console.log(`[AI Orchestrator] Page already exists: ID=${pageIdToUpdate}, slug=${input.slug}. Switching to update mode.`)
    }

    let resultPage
    try {
        const normalizedLayout = processedLayout
            .filter(Boolean)
            .map((block: any, index: number) => {
                if (!block.blockType) {
                    console.warn(
                        `[AI Orchestrator] Dropping block at index ${index} — missing blockType`
                    )
                    return null
                }
                return {
                    ...block,
                }
            })
            .filter(Boolean)

        const pageDataToSave = {
            title: input.title,
            slug: input.slug,
            layout: normalizedLayout,
            meta: seo?.meta,
            _status: 'published',
            language: 'en',
            publishedAt: new Date().toISOString(),
        }

        console.log('[AI Orchestrator] Final page data to save:', JSON.stringify(pageDataToSave, null, 2))

        if (pageIdToUpdate) {
            console.log(`[AI Orchestrator] Updating page ID=${pageIdToUpdate} with data:`, JSON.stringify(pageDataToSave, null, 2))
            resultPage = await payload.update({
                collection: 'pages',
                id: pageIdToUpdate,
                data: pageDataToSave as any,
            })
        } else {
            const creationData = {
                ...pageDataToSave,
                translation_group_id: crypto.randomUUID(),
            }

            console.log(`[AI Orchestrator] Creating page with data:`, JSON.stringify(creationData, null, 2))
            resultPage = await payload.create({
                collection: 'pages',
                data: creationData as any,
                context: {
                    aiJob: true,
                },
            })
        }
        console.log(`[AI Orchestrator] Page saved successfully: ID=${resultPage.id}, slug=${input.slug}`)

    } catch (saveError: any) {
        console.error(`[AI Orchestrator] Failed to save page "${input.slug}":`)
        console.error('Error message:', saveError.message)
        console.error('Full error object:', JSON.stringify(saveError, Object.getOwnPropertyNames(saveError), 2))
        if (processedLayout && processedLayout.length > 0) {
            console.error('[AI Orchestrator] Problematic Layout Snippet (First Block):', JSON.stringify(processedLayout[0], null, 2))
        }
        throw saveError
    }

    if (resultPage) {
        await payload.update({
            collection: 'ai-jobs',
            id: jobId,
            data: {
                status: 'completed',
                step: 'COMPLETED',
                output_payload: { ai_output: pageData as any, pageId: resultPage.id, seo },
                completed_at: new Date().toISOString(),
            }
        })
    }

}