import { WebsiteInfo } from "@/globals/WebsiteInfo/config";
import { BasePayload } from "payload";
import { getAIService } from "../ai/service";
import { toLexical } from "../ai/lexicalConverter";

import crypto from 'crypto';
import { newsRewritePrompt } from "../ai/prompts/newsRewritePrompt";
import { triggerSocialPublish } from "../social/publisher";
import { aiJobQueue } from "@/lib/redis";

export async function processRawNews(payload: BasePayload) {
     console.log('[News Processor] Starting news processing...');

    try {
        // 1. Get Settings and WebsiteInfo

        const settings = await payload.findGlobal({
            slug: 'industry-news-settings' as any
        });

        const websiteInfo = await payload.findGlobal({
            slug: 'website-info' as any
        })

        if(!settings.enabled){
            console.log('[News Processor] Automation disabled.');
            return;
        }

        //2. Find un-processed news
        const rawNews = await payload.find({
            collection: 'news_raw' as any,
            where: {
                processed: { equals: false }
            },
            limit: 10,
            sort: '-published_at'
        });

        if(rawNews.totalDocs == 0){
            console.log('[News Processor] No pending news to process.');
            return;
        }

        const aiService = getAIService();
        const promptSystem = newsRewritePrompt(websiteInfo)

        for(const doc of rawNews.docs){
            console.log(`[News Processor] Processing: ${doc.title}`);
            try {
                // 3. AI Rewrite
                const userPrompt = `
                RAW NEWS DATA:
                Source: ${doc.source}
                Title: ${doc.title}
                Description: ${doc.description}
                Content: ${doc.content}
                Original URL: ${doc.url}
                `;

                const fullPrompt = `${promptSystem}\n\n${userPrompt}`;
                const response = await aiService.generate(fullPrompt, { type: 'json_object' });
                
                if(!response.success || !response.data){
                    throw new Error(`AI generation failed: ${response.error}`);
                }

                    const aiData = response.data as any

                    // 4. Create Post in English
                    const post = await payload.create({
                        collection: 'posts',
                        data: {
                            title: aiData.title,
                            slug: aiData.slug,
                            content: toLexical(aiData.content),
                            meta: {
                                title: aiData.metaTitle,
                                description: aiData.metaDescription
                            },
                            categories: settings.targetCategory ? [settings.targetCategory] : [],
                            language: 'en',
                            translation_group_id: crypto.randomUUID(),
                            _status: 'published'
                        },
                        context: { aiJob: true }
                    });
                console.log(`[News Processor] Post created: ${post.title} (ID: ${post.id})`);
                
                // 5. Build Meta Context for further triggers
                await triggerSocialPublish(post.id, 'posts', payload)
                await payload.update({
                    collection: 'news_raw' as any,
                    id: doc.id,
                    data: {
                        processed: true,
                    }
                })
                console.log(`[News Processor] Post created: ${post.title} (ID: ${post.id})`);

                // 6. Trigger Translations (8 languages as per requirement)
                const languages = ['es'];
                
                for (const lang of languages) {
                    const transJob = await payload.create({
                        collection: 'ai-jobs' as any,
                        data: {
                            type: 'TRANSLATE_DOCUMENT',
                            status: 'pending',
                            target_language: lang,
                            input_payload: {
                                sourceDocId: post.id,
                                collection: 'posts'
                            }
                        }
                    });
                    
                    // Enqueue the translation job
                    await aiJobQueue.add('ai-job', { aiJobId: transJob.id });
                }
            } catch (err) {
                console.error(`[News Processor] Failed to process doc ${doc.id}:`, err);
            }
        }
    } catch (error) {
        console.error('[News Processor] Error:', error);
    }
}