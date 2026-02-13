import { Queue } from 'bullmq';
import { fetchIndustryNews } from '@/services/apitube/fetchNews';
import { connection } from '@/lib/redis';
import { filterNewArticles } from '@/collections/news-sources'; 

const aiQueue = new Queue('ai-jobs', { connection });

export async function runDailyNewsFetch() {
  console.log('[News] Fetching articles...');

  const articles = await fetchIndustryNews();
  const newArticles = await filterNewArticles(articles);

  console.log(`[News] ${newArticles.length} new articles found.`);

  for (const article of newArticles) {
    await aiQueue.add('rewrite-news', {
      type: 'news-rewrite',
      sourceId: article.id,
      title: article.title,
      content: article.content,
      sourceUrl: article.url,
    });
  }
}