import type { Field } from 'payload'

export const blockFields: Field[] = [
    {
        name: 'settings',
        type: 'group',
        admin: {
            // initCollapsed: true,
        },
        fields: [
            {
                name: 'blockId',
                type: 'text',
                label: 'Block ID',
                admin: {
                    description: 'Unique ID for anchor links (e.g. "features")',
                },
            },
            {
                name: 'theme',
                type: 'select',
                defaultValue: 'light',
                options: [
                    { label: 'Light', value: 'light' },
                    { label: 'Dark', value: 'dark' },
                    { label: 'Brand', value: 'brand' },
                ],
            },
            {
                name: 'padding',
                type: 'group',
                fields: [
                    {
                        name: 'top',
                        type: 'select',
                        defaultValue: 'medium',
                        options: [
                            { label: 'None', value: 'none' },
                            { label: 'Small', value: 'small' },
                            { label: 'Medium', value: 'medium' },
                            { label: 'Large', value: 'large' },
                        ],
                    },
                    {
                        name: 'bottom',
                        type: 'select',
                        defaultValue: 'medium',
                        options: [
                            { label: 'None', value: 'none' },
                            { label: 'Small', value: 'small' },
                            { label: 'Medium', value: 'medium' },
                            { label: 'Large', value: 'large' },
                        ],
                    },
                ],
            },
            {
                name: 'visibility',
                type: 'select',
                defaultValue: 'both',
                options: [
                    { label: 'Both', value: 'both' },
                    { label: 'Desktop Only', value: 'desktop' },
                    { label: 'Mobile Only', value: 'mobile' },
                ],
            },
        ],
    },
]
