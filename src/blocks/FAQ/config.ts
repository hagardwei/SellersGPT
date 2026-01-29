import type { Block } from 'payload'
import { blockFields } from '../../fields/blockFields'

export const FAQBlock: Block = {
    slug: 'faq',
    interfaceName: 'FAQBlock',
    fields: [
        {
            name: 'heading',
            type: 'text',
        },
        {
            name: 'questions',
            type: 'array',
            fields: [
                {
                    name: 'question',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'answer',
                    type: 'richText',
                    required: true,
                },
            ],
        },
        ...blockFields,
    ],
}
