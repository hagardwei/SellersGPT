import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { getValidateSlug } from '../utilities/validateSlug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
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
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'translation_group_id',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Shared ID for all language variants of this document.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      label: 'Slug',
      validate: getValidateSlug('categories'),
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
