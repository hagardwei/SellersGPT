import { authenticated } from "@/access/authenticated";
import { GlobalConfig } from "payload";

export const IndustryNewsSettings: GlobalConfig = {
    slug: 'industry-news-settings',
    access: {
        read: () => true,
        update: authenticated
    },
    admin: {
        group: 'Settings',
    },
    fields: [
        {
            name: 'enabled',
            type: 'checkbox',
            label: 'Enable News Automation',
            defaultValue: false
        },
        {
            name: 'apiTubeKey',
            type: 'text',
            label: 'Your APITube Key',
            admin: {
                description: 'API key for fetching news from APITube',
            }
        },
        {
            name: 'searchQueries',
            type: 'array',
            label: 'Search Queries / Topics',
            minRows: 1,
            fields: [
                {
                    name: 'query',
                    type: 'text',
                    required: true
                },
            ],
            defaultValue: [
                { query: 'artificial intelligence' },
                { query: 'saas' },
                { query: 'ecommerce' }  
            ]
        },
        {
            name: 'dailyCap',
            type: 'number',
            label: 'Daily News Cap',
            defaultValue: 100,
            admin: {
                description: 'Maximum number of news articles to fetch and process each day',
            },
        },
        {
            name: 'targetCategory',
            type: 'relationship',
            relationTo: 'categories',
            label: 'Target Catgeory',
            admin: {
                description: 'Category to assign to news posts',
            }
        },
        {
            name: 'similarityThreshold',
            type: 'number',
            label: 'Title Similarity Threshold',
            defaultValue: 0.85,
            admin: {
                description: 'Threshold for de-duplication (0.0 to 1.0)',
            },
        },
    ],
}

