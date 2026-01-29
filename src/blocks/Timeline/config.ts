import type { Block } from 'payload'
import { blockFields } from '../../fields/blockFields'

export const TimelineBlock: Block = {
    slug: 'timeline',
    interfaceName: 'TimelineBlock',
    fields: [
        {
            name: 'heading',
            type: 'text',
        },
        {
            name: 'steps',
            type: 'array',
            fields: [
                {
                    name: 'date',
                    type: 'text',
                    required: true,
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
        ...blockFields,
    ],
}
