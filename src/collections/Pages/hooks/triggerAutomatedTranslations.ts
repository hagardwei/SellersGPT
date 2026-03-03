import { CollectionAfterChangeHook } from "payload";
import { runAIJob } from "@/utilities/ai/orchestrator";
import { aiJobQueue } from "@/lib/redis";
import crypto from 'crypto';

export const triggerAutomatedTranslations: CollectionAfterChangeHook = async ({
    doc,
    req: { payload, context },
}) => {
    console.log(`[Auto-Translation] Trigger called for doc ID: ${doc.id}, language: ${doc.language}, status: ${doc._status}`);

    // Only trigger if published and it's English
    if (doc._status !== 'published' || doc.language !== 'en') {
        console.log(`[Auto-Translation] Skipping doc ${doc.id} because it is not published or not English`);
        return;
    }
    console.log("&&&&&&&&&", context)
    // Prevent infinite loops and context checks
    if (context.translating) {
        console.log(`[Auto-Translation] Skipping doc ${doc.id} due to context flags (aiJob/translating)`);
        return;
    }

    const targetLanguages: ('es')[] = ['es'];
    console.log(`[Auto-Translation] Target languages for doc ${doc.id}: ${targetLanguages.join(', ')}`);

    const sourceHash = crypto
        .createHash('sha256')
        .update(JSON.stringify(doc.layout))
        .digest('hex');

    console.log(`[Auto-Translation] Computed source hash for doc ${doc.id}: ${sourceHash}`);

    // Create or update tracking
    let tracking = await payload.find({
        collection: 'translations',
        where: { translation_group_id: { equals: doc.translation_group_id } },
        limit: 1,
    });

    if (tracking.docs.length === 0) {
        console.log(`[Auto-Translation] No tracking found. Creating new translation tracking for doc ${doc.id}`);
        await payload.create({
            collection: 'translations',
            data: {
                translation_group_id: doc.translation_group_id as string,
                source_language: 'en',
                source_hash: sourceHash,
                translations: targetLanguages.map(lang => ({
                    language: lang,
                    status: 'pending'
                }))
            }
        });
    } else {
        console.log(`[Auto-Translation] Found existing tracking for doc ${doc.id}: ${tracking.docs[0].id}`);

        // If content unchanged, skip spawning jobs
        if (tracking.docs[0].source_hash === sourceHash) {
            console.log(`[Auto-Translation] Content unchanged for doc ${doc.id}, skipping translation jobs`);
            return;
        }

        console.log(`[Auto-Translation] Content changed for doc ${doc.id}, updating source hash`);
        await payload.update({
            collection: 'translations',
            id: tracking.docs[0].id,
            data: { source_hash: sourceHash },
        });
    }

    // Spawn translation jobs
    for (const lang of targetLanguages) {
        console.log(`[Auto-Translation] Creating TRANSLATE_DOCUMENT job for doc ${doc.id}, target language: ${lang}`);

        const job = await payload.create({
            collection: 'ai-jobs',
            data: {
                type: "TRANSLATE_DOCUMENT",
                status: 'pending',
                target_language: lang,
                input_payload: {
                    sourceDocId: doc.id,
                    collection: 'pages',
                    sourceHash
                }
            }
        });

        console.log(`[Auto-Translation] Job created with ID ${job.id} for doc ${doc.id}, language: ${lang}`);

        // Trigger job in background
        await aiJobQueue.add(
            `ai-job-${job.id}`,
            { aiJobId: job.id },
            {
                attempts: 3,
                backoff: { type: 'exponential', delay: 5000 },
                removeOnComplete: true
            }
        );

        console.log(`[Auto-Translation] Job ${job.id} queued in aiJobQueue for doc ${doc.id}, language: ${lang}`);
    }
};
