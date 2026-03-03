import { adminAuthenticated } from "@/access/adminAuthenticated";
import { authenticated } from "@/access/authenticated";
import { CollectionConfig } from "payload";

export const SocialPosts: CollectionConfig = {
    slug: 'social-posts',
    admin: {
        useAsTitle: 'content',
        defaultColumns: ['content', 'platform', 'status', 'scheduledAt', 'publishedAt'],
        group: 'Automation'
    },
    access: {
        read: authenticated,
        create: adminAuthenticated,
        update: adminAuthenticated,
        delete: adminAuthenticated
    },
    fields: [
        {
            name: 'content',
            type: 'textarea',
            required: true,
            admin: {
                description: 'The text xcontent of the social media post.'
            },
        },
        {
            name: 'media',
            type: 'relationship',
            relationTo: 'media',
            hasMany: true,
            admin: {
                description: 'Images or Videos to be included in the post.',
            },
        },
        {
            name: 'platform',
            type: 'select',
            required: true,
            options: [
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'Facebook', value: 'facebook' },
                { label: 'Twitter/X', value: 'twitter' },
            ],
        },
        {
            name: 'status',
            type: 'select',
            defaultValue: 'draft',
            required: true,
            options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Scheduled', value: 'scheduled' },
                { label: 'Published', value: 'published' },
                { label: 'Failed', value: 'failed' },
            ],                                        
        },
        {
            name: 'scheduledAt',
            type: 'date',
            admin: {
                date: {
                    pickerAppearance: 'dayAndTime',
                },
                description: 'When the post is scheduled to be published.',
            },
        },
        {
            name: 'publishedAt',
            type: 'date',
            admin: {
                readOnly: true,
            }
        },
        {
            name: 'source',
            type: 'relationship',
            relationTo: ['pages','news_raw'],
            admin: {
                description: 'The source content (Article or News) this post was generated from.'
            },
        },
        {
            name: 'externalId',
            type: 'text',
            admin: {
                readOnly: true,
                description: 'The post Id on the external platform'
            }
        },
        {
            name: 'error',
            type: 'json',
            admin: {
                readOnly: true,
            },
        },
    ],
    timestamps: true
}