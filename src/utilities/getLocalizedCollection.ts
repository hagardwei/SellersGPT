import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

async function getLocalizedCollectionItem(slug: 'header' | 'footer', lang: string = 'en', depth = 1) {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
        collection: slug,
        where: {
            language: {
                equals: lang,
            },
        },
        depth,
        limit: 1,
    })

    return result.docs?.[0] || null
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug and lang
 */
export const getCachedLocalizedCollectionItem = (slug: 'header' | 'footer', lang: string = 'en', depth = 1) =>
    unstable_cache(async () => getLocalizedCollectionItem(slug, lang, depth), [slug, lang], {
        tags: [`localized_${slug}_${lang}`],
    })
