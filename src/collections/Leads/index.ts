import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { sendLeadNotifications } from './hooks/sendLeadNotifications'
import { generateSummaryBeforeSave } from './hooks/generateSummaryBeforeSave'

export const Leads: CollectionConfig = {
    slug: 'leads',
    admin: {
        useAsTitle: 'email',
        defaultColumns: ['name', 'email', 'status', 'createdAt'],
        group: 'Sales',
    },
    access: {
        read: authenticated,
        create: authenticated,
        update: authenticated,
        delete: authenticated
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true
        },
        {
            name: 'email',
            type: 'email',
            required: true
        },
        {
            name: 'phone',
            type: 'text',
        },
        {
            name: 'company',
            type: 'text'
        },
        {
            name: 'need',
            type: 'text'
        },
        {
            name: 'message',
            type: 'textarea',
        },
        {
            name: 'sourceUrl',
            type: 'text',
            admin: {
                description: 'The URL where the lead was captured',
            },
        },
        {
            name: 'status',
            type: 'select',
            defaultValue: 'new',
            options: [
                { label: 'New', value: 'new' },
                { label: 'Contacted', value: 'contacted' },
                { label: 'Converted', value: 'converted' },
                { label: 'Lost', value: 'lost' }
            ]
        },
        {
            name: 'transcript',
            type: 'json',
            admin: {
                description: 'Chat transcript associated with this lead',
            },
        },
    ],
    hooks: {
         beforeChange: [generateSummaryBeforeSave],
        afterChange: [sendLeadNotifications]
    },
    timestamps: true
}