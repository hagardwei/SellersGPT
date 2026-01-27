import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getServerSideURL } from '@/utilities/getURL'
import { Page, Post } from '@/payload-types'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const payload = await getPayload({ config: configPromise })
    const serverUrl = getServerSideURL()

    const pages = await payload.find({
        collection: 'pages',
        draft: false,
        limit: 1000,
        pagination: false,
    })

    const posts = await payload.find({
        collection: 'posts',
        draft: false,
        limit: 1000,
        pagination: false,
    })

    // Helper to group by translation_group_id
    const groupByGroupId = (docs: any[]) => {
        return docs.reduce((acc, doc) => {
            if (!acc[doc.translation_group_id]) acc[doc.translation_group_id] = []
            acc[doc.translation_group_id].push(doc)
            return acc
        }, {} as Record<string, any[]>)
    }

    const groupedPages: Record<string, Page[]> = groupByGroupId(pages.docs)
    const groupedPosts: Record<string, Post[]> = groupByGroupId(posts.docs)

    const sitemapEntries: MetadataRoute.Sitemap = []

    // Add Pages
    Object.values(groupedPages).forEach((group) => {
        group.forEach((page) => {
            const slug = page.slug === 'home' ? '' : page.slug
            const url = `${serverUrl}/${page.language}/${slug}`.replace(/\/$/, '') || `${serverUrl}/${page.language}`

            const languages: Record<string, string> = {}
            group.forEach((sibling) => {
                const sSlug = sibling.slug === 'home' ? '' : sibling.slug
                languages[sibling.language] =
                    `${serverUrl}/${sibling.language}/${sSlug}`.replace(/\/$/, '') ||
                    `${serverUrl}/${sibling.language}`
            })

            sitemapEntries.push({
                url,
                lastModified: new Date(page.updatedAt),
                changeFrequency: 'weekly',
                priority: page.slug === 'home' ? 1 : 0.8,
                alternates: {
                    languages,
                },
            })
        })
    })

    // Add Posts
    Object.values(groupedPosts).forEach((group) => {
        group.forEach((post) => {
            const url = `${serverUrl}/${post.language}/posts/${post.slug}`.replace(/\/$/, '')

            const languages: Record<string, string> = {}
            group.forEach((sibling) => {
                languages[sibling.language] = `${serverUrl}/${sibling.language}/posts/${sibling.slug}`.replace(
                    /\/$/,
                    '',
                )
            })

            sitemapEntries.push({
                url,
                lastModified: new Date(post.updatedAt),
                changeFrequency: 'monthly',
                priority: 0.6,
                alternates: {
                    languages: {
                        ...languages,
                        'x-default': languages['en'],
                    },
                },
            })
        })
    })

    // Add Static Routes
    const staticPaths = ['/posts', '/search']
    const langs = ['en', 'es', 'de', 'fr', 'pt', 'it', 'tr', 'ru', 'nl']

    staticPaths.forEach((path) => {
        langs.forEach((lang) => {
            const url = `${serverUrl}/${lang}${path}`
            const languages: Record<string, string> = {}
            langs.forEach((l) => {
                languages[l] = `${serverUrl}/${l}${path}`
            })

            sitemapEntries.push({
                url,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.5,
                alternates: {
                    languages,
                },
            })
        })
    })

    return sitemapEntries
}
