import type { CollectionConfig } from 'payload'
import { adminAuthenticated } from '../access/adminAuthenticated'
import { authenticated } from '../access/authenticated'

export const Translations: CollectionConfig = {
    slug: 'translations',
    admin: {
        useAsTitle: 'translation_group_id',
        defaultColumns: ['translation_group_id', 'source_language', 'updatedAt'],
        group: 'AI',
    },
    access: {
        read: authenticated,
        create: adminAuthenticated,
        update: adminAuthenticated,
        delete: adminAuthenticated
    },
    fields: [{
        name: 'translation_group_id',
        type: 'text',
        required: true,
        unique: true,
        index: true,
        admin: {
            description: 'The shared ID that connects all language variants of a document.',
        },
    },
    {
        name: 'source_language',
        type: 'select',
        required: true,
        defaultValue: 'en',
        options: [
            { label: 'English', value: 'en' },
            { label: 'Español', value: 'es' },
            { label: 'Deutsch', value: 'de' },
            { label: 'Français', value: 'fr' },
            { label: 'Português', value: 'pt' },
            { label: 'Italiano', value: 'it' },
            { label: 'Türkçe', value: 'tr' },
            { label: 'Русский', value: 'ru' },
            { label: 'Nederlands', value: 'nl' },
        ],
    },
    {
        name: 'translations',
        type: 'array',
        fields: [
            {
                name: 'language',
                type: 'select',
                required: true,
                options: [
                        { label: 'English', value: 'en' },
                        { label: 'Español', value: 'es' },
                        { label: 'Deutsch', value: 'de' },
                        { label: 'Français', value: 'fr' },
                        { label: 'Português', value: 'pt' },
                        { label: 'Italiano', value: 'it' },
                        { label: 'Türkçe', value: 'tr' },
                        { label: 'Русский', value: 'ru' },
                        { label: 'Nederlands', value: 'nl' },
                ]
            },
            {
                name: 'status',
                type: 'select',
                defaultValue: 'pending',
                required: true,
                options: [
                    { label: 'Pending', value: 'pending' },
                    { label: 'Translating', value: 'translating' },
                    { label: 'Completed', value: 'completed' },
                    { label: 'Failed', value: 'failed' },
                ]
            },
            {
                name: 'job_id',
                type: 'relationship',
                relationTo: 'ai-jobs',
                admin: {
                    description: 'The AI job responsible for this translation.',
                }
            },
            {
                name: 'error',
                type: 'text',
            },
            {
                name: 'completed_at',
                type: 'date',
            },
        ],
    },
    {
        name: 'source_hash',
        type: 'text',
    }

],
timestamps: true,
}