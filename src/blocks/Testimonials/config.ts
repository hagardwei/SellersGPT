import type { Block } from 'payload'
import { blockFields } from '../../fields/blockFields'

export const TestimonialsBlock: Block = {
    slug: 'testimonials',
    interfaceName: 'TestimonialsBlock',
    fields: [
        {
            name: 'heading',
            type: 'text',
        },
        {
            name: 'testimonials',
            type: 'array',
            fields: [
                {
                    name: 'quote',
                    type: 'textarea',
                    required: true,
                },
                {
                    name: 'author',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'role',
                    type: 'text',
                },
                {
                    name: 'company',
                    type: 'text',
                },
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                },
            ],
        },
        ...blockFields,
    ],
}
