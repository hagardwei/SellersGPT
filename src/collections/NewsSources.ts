// cms/collections/NewsSources.ts
import { CollectionConfig } from 'payload/types';

export const NewsSources: CollectionConfig = {
  slug: 'news-sources',
  labels: {
    singular: 'News Source',
    plural: 'News Sources',
  },
  fields: [
    {
      name: 'sourceId',
      type: 'text',
      unique: true,
    },
    {
      name: 'sourceUrl',
      type: 'text',
      unique: true,
    },
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'content',
      type: 'textarea',
    },
    {
      name: 'publishedAt',
      type: 'date',
    },
  ],
};
