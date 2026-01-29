import type { Block } from 'payload'
import { blockFields } from '../../fields/blockFields'
import { linkGroup } from '../../fields/linkGroup'

export const SplitBlock: Block = {
    slug: 'split',
    interfaceName: 'SplitBlock',
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'richText',
            type: 'richText',
        },
        {
            name: 'media',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'mediaPosition',
            type: 'select',
            defaultValue: 'right',
            options: [
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
            ],
        },
        linkGroup({
            appearances: ['default', 'outline'],
            overrides: {
                maxRows: 2,
            },
        }),
        ...blockFields,
    ],
}
