import { Payload } from 'payload'
import { toLexical } from './lexicalConverter'

/**
 * Recursively removes any keys with explicit null values from an object or array.
 * Payload CMS sometimes chokes on null for group fields, preferring undefined/missing keys.
 */
export function recursiveCleanNulls(data: any): any {
    if (Array.isArray(data)) {
        return data.map(item => recursiveCleanNulls(item))
    }
    if (typeof data === 'object' && data !== null) {
        const cleaned: any = {}
        for (const key in data) {
            const value = data[key]
            if (value !== null) {
                cleaned[key] = recursiveCleanNulls(value)
            }
        }
        return cleaned
    }
    return data
}

/**
 * Downloads an image from a URL and uploads it to Payload's media collection.
 * Includes a multi-stage fallback mechanism for unreliable AI-provided URLs.
 */
async function uploadMedia(url: string, payload: Payload, attempt = 1): Promise<string | number | null> {
    try {
        console.log(`[AI Post-Processor] Uploading media (Attempt ${attempt}): ${url}`)

        // Use a 10s timeout to avoid hanging the job
        const response = await fetch(url, { signal: AbortSignal.timeout(10000) })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const buffer = Buffer.from(await response.arrayBuffer())
        const contentType = response.headers.get('content-type') || 'image/jpeg'
        const extension = contentType.split('/')[1]?.split('+')[0] || 'jpg'
        const filename = `ai-gen-${Date.now()}-${attempt}.${extension}`

        const media = await payload.create({
            collection: 'media',
            data: {
                alt: 'AI Generated Image',
            },
            file: {
                data: buffer,
                name: filename,
                mimetype: contentType,
                size: buffer.byteLength,
            },
        })

        return media.id
    } catch (error: any) {
        console.error(`[AI Post-Processor] Media upload failed for ${url}: ${error.message}`)

        // Fallback Strategy
        if (attempt === 1) {
            // Attempt 2: Use a reliable, high-quality generic image
            const fallbackUnsplash = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop'
            return uploadMedia(fallbackUnsplash, payload, 2)
        } else if (attempt === 2) {
            // Attempt 3: Use a definitive placeholder service (almost 100% reliable)
            const fallbackPlaceholder = 'https://placehold.co/1200x800.png?text=Media+Unavailable'
            return uploadMedia(fallbackPlaceholder, payload, 3)
        }

        return null
    }
}

/**
 * Transforms a single AI link object to Payload's link group format.
 */
function transformSingleLink(linkItem: any): any {
    if (!linkItem || typeof linkItem !== 'object') return linkItem

    // If it's already in the correct format, skip
    if (linkItem.type && (linkItem.url || linkItem.reference)) return linkItem

    return {
        type: linkItem.type || 'custom',
        url: linkItem.url || '#',
        label: linkItem.text || linkItem.label || 'Learn More',
        appearance: linkItem.appearance || 'default',
        newTab: linkItem.newTab || false
    }
}

/**
 * Resolves category slugs to IDs. Creates them if they don't exist.
 */
async function resolveCategories(slugs: string[], payload: Payload): Promise<(string | number)[]> {
    if (!Array.isArray(slugs)) return []

    const resolvedIds: (string | number)[] = []

    for (const slug of slugs) {
        if (typeof slug !== 'string') {
            resolvedIds.push(slug)
            continue
        }

        try {
            // 1. Try to find existing
            const existing = await payload.find({
                collection: 'categories',
                where: {
                    slug: { equals: slug }
                },
                limit: 1,
            })

            if (existing.docs.length > 0) {
                resolvedIds.push(existing.docs[0].id)
            } else {
                // 2. Create if missing
                console.log(`[AI Post-Processor] Creating missing category: ${slug}`)
                const newCat = await payload.create({
                    collection: 'categories',
                    data: {
                        title: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
                        slug: slug,
                        language: 'en',
                    } as any
                })
                resolvedIds.push(newCat.id)
            }
        } catch (error) {
            console.error(`[AI Post-Processor] Failed to resolve category ${slug}:`, error)
        }
    }

    return resolvedIds
}

