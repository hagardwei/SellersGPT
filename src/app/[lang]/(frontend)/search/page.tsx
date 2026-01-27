import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Search } from '@/search/Component'
import PageClient from './page.client'
import { CardPostData } from '@/components/Card'
import { getDictionary } from '@/i18n/get-dictionary'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}
export default async function Page({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ q: string }>
}) {
  const { lang } = await paramsPromise
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
    // pagination: false reduces overhead if you don't need totalDocs
    pagination: false,
    where: {
      and: [
        {
          language: {
            equals: lang,
          },
        },
        ...(query
          ? [
            {
              or: [
                {
                  title: {
                    like: query,
                  },
                },
                {
                  'meta.description': {
                    like: query,
                  },
                },
                {
                  'meta.title': {
                    like: query,
                  },
                },
                {
                  slug: {
                    like: query,
                  },
                },
              ],
            },
          ]
          : []),
      ],
    },
  })

  const { general } = await getDictionary(lang)

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">{general.search}</h1>

          <div className="max-w-[50rem] mx-auto">
            <Search placeholder={general.searchPlaceholder} />
          </div>
        </div>
      </div>

      {posts.docs.length > 0 ? (
        <CollectionArchive posts={posts.docs as CardPostData[]} />
      ) : (
        <div className="container">{general.noResults}</div>
      )}
    </div>
  )
}

import { getServerSideURL } from '@/utilities/getURL'

export async function generateMetadata({
  params: paramsPromise,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await paramsPromise
  const serverUrl = getServerSideURL()
  const path = `/search`
  const canonicalUrl = `${serverUrl}/${lang}${path}`

  return {
    title: `Payload Website Template Search`,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${serverUrl}/en${path}`,
        es: `${serverUrl}/es${path}`,
        de: `${serverUrl}/de${path}`,
        fr: `${serverUrl}/fr${path}`,
        pt: `${serverUrl}/pt${path}`,
        it: `${serverUrl}/it${path}`,
        tr: `${serverUrl}/tr${path}`,
        ru: `${serverUrl}/ru${path}`,
        nl: `${serverUrl}/nl${path}`,
        'x-default': `${serverUrl}/en${path}`,
      },
    },
  }
}
