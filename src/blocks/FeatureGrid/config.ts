import type { Block } from 'payload'
import { blockFields } from '../../fields/blockFields'

export const FeatureGrid: Block = {
    slug: 'featureGrid',
    interfaceName: 'FeatureGridBlock',
    fields: [
        {
            name: 'heading',
            type: 'text',
        },
        {
            name: 'subheading',
            type: 'text',
        },
        {
            name: 'items',
            type: 'array',
            fields: [
                {
                    name: 'icon',
                    type: 'upload',
                    relationTo: 'media',
                },
                {
                    name: 'title',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'description',
                    type: 'textarea',
                    required: true,
                },
            ],
        },
        {
            name: 'columns',
            type: 'select',
            defaultValue: '3',
            options: [
                { label: '2', value: '2' },
                { label: '3', value: '3' },
                { label: '4', value: '4' },
            ],
        },
        ...blockFields,
    ],
}
