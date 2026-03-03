import type { Block } from 'payload'
import { blockFields } from '../../fields/blockFields'

export const TableOfContents: Block = {
  slug: 'tableOfContents',
  interfaceName: 'TableOfContentsBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'ToC Heading',
      defaultValue: 'On this page',
    },
    ...blockFields,
  ],
}
