// import type { CollectionConfig } from 'payload'
// import { getPayload } from 'payload';
// import configPromise from '@payload-config';
// import type { APITubeArticle } from '@/services/apitube/fetchNews';


// // cms/collections/NewsSources.ts
//  export const NewsSources: CollectionConfig = {
//   slug: 'news-sources',
//   labels: { singular: 'News Source', plural: 'News Sources' },
//   fields: [
//     { name: 'sourceId', type: 'text', unique: true },
//     { name: 'sourceUrl', type: 'text', unique: true },
//     { name: 'title', type: 'text' },
//     { name: 'content', type: 'textarea' },
//     { name: 'publishedAt', type: 'date' },
//   ],
// };



// export async function filterNewArticles(
//   articles: APITubeArticle[]
// ) {
//   const payload = await getPayload({ config: configPromise });

//   const newArticles: APITubeArticle[] = [];

//   for (const article of articles) {
//     const existing = await payload.find({
//         collection: NewsSources.slug as any,
//   where: { sourceUrl: { equals: article.url } },
//     });

//     if (existing.docs.length === 0) {
//       newArticles.push(article);
//     }
//   }

//   return newArticles;
// }


import type { CollectionConfig } from 'payload'
import axios from "axios";
import crypto from "crypto";
import payload from "payload";
import path from "path";
import config from "../payload.config";

export const NewsRaw: CollectionConfig = {
  slug: "news_raw",
  admin: {
    useAsTitle: "title",
  },
  fields: [
    { name: "source", type: "text" },
    { name: "externalId", type: "text", unique: true },
    { name: "title", type: "text" },
    { name: "description", type: "textarea" },
    { name: "content", type: "textarea" },
    { name: "url", type: "text" },
    { name: "publishedAt", type: "date" },
  ],
};


const APITUBE_URL = process.env.APITUBE_URL!;
const APITUBE_KEY = process.env.APITUBE_KEY!;
async function fetchNews() {
    await payload.init({
        // secret: process.env.PAYLOAD_SECRET!,s
        // local: true,
        config,
    });
    
    try {
        console.log(APITUBE_URL,APITUBE_KEY,"==apituve--")
    const response = await axios.get(`${APITUBE_URL}/news/everthing?per_page=10`, {
      params: {
        limit: 100,
        industry: "auto",
      },
      headers: {
        // Authorization: `Bearer ${APITUBE_KEY}`,
        'X-API-Key': APITUBE_KEY,
      },
    });

    const articles = response.data?.articles || [];

    for (const item of articles) {
      const externalId = crypto
        .createHash("sha256")
        .update(item.url)
        .digest("hex");

      // Check duplicate
      const existing = await payload.find({
        collection: "news_raw",
        where: {
          externalId: { equals: externalId },
        },
      });

      if (existing.docs.length > 0) continue;

      await payload.create({
        collection: "news-raw",
        data: {
          source: "apitube",
          externalId,
          title: item.title,
          description: item.description,
          content: item.content,
          url: item.url,
          publishedAt: item.publishedAt,
        },
      });
    }

    console.log(`✅ Fetched ${articles.length} articles`);
    process.exit(0);
  } catch (err: any) {
    console.error("❌ APITube Fetch Error:", err.message);
    process.exit(1);
  }
}

setTimeout(() => {
    fetchNews();
}, 1000)
