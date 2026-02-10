import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { HeroBlock } from '@/blocks/Hero/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { FeatureGrid } from '../../blocks/FeatureGrid/config'
import { SplitBlock } from '../../blocks/Split/config'
import { TestimonialsBlock } from '../../blocks/Testimonials/config'
import { StatsBlock } from '../../blocks/Stats/config'
import { LogoCloudBlock } from '../../blocks/LogoCloud/config'
import { FAQBlock } from '../../blocks/FAQ/config'
import { TimelineBlock } from '../../blocks/Timeline/config'
import { GalleryBlock } from '../../blocks/Gallery/config'
import { VideoBlock } from '../../blocks/Video/config'
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
import { triggerAutomatedTranslations } from './hooks/triggerAutomatedTranslations'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

/**
 * Helper to call revalidation route
 */
/**
 * Revalidate a page path for all languages
 */
async function revalidatePagePath(path: string, tag?: string) {
  const languages = ['en','es','de','fr','pt','it','tr','ru','nl']

  for (const lang of languages) {
    const localizedPath = path === '/' ? `/${lang}` : `/${lang}${path}`
    try {
      const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/revalidate`
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // secret: process.env.REVALIDATE_SECRET,
          path: localizedPath,
          tag,
        }),
      })
    } catch (err) {
      console.error(`[Revalidate] Failed for path: ${localizedPath}`, err)
    }
  }
}


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
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                HeroBlock,
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                FormBlock,
                FeatureGrid,
                SplitBlock,
                TestimonialsBlock,
                StatsBlock,
                LogoCloudBlock,
                FAQBlock,
                TimelineBlock,
                GalleryBlock,
                VideoBlock,
              ],
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
    {
      name: 'deletedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
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
    {
      path: '/:id/regenerate',
      method: 'post',
      handler: async (req) => {
        const { payload } = req
        const id = req.routeParams?.id as string

        try {
          // 1. Fetch the page to get metadata
          const page = await payload.findByID({
            collection: 'pages',
            id,
          })

          // 2. Create REGENERATE_PAGE job
          const job = await payload.create({
            collection: 'ai-jobs',
            data: {
              type: 'REGENERATE_PAGE',
              status: 'pending',
              input_payload: {
                pageId: id,
                slug: (page as any).slug,
                title: (page as any).title,
                blocks: (page as any).layout?.map((b: any) => b.blockType) || [],
              },
            },
          })

          // 3. Trigger orchestrator
          const { runAIJob } = await import('../../utilities/ai/orchestrator')
          runAIJob(job.id)

          return Response.json({
            success: true,
            jobId: job.id,
          })
        } catch (error: any) {
          return Response.json({
            success: false,
            error: error.message,
          }, { status: 500 })
        }
      },
    },
  ],
  hooks: {
    afterChange: [
        async ({ doc, previousDoc }) => {
        // Only revalidate published pages
        console.log(doc, "doccccccccccccccccccccccccccccccc")
        if (doc._status === 'published') {
          const path = doc.slug === 'home' ? '/' : `/${doc.slug}`
          await revalidatePagePath(path, 'pages-sitemap')
        }
        // If previous doc was published and slug changed
        if (previousDoc?._status === 'published' && doc._status !== 'published') {
          const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`
          await revalidatePagePath(oldPath, 'pages-sitemap')
        }
      },
      triggerAutomatedTranslations
    ],
    beforeValidate: [autoGenerateGroupId, validateUniqueGroupLanguage],
    beforeChange: [populatePublishedAt, getBlockDuplicateSlug('pages'), syncGroupSlug],
    afterDelete: [
      async ({ doc }) => {
        const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`
        await revalidatePagePath(path, 'pages-sitemap')
      },
    ],
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
