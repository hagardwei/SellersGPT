import { getPayload, type CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated';
// import payload from "payload";
// import config from "../payload.config";

export const NewsRaw: CollectionConfig = {
  slug: "news_raw",
    access: {
      create: authenticated,
      delete: authenticated,
      read: authenticated,
      update: authenticated,
    },
    defaultPopulate: {
      title: true,
      slug: true,
    },
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "source",
      type: "text",
      required: true,
    },
    {
      name: "external_id",  
      type: "text",
      unique: true,
      required: true,
    },
    {
      name: "title",
      type: "text",
      required: true
    },
    {
      name: "description",
      type: "textarea"
    },
    {
      name: "content",
      type: "textarea"
    },
    {
      name: "url",
      type: "text",
      required: true
    },
    {
      name: "published_at",  // Changed from publishedAt
      type: "date",
      required: true
    },
    {
      name: "fetched_at",  // Changed from fetchedAt
      type: "date",
      required: true,
      admin: {
        description: "When this article was fetched from APITube"
      }
    },
    {
      name: "processed",
      type: "checkbox",
      defaultValue: false,
    }
  ]
}
