import type { Block } from 'payload'
import { blockFields } from '../../fields/blockFields'

export const GalleryBlock: Block = {
    slug: 'gallery',
    interfaceName: 'GalleryBlock',
    fields: [
        {
            name: 'heading',
            type: 'text',
        },
        {
            name: 'images',
            type: 'array',
            minRows: 1,
            fields: [
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                },
                {
                    name: 'caption',
                    type: 'text',
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
