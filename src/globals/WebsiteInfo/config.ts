import type { GlobalConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const WebsiteInfo: GlobalConfig = {
    slug: 'website-info',
    access: {
        read: () => true,
        update: authenticated,
    },
    fields: [
        {
            name: 'websiteName',
            type: 'text',
            label: 'Website Name / Brand Name',
            required: true,
        },
        {
            name: 'industry',
            type: 'text',
            label: 'Industry / Business Type',
            required: true,
        },
        {
            name: 'description',
            type: 'textarea',
            label: 'Short Business Description (2-4 lines)',
            required: true,
        },
        {
            name: 'goal',
            type: 'select',
            label: 'Primary Goal of Website',
            options: [
                { label: 'Lead generation', value: 'lead-generation' },
                { label: 'Product showcase', value: 'product-showcase' },
                { label: 'Company profile', value: 'company-profile' },
                { label: 'Services', value: 'services' },
            ],
            required: true,
        },
        {
            name: 'referenceWebsite',
            type: 'text',
            label: 'Reference Website (optional)',
        },
        {
            name: 'targetAudience',
            type: 'text',
            label: 'Target Audience',
            required: true,
        },
        {
            name: 'services',
            type: 'text',
            label: 'Key Services / Offerings (comma separated)',
            required: true,
        },
        {
            name: 'brandTone',
            type: 'select',
            label: 'Brand Tone',
            options: [
                { label: 'Professional', value: 'professional' },
                { label: 'Corporate', value: 'corporate' },
                { label: 'Friendly', value: 'friendly' },
                { label: 'Technical', value: 'technical' },
                { label: 'Marketing-heavy', value: 'marketing-heavy' },
            ],
            required: true,
        },
        {
            name: 'isCompleted',
            type: 'checkbox',
            label: 'Is Onboarding Completed?',
            defaultValue: false,
            admin: {
                position: 'sidebar',
            },
        },
    ],
}
