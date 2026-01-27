import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { hero } from '../../heros/config'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'
import { getValidateSlug } from '../../utilities/validateSlug'
import { getBlockDuplicateSlug } from '../../utilities/blockDuplicateSlug'
import { autoGenerateGroupId } from '../../utilities/autoGenerateGroupId'
import { cloneTranslationHandler } from '../../utilities/cloneTranslation'
import { syncGroupSlug } from '../../utilities/syncGroupSlug'
import { validateUniqueGroupLanguage } from '../../utilities/validateUniqueGroupLanguage'
import { deleteGroupHandler } from '../../utilities/deleteGroup'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
    baseListFilter: () => ({
      language: {
        equals: 'en',
      },
    }),
  },
  fields: [
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
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [CallToAction, Content, MediaBlock, Archive, FormBlock],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
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
      access: {
        update: () => false,
      },
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      label: 'Slug',
      validate: getValidateSlug('pages'),
      admin: {
        position: 'sidebar',
        condition: (data) => data?.language === 'en',
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
    afterChange: [revalidatePage],
    beforeValidate: [autoGenerateGroupId, validateUniqueGroupLanguage],
    beforeChange: [populatePublishedAt, getBlockDuplicateSlug('pages'), syncGroupSlug],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
