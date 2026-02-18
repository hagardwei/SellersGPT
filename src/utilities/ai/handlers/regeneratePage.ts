import { WebsiteInfo } from "@/payload-types"
import { buildPageContent } from "../pageBuilder"
import { postProcessLayout } from "../postProcessor"
import { reviewContent } from "../reviewer"
import { buildPageSEO } from "../seoBuilder"

export const handleRegeneratePage = async (jobId: any, job: any, payload: any) => {
    const websiteInfo = (await payload.findGlobal({ slug: 'website-info' })) as unknown as WebsiteInfo
    const input = job.input_payload as any
    if (!input || !input.pageId) throw new Error('Invalid regeneration input (missing pageId).')

    await payload.update({
        collection: 'ai-jobs',
        id: jobId,
        data: { step: 'GENERATING_CONTENT' },
    })

    const allPages = await payload.find({
        collection: 'pages',
        limit: 100,
        select: { slug: true },
    })
    const allPlannedSlugs = allPages.docs.map((p: any) => p.slug)
    const enrichedInput = { ...input, allPlannedSlugs }

    const { data: pageData, prompt } = await buildPageContent(enrichedInput, websiteInfo)
    if (!pageData) throw new Error('AI failed to generate page content.')

    await payload.update({
        collection: 'ai-jobs',
        id: jobId,
        data: { prompt },
    })

    // === REVIEWING_CONTENT step ===
    await payload.update({
        collection: 'ai-jobs',
        id: jobId,
        data: { step: 'REVIEWING_CONTENT' },
    })
    console.log(`[AI Orchestrator] Reviewing regenerated content for page: ${input.slug}`)
    const reviewResult = await reviewContent(pageData, {
        pageTitle: input.title || input.slug,
        pageSlug: input.slug,
        brandTone: websiteInfo.brandTone || 'professional',
        industry: websiteInfo.industry || 'general',
        skipAIReview: true, // Skip expensive AI review for regeneration
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

    console.log(`[AI Orchestrator] Regeneration review score: ${reviewResult.score}`)
    // === END REVIEW STEP ===

    const { processedLayout, validationErrors } = await postProcessLayout(pageData.layout, payload)

    const seo = await buildPageSEO(
        input,
        websiteInfo,
        processedLayout,
        reviewResult,
    )

    await payload.update({
        collection: 'ai-jobs',
        id: jobId,
        data: {
            step: 'CREATING_DOCUMENT',
            skipped_blocks: validationErrors as any,
        },
    })

    if (processedLayout.length === 0) {
        throw new Error('All generated blocks failed validation. Page update skipped.')
    }

    try {
        await payload.update({
            collection: 'pages',
            id: input.pageId,
            data: { layout: processedLayout, ...(seo ? { meta: seo.meta } : {}) } as any
        })
        console.log(`[AI Orchestrator] Page ID ${input.pageId} updated successfully`)
    } catch (updateError: any) {
        console.error(`[AI Orchestrator] Failed to update page ID ${input.pageId}:`)
        console.error('Full error object:', JSON.stringify(updateError, Object.getOwnPropertyNames(updateError), 2))
        console.error('[AI Orchestrator] Problematic Layout Snippet (First Block):', JSON.stringify(processedLayout[0], null, 2))
        throw updateError
    }

    await payload.update({
        collection: 'ai-jobs',
        id: jobId,
        data: {
            status: 'completed',
            step: 'COMPLETED',
            completed_at: new Date().toISOString(),
        },
    })
}