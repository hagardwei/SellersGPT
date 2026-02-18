import { buildPageContent } from "../pageBuilder";
import { postProcessLayout } from "../postProcessor";
import { reviewContent } from "../reviewer";
import { buildPageSEO } from "../seoBuilder";
import crypto from 'crypto';
import slugify from 'slugify';

const MIN_REVIEW_SCORE = 70;

export const handleBulkKeyword = async (jobId: any, job: any, payload: any, queue: any) => {
    const currentRetryCount = (job as any).retry_count || 0
    if (job.type === 'BULK_KEYWORD_GENERATION') {
        const { keywords, autoTranslate, triggerSocial } = job.input_payload;
        console.log(`[BulkKeyword] Queued ${keywords.length} keywords for generation`);

        //Create Child jobs per keyword

        for (const keyword of keywords) {
            const slug = slugify(keyword, { lower: true, strict: true });

            const existing = await payload.find({
                collection: 'pages',
                where: { slug: { equals: slug } },
                limit: 1
            })
            console.log(existing, "+++++++++++")
            if (existing.docs.length) {
                console.log(`[BulkKeyword] Skipping existing slug: ${slug}`);
                continue
            }
            const child = await payload.create({
                collection: 'ai-jobs',
                data: {
                    type: 'GENERATE_PAGE',
                    status: 'pending',
                    parent_job: job.id,
                    input_payload: {
                        title: keyword,
                        slug,
                        template: 'seo-article',
                        autoTranslate: job.input_payload.autoTranslate,
                        triggerSocial: job.input_payload.triggerSocial,
                    }
                }
            });
            await queue.add('ai-jobs', {
                aiJobId: child.id,
            });
        }

        //Mark Parent as running
        await payload.update({ collection: 'ai-jobs', id: jobId, data: { status: 'running', step: 'CHILDREN_SPAWNED' } });
        return;
    }

    // ======================================
    // CHILD COMPLETION TRACKING (from page)
    // ======================================
    if (job.parent_job) {
        const parentId =
            typeof job.parent_job === 'object'
                ? job.parent_job.id
                : job.parent_job;

        const parent = await payload.findByID({
            collection: 'ai-jobs',
            id: parentId,
        });

        if (!parent) return;

        const processed = (parent.processed_keywords || 0) + 1;
        const percentage = Math.floor(
            (processed / parent.total_keywords) * 100
        );

        await payload.update({
            collection: 'ai-jobs',
            id: parentId,
            data: {
                processed_keywords: processed,
                completion_percentage: percentage,
                status:
                    processed === parent.total_keywords
                        ? 'completed'
                        : 'running',
            },
        });

        console.log(
            `[BulkKeyword] Parent progress: ${processed}/${parent.total_keywords}`
        );
    }

    // if (job.type === 'GENERATE_KEYWORD_ARTICLE') {
    //     const { keyword, autoTranslate, triggerSocial } = job.input_payload;

    //     if (!keyword) throw new Error('Missing Keyword');

    //     const websiteInfo = await payload.findGlobal({ slug: 'website-info' });
    //     const slug = slugify(keyword, { lower: true, strict: true });

    //     //Slug deduplication
    //     const existing = await payload.find({
    //         collection: 'pages',
    //         where: { slug: { equals: slug } },
    //         limit: 1
    //     })

    //     if (existing.docs.length) {
    //         console.log(`Skipping existing slug: ${slug}`);
    //         return;
    //     }

    //     await payload.update({
    //         collection: 'ai-jobs',
    //         id: job.id,
    //         data: { step: 'GENERATING_CONTENT' }
    //     });

    //     const { data: pageData } = await buildPageContent({ keyword }, websiteInfo);
    //     if (!pageData) throw new Error(`AI failed for keyword=${keyword}`);

    //     const reviewResult = await reviewContent(pageData, {
    //         pageTitle: keyword,
    //         pageSlug: "",
    //         brandTone: websiteInfo.brandTone || 'professional',
    //         industry: websiteInfo.industry || 'general',
    //         skipAIReview: currentRetryCount > 0,
    //     });

    //     if (!reviewResult.approved || reviewResult.score < MIN_REVIEW_SCORE) {
    //         throw new Error(`Review score too low: ${reviewResult.score}`);
    //     }

    //     const { processedLayout } = await postProcessLayout(pageData.layout, payload);
    //     if (!processedLayout.length) throw new Error(`All blocks failed validation for keyword=${keyword}`);

    //     const seo = await buildPageSEO({ title: keyword, slug: keyword.toLowerCase().replace(/\s+/g, '-') }, websiteInfo, processedLayout);

    //     const page = await payload.create({
    //         collection: 'pages',
    //         data: {
    //             title: keyword,
    //             slug: keyword.toLowerCase().replace(/\s+/g, '-'),
    //             layout: processedLayout,
    //             meta: seo.meta,
    //             _status: 'published',
    //             language: 'en',
    //             translation_group_id: crypto.randomUUID(),
    //         },
    //         context: { aijob: true },
    //     });

    //     console.log(`[BulkKeyword] Page created for keyword=${keyword}, id=${page.id}`);


    //     // ==========================
    //     // AUTO TRANSLATE
    //     // ==========================
    //     if (autoTranslate) {
    //         const supportedLanguages = ['es', 'de', 'fr', 'it', 'pt', 'nl', 'hi'];

    //         for (const lang of supportedLanguages) {
    //             const translationJob = await payload.create({
    //                 collection: 'ai-jobs',
    //                 data: {
    //                     type: 'TRANSLATE_DOCUMENT',
    //                     status: 'pending',
    //                     parent_job: job.parent_job,
    //                     target_language: lang,
    //                     input_payload: {
    //                         sourceDocId: page.id,
    //                         collection: 'pages'
    //                     }
    //                 }
    //             });

    //             await queue.add('translation-jobs', { aiJobId: translationJob.id });
    //         }
    //     }

    //     const parent = await payload.findByID({
    //         collection: 'ai-jobs',
    //         id: job.parent_job
    //     });

    //     const processed = (parent.processed_keywords || 0) + 1;
    //     const percentage = Math.floor((processed / parent.total_keywords) * 100);

    //     //Update parent job progress
    //     if (job.parent_job) {
    //         const parent = await payload.findByID({ collection: 'ai-jobs', id: job.parent_job });
    //         await payload.update({
    //             collection: 'ai-jobs',
    //             id: parent.id,
    //             data: {
    //                 processed_keywords: processed,
    //                 completion_percentage: percentage,
    //                 status: processed === parent.total_keywords ? 'completed' : 'running', step: 'COMPLETED', output_payload: pageData
    //             }
    //         })
    //     }

    // }
}