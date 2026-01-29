import type { Block } from 'payload'
import { blockFields } from '../../fields/blockFields'

export const StatsBlock: Block = {
    slug: 'stats',
    interfaceName: 'StatsBlock',
    fields: [
        {
            name: 'heading',
            type: 'text',
        },
        {
            name: 'stats',
            type: 'array',
            fields: [
                {
                    name: 'value',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'label',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'description',
                    type: 'text',
                },
            ],
        },
        ...blockFields,
    ],
}
