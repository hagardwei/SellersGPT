import type { CollectionConfig } from 'payload'
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import type { APITubeArticle } from '@/services/apitube/fetchNews';



 export const NewsSources: CollectionConfig = {
  slug: 'news-sources',
  labels: { singular: 'News Source', plural: 'News Sources' },
  fields: [
    { name: 'sourceId', type: 'text', unique: true },
    { name: 'sourceUrl', type: 'text', unique: true },
    { name: 'title', type: 'text' },
    { name: 'content', type: 'textarea' },
    { name: 'publishedAt', type: 'date' },
  ],
};

export async function filterNewArticles(
  articles: APITubeArticle[]
) { 
  const payload = await getPayload({ config: configPromise });

  const newArticles: APITubeArticle[] = [];

  for (const article of articles) {
    const existing = await payload.find({
        collection: NewsSources.slug as any,
  where: { sourceUrl: { equals: article.url } },
    });

    if (existing.docs.length === 0) {
      newArticles.push(article);
    }
  }

  return newArticles;
}

