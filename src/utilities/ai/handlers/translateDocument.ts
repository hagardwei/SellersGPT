import { WebsiteInfo } from "@/payload-types";
import { postProcessLayout } from "../postProcessor";
import { translateContent } from "../translator";
import { buildPageSEO } from "../seoBuilder";

export const handleTranslateDocument = async (jobId: any, job: any, payload: any) => {
    const input = job.input_payload as any;
    if (!input.sourceDocId) throw new Error('Invalid translation input.');

    //Fetch source document
    const sourceDoc = await payload.findByID({
        collection: input.collection,
        id: input.sourceDocId,
    });

    if (!sourceDoc) throw new Error('Source document not found');
    //run translation
    const { data: translatedContent } = await translateContent(
        sourceDoc as any,
        job.target_language,
        'en'
    );

    // Clone layout to avoid mutating cached translations
    const layoutToProcess = JSON.parse(JSON.stringify(translatedContent.layout));
    console.log(layoutToProcess, "********************")
    //Post Process layout
    const { processedLayout, validationErrors } = await postProcessLayout(layoutToProcess, payload);

    if (processedLayout.length === 0) {
        throw new Error('All translated blocks failed validation. Page creation skipped.');
    }

    //Check if tranaslated page already exists
    const translatedSlug = `${sourceDoc.slug}`;
    const existingPages = await payload.find({
        collection: 'pages',
        where: {
            and: [
                {
                    slug: {
                        equals: translatedSlug,
                    },
                },
                {
                    id: {
                        not_equals: sourceDoc.id,
                    },
                },
            ],
        },
        limit: 1,
    });

    const pageIdToUpdate = existingPages.docs.length ? existingPages.docs[0].id : null;
    console.log(pageIdToUpdate, "pageIdToUpdateeeeeeeee")
    // Build SEO for translated page
    const websiteInfo = (await payload.findGlobal({ slug: 'website-info' })) as WebsiteInfo;
    const seo = await buildPageSEO(
        { title: sourceDoc.title, slug: translatedSlug },
        websiteInfo,
        processedLayout,
        { score: 100, approved: true, seoIssues: [], contentIssues: [], suggestions: [] }
    );

    if (!job.target_language) {
        throw new Error('target_language is required');
    }

    // Create or update translated page 
    let resultPage;
    const finalData = {
        title: sourceDoc.title,
        slug: translatedSlug,
        layout: processedLayout,
        meta: seo.meta,
        language: job.target_language,
        publishedAt: new Date().toISOString(),
    };

    if (pageIdToUpdate) {
        resultPage = await payload.update({
            collection: 'pages',
            id: pageIdToUpdate,
            data: finalData
        });
    } else {
        resultPage = await payload.create({
            collection: 'pages',
            data: {
                ...finalData,
                meta: {
                    ...seo.meta,
                    image: sourceDoc.meta?.image ?? undefined,
                },
                translation_group_id: sourceDoc.translation_group_id,
                _status: 'published',
            },
            context: { aiJob: true, translating: true }
        });
    }
    // Update translation in tracking table
    const tracking = await payload.find({
        collection: 'translations',
        where: { translation_group_id: { equals: sourceDoc.translation_group_id } },
        limit: 1,
    });

    if (tracking.docs.length > 0) {
        const targetLang = job?.target_language;
        const translations = tracking.docs[0].translations?.map((t: any) => {
            // Strip ID from the translation object itself
            const { id, ...rest } = t;
            return {
                ...rest,
                status: (t.language === targetLang) ? 'completed' : t.status,
                content: (t.language === targetLang) ? translatedContent : t.content,
            };
        });


        await payload.update({
            collection: 'translations',
            id: tracking.docs[0].id,
            data: { translations },
        });
    }



    //Mark job completed
    await payload.update({
        collection: 'ai-jobs',
        id: jobId,
        data: {
            status: 'completed',
            step: 'COMPLETED',
            output_payload: translatedContent,
            // prompt,
        }
    });

    console.log(`[AI Orchestrator] Translation completed for ${job.target_language}`);
}