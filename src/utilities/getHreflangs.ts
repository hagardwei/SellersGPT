import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getServerSideURL } from './getURL'

export async function getHreflangs(
    collection: 'pages' | 'posts',
    translationGroupId: string | null | undefined
): Promise<Record<string, string>> {
    const hreflangs: Record<string, string> = {}
    if(!translationGroupId) return hreflangs

    const payload = await getPayload({ config: configPromise })
    const serverUrl = getServerSideURL()

    try {
        const result = await payload.find({
            collection,
            where: {
                and: [
                    {
                        translation_group_id: { equals: translationGroupId },
                    },
                    {
                        _status: { equals: 'published' },
                    },
                ],
            },
            limit: 20,
            depth: 0,
        })

        result.docs.forEach((doc: any) => {
            const slug = doc.slug == 'home' ? '' : doc.slug
            const path = collection === 'pages' ? `/${doc.language}/${slug}` : `/${doc.language}/posts/${slug}`
            const fullUrl = `${serverUrl}${path}`.replace(/\/$/, '') || `${serverUrl}/${doc.language}`
            hreflangs[doc.language] = fullUrl
        })

        //Add x-default (usualy English)
        if(hreflangs['en']) {
            hreflangs['x-default'] = hreflangs['en']
        }
    } catch (error) {
        console.error(`[getHreflangs] Failed to fetch variants for group ${translationGroupId}:`, error)
    }
    return hreflangs
}