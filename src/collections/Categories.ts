import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { getValidateSlug } from '../utilities/validateSlug'
import { getBlockDuplicateSlug } from '../utilities/blockDuplicateSlug'
import { autoGenerateGroupId } from '../utilities/autoGenerateGroupId'
import { cloneTranslationHandler } from '../utilities/cloneTranslation'
import { syncGroupSlug } from '../utilities/syncGroupSlug'
import { validateUniqueGroupLanguage } from '../utilities/validateUniqueGroupLanguage'
import { deleteGroupHandler } from '../utilities/deleteGroup'

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
    baseListFilter: () => ({
      language: {
        equals: 'en',
      },
    }),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },

    {
      name: 'translation_hub',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/TranslationHub#TranslationHub',
        },
      },
    },
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
        { label: 'Español', value: 'es' },
        { label: 'Deutsch', value: 'de' },
        { label: 'Français', value: 'fr' },
        { label: 'Português', value: 'pt' },
        { label: 'Italiano', value: 'it' },
        { label: 'Türkçe', value: 'tr' },
        { label: 'Русский', value: 'ru' },
        { label: 'Nederlands', value: 'nl' },
      ],
      defaultValue: 'en',
      required: true,
      admin: {
        position: 'sidebar',
      },
      access: {
        update: () => false,
      },
    },
    {
      name: 'translation_group_id',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
        hidden: true,
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
  endpoints: [
    {
      path: '/:id/clone-to',
      method: 'post',
      handler: cloneTranslationHandler,
    },
    {
      path: '/:id/delete-group',
      method: 'post',
      handler: deleteGroupHandler,
    },
  ],
  hooks: {
    beforeValidate: [autoGenerateGroupId, validateUniqueGroupLanguage],
    beforeChange: [getBlockDuplicateSlug('categories'), syncGroupSlug],
  },
}
