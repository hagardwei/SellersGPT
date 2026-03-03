import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { getLanguageVariants } from '@/utilities/getLanguageVariants'
import { TranslationSetter } from '@/components/TranslationSetter'
import { getHreflangs } from '@/utilities/getHreflangs'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
      language: true,
    },
  })

  const params = pages.docs.map(({ slug, language }) => ({
    slug,
    lang: language,
  }))


    return params
  }

type Args = {
  params: Promise<{
    slug?: string
    lang: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home', lang } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = `/${lang}/${decodedSlug}`
  const page: RequiredDataFromCollectionSlug<'pages'> = await queryPageBySlug({
    slug: decodedSlug,
    lang,
  })

  // Remove this code once your website is seeded
  // if (!page && slug === 'home') {
  //   page = homeStatic
  // }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { layout, translation_group_id } = page
  const variants = await getLanguageVariants('pages', translation_group_id)

  return (
    <article className="pb-16">
      <TranslationSetter languages={variants} />
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {/* <RenderHero {...hero} /> */}
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home', lang } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({
    slug: decodedSlug,
    lang,
  })

  const alternates = await getHreflangs('pages', (page as any)?.translation_group_id)

  return {
    ...generateMeta({ doc: page, collectionSlug: 'pages' }),
    alternates: {
      language: alternates
    }
  }
}

const queryPageBySlug = cache(async ({ slug, lang }: { slug: string; lang: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          language: {
            equals: lang,
          },
        },
      ],
    },
  })

  console.log(result)

  return result.docs?.[0] || null
})
