import { BasePayload } from "payload";
import { fetchFromApiTube } from "./apiTube";
import { getTitleSimilarity } from "./deduplicate";

export async function runNewsFetchJob(payload: BasePayload){
    console.log('[News Fetcher] Starting daily news fetch...');

    try {
        // 1. Get Settings
        const settings = await payload.findGlobal({
            slug: 'industry-news-settings' as any
        })

        if(!settings.apiTubeKey){
            settings.apiTubeKey = process.env.APITUBE_KEY;
        }

        if(!settings.enabled || !settings.apiTubeKey){
            console.log('[News Fetcher] Automation disabled or API key missing.');
            return;
        }

        const queries = settings.searchQueries || [];
        const dailyCap = settings.dailyCap || 100;
        const threshold = settings.similarityThreshold || 0.85;

        let totalFetched = 0;

        // 2. fetch for each query
        for (const { query } of queries) {
            if(totalFetched >= dailyCap) break;
            console.log(`[News Fetcher] Fetching for query: ${query}`);
            const articles = await fetchFromApiTube(settings.apiTubeKey, query, 20);

            for (const article of articles) {
                if(totalFetched >= dailyCap) break;

                // 3. De-duplicate URL check
                // Fetch recent news to compare titles
                const recentNews = await payload.find({
                    collection: 'news_raw' as any,
                    sort: '-published_at',
                    limit: 50,
                });

                const isDuplicate = recentNews.docs.some(doc => 
                    getTitleSimilarity(doc.title, article.title) >= threshold
                );

                if(isDuplicate){
                    console.log(`[News Fetcher] Skipping duplicate title: ${article.title}`);
                    return
                }

                console.log(`[News Fetcher] Saving article: `, article);


                // Save the news raw
                 try {
                    await payload.create({
                        collection: 'news_raw' as any,
                        data: {
                            source: 'apitube',
                            external_id: String(article.id),
                            title: article.title,
                            description: article.description,
                            content: article.content,
                            url: article?.url,
                            published_at: article.publishedAt,
                            fetched_at: new Date().toISOString(),
                            processed: false,
                        }
                    });
                    totalFetched++;
                } catch (err) {
                    console.error(`[News Fetcher] Error saving article: ${article.title}`, err);
                }
            }
        }
         console.log(`[News Fetcher] Completed. Total new articles saved: ${totalFetched}`);
    } catch (err) {
         console.error('[News Fetcher] Job failed:', err);
    }
} 