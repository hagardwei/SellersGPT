import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '../../../payload-types'

const REVALIDATE_ENDPOINT = `${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`
// const SECRET = process.env.PAYLOAD_SECRET

console.log("+++++++++++++++++++++++++++++++++++")
console.log("+++++++++++++++++++++++++++++++++++")
console.log("+++++++++++++++++++++++++++++++++++")
console.log("+++++++++++++++++++++++++++++++++++")
console.log("+++++++++++++++++++++++++++++++++++")
console.log("+++++++++++++++++++++++++++++++++++")
console.log("+++++++++++++++++++++++++++++++++++")
async function requestRevalidate(path: string, language: Page['language']) {
  try {
    await fetch(REVALIDATE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // secret: SECRET,
        path,
        tags: [
          'pages',
          `pages-${language}`,
          'pages-sitemap',
          `pages-sitemap-${language}`,
        ],
      }),
    })
  } catch (err) {
    console.error('[Revalidate] Failed to request revalidation:', err)
  }
}

export const revalidatePage: CollectionAfterChangeHook<Page> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`
      await requestRevalidate(path, doc.language)
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`
      await requestRevalidate(oldPath, previousDoc.language)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = async ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`
    await requestRevalidate(path, doc.language)
  }

  return doc
}
