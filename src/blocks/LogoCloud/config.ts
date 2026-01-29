import type { Block } from 'payload'
import { blockFields } from '../../fields/blockFields'

export const LogoCloudBlock: Block = {
    slug: 'logoCloud',
    interfaceName: 'LogoCloudBlock',
    fields: [
        {
            name: 'heading',
            type: 'text',
        },
        {
            name: 'logos',
            type: 'array',
            fields: [
                {
                    name: 'logo',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                },
                {
                    name: 'name',
                    type: 'text',
                },
            ],
        },
        ...blockFields,
    ],
}