/**
 * Transforms AI's link format to Payload's link group format.
 */
function transformLinks(links: any[]): any[] {
    if (!Array.isArray(links)) return links

    return links.map(linkItem => {
        // If it's already in the correct format, skip
        if (linkItem.link) return linkItem

        return {
            link: transformSingleLink(linkItem)
        }
    })
}

/**
 * Recursively processes the layout blocks to handle media, links, and rich text.
 */
export async function postProcessLayout(layout: any[], payload: Payload): Promise<any[]> {
    if (!Array.isArray(layout)) return layout

    console.log(`[AI Post-Processor] Cleaning and processing ${layout.length} blocks...`)

    // 1. Clean nulls globally (AI often output "link": null which crashes Payload validation)
    const cleanedLayout = recursiveCleanNulls(layout)
    const processedLayout = []

    for (const block of cleanedLayout) {
        const newBlock = { ...block }
        console.log(`[AI Post-Processor] Processing block: ${newBlock.blockType}`)

        // 1. Process Links
        if (newBlock.links && Array.isArray(newBlock.links)) {
            newBlock.links = transformLinks(newBlock.links)
        }
        if (newBlock.link && typeof newBlock.link === 'object') {
            newBlock.link = transformSingleLink(newBlock.link)
        }

        // 2. Process Rich Text
        if (newBlock.richText && typeof newBlock.richText === 'string') {
            newBlock.richText = toLexical(newBlock.richText)
        }

        // 3. Convert numbers to strings for specific fields (like columns)
        if (typeof newBlock.columns === 'number') {
            newBlock.columns = String(newBlock.columns)
        }

        // 4. Process Media fields at top level of block
        const mediaFields = ['media', 'icon', 'logo', 'image']
        for (const field of mediaFields) {
            if (newBlock[field] && typeof newBlock[field] === 'string' && newBlock[field].startsWith('http')) {
                newBlock[field] = await uploadMedia(newBlock[field], payload)
            }
        }

        // 5. Specific Block Handling
        if (newBlock.blockType === 'archive') {
            if (newBlock.categories && Array.isArray(newBlock.categories)) {
                newBlock.categories = await resolveCategories(newBlock.categories, payload)
            }
            if (newBlock.introContent && typeof newBlock.introContent === 'string') {
                newBlock.introContent = toLexical(newBlock.introContent)
            }
        }

        // 6. Process nested arrays (like FeatureGrid items or FAQ questions)
        for (const key in newBlock) {
            if (Array.isArray(newBlock[key])) {
                newBlock[key] = await Promise.all(newBlock[key].map(async (item: any) => {
                    if (typeof item === 'object' && item !== null) {
                        const newItem = { ...item }

                        // Handle links in array items
                        if (newItem.links && Array.isArray(newItem.links)) {
                            newItem.links = transformLinks(newItem.links)
                        }
                        if (newItem.link && typeof newItem.link === 'object') {
                            newItem.link = transformSingleLink(newItem.link)
                        }

                        // Handle media in array items
                        for (const field of mediaFields) {
                            if (newItem[field] && typeof newItem[field] === 'string' && newItem[field].startsWith('http')) {
                                newItem[field] = await uploadMedia(newItem[field], payload)
                            }
                        }

                        // Handle rich text in array items
                        if (newItem.richText && typeof newItem.richText === 'string') {
                            newItem.richText = toLexical(newItem.richText)
                        }
                        if (newItem.answer && typeof newItem.answer === 'string') { // Special case for FAQ
                            newItem.answer = toLexical(newItem.answer)
                        }

                        return newItem
                    }
                    return item
                }))
            }
        }

        processedLayout.push(newBlock)
    }

    return processedLayout
}
