import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: CollectionConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'language',
  },
  fields: [
    {
      name: 'language',
      type: 'select',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Spanish', value: 'es' },
        { label: 'German', value: 'de' },
        { label: 'French', value: 'fr' },
        { label: 'Portuguese', value: 'pt' },
        { label: 'Italian', value: 'it' },
        { label: 'Turkish', value: 'tr' },
        { label: 'Russian', value: 'ru' },
        { label: 'Dutch', value: 'nl' },
      ],
      defaultValue: 'en',
      required: true,
      unique: true,
    },
    {
      name: 'translation_group_id',
      type: 'text',
      required: true,
      defaultValue: 'footer-group',
      admin: {
        description: 'Shared ID for all language variants of this document.',
      },
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
