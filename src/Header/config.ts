import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: CollectionConfig = {
  slug: 'header',
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
      unique: true, // Only one header per language
    },
    {
      name: 'translation_group_id',
      type: 'text',
      required: true,
      defaultValue: 'header-group',
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
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
