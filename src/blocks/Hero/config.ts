import { linkGroup } from '@/fields/linkGroup'
import type { Block } from 'payload'

export const HeroBlock: Block = {
    slug: 'hero',
    interfaceName: 'HeroBlock',
    fields: [
        {
            name: 'variant',
            type: 'select',
            required: true,
            options: [
                {
                    label: 'Simple Hero ( title, subtitle, CTA )',
                    value: 'simple',
                },
                {
                    label: 'Hero with Media ( title, subtitle, CTA, Background Media )',
                    value: 'media',
                },
                {
                    label: 'Split Hero ( title, subtitle, CTA, Media )',
                    value: 'split',
                },
            ],
        },
        {
            name: 'title',
            type: 'text',
            required: true,
            maxLength: 60,
            admin: {
                condition: (_a, _b, { blockData }) => ['simple', 'media', 'split'].includes(blockData?.variant),
            }
        }, {
            name: 'subTitle',
            type: 'text',
            required: true,
            maxLength: 200,
            admin: {
                condition: (_a, _b, { blockData }) => ['simple', 'media', 'split'].includes(blockData?.variant),
            }
        },
        linkGroup({
            appearances: ['default', 'outline'],
            overrides: {
                maxRows: 1,
                admin: {
                    initCollapsed: false,
                    condition: (_a, _b, { blockData }) => ['simple', 'media', 'split'].includes(blockData?.variant),
                }

            },
        }),
        {
            name: 'media',
            label: 'Image/Video',
            type: 'upload',
            relationTo: 'media',
            admin: {
                condition: (_a, _b, { blockData }) => ['media', 'split'].includes(blockData?.variant),
            }
        },
    ],
}
