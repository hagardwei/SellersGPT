import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
  collectionSlug?: 'pages' | 'posts'
}): Promise<Metadata> => {
  const { doc, collectionSlug } = args


  console.log("Recieved Doc: ", doc)

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title
    ? doc?.meta?.title + ' | Payload Website Template'
    : 'Payload Website Template'

  const serverUrl = getServerSideURL()
  const lang = doc?.language || 'en'
  const slug = doc?.slug || (collectionSlug === 'pages' ? 'home' : '')

  // Construct current URL path
  const isHome = collectionSlug === 'pages' && slug === 'home'
  const path = collectionSlug === 'posts' ? `/posts/${slug}` : `/${isHome ? '' : slug}`
  const canonicalUrl = `${serverUrl}/${lang}${path}`.replace(/\/$/, '') || `${serverUrl}/${lang}`

  const alternates: Metadata['alternates'] = {
    canonical: canonicalUrl,
    languages: {},
  }

  // Find other language versions if we have a translation_group_id
  if (doc?.translation_group_id && collectionSlug) {
    console.log("Finding Siblings")
    console.log("Translation Group ID: ", doc.translation_group_id)
    console.log("Collection Slug: ", collectionSlug)
    console.log("Doc ID: ", doc.id)
    const payload = await getPayload({ config: configPromise })
    const siblings = await payload.find({
      collection: collectionSlug,
      where: {
        and: [
          {
            translation_group_id: { equals: doc.translation_group_id },
          },
          {
            id: { not_equals: doc.id },
          },
        ],
      },
      depth: 0,
      limit: 20,
      pagination: false,
      select: {
        slug: true,
        language: true,
      },
    })

    console.log("Siblings: ", siblings)

    const languageMap: Record<string, string> = {}

    // Add current doc to map
    languageMap[lang] = canonicalUrl

    siblings.docs.forEach((s) => {
      const sSlug = s.slug || (collectionSlug === 'pages' ? 'home' : '')
      const sIsHome = collectionSlug === 'pages' && sSlug === 'home'
      const sPath =
        collectionSlug === 'posts' ? `/posts/${sSlug}` : `/${sIsHome ? '' : sSlug}`
      const sUrl = `${serverUrl}/${s.language}${sPath}`.replace(/\/$/, '') || `${serverUrl}/${s.language}`
      languageMap[s.language] = sUrl
    })

    alternates.languages = languageMap

    console.log("Language Map: ", languageMap)

    // Set x-default to English version if available
    if (languageMap['en']) {
      alternates.languages['x-default'] = languageMap['en']
    }
  }

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
          {
            url: ogImage,
          },
        ]
        : undefined,
      title,
      url: path,
    }),
    title,
    alternates,
  }
}
