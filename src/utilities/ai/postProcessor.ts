import { Payload } from 'payload'
import crypto from 'crypto'
import { toLexical } from './lexicalConverter'
import { AllBlocks } from './blockReference'

/**
 * Recursively removes any keys with explicit null values from an object or array.
 * Payload CMS sometimes chokes on null for group fields, preferring undefined/missing keys.
 * Also strips database-specific fields like 'id' and '_uuid' to allow cloning/translating.
 */
export function recursiveCleanNulls(data: any, stripIds: boolean = false): any {
    // If it's a populated media object (contains id and url), convert to ID
    if (data && typeof data === 'object' && !Array.isArray(data) && data.id && (data.url || data.filename)) {
        return data.id
    }

    if (Array.isArray(data)) {
        return data
            .map(item => recursiveCleanNulls(item, stripIds))
            .filter(item => item !== undefined && item !== null)
    }
    if (typeof data === 'object' && data !== null) {
        const cleaned: any = {}
        for (const key in data) {
            // Strip database-internal fields if requested
            if (stripIds && ['id', '_uuid', 'createdAt', 'updatedAt', 'blockName'].includes(key)) {
                continue
            }

            const value = data[key]
            if (value !== undefined && value !== null) {
                cleaned[key] = recursiveCleanNulls(value, stripIds)
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
 * Generic helper to resolve a slug to an ID for a given collection.
 */
async function resolveSlugToId(collection: any, slug: string, payload: Payload): Promise<string | number | null> {
    if (!slug || typeof slug !== 'string') return null

    // If it looks like a numeric ID, return it as a number
    if (/^\d+$/.test(slug)) return parseInt(slug, 10)

    try {
        const result = await payload.find({
            collection,
            where: {
                slug: { equals: slug }
            },
            limit: 1,
        })
        return result.docs[0]?.id || null
    } catch (error) {
        console.error(`[AI Post-Processor] Failed to resolve slug "${slug}" in collection "${collection}":`, error)
        return null
    }
}

/**
 * Transforms a single AI link object to Payload's link group format.
 */
async function transformSingleLink(linkItem: any, payload: Payload): Promise<any> {
    if (!linkItem || typeof linkItem !== 'object') return linkItem

    // 1. Extract and normalize fields
    const rawType = linkItem.type || 'custom'
    const reference = linkItem.reference || linkItem.page || linkItem.url
    const label = linkItem.label || linkItem.text || linkItem.title || 'Learn More'
    const rawAppearance = linkItem.appearance || 'default'
    const newTab = !!linkItem.newTab

    // Normalize type - only allow 'reference' or 'custom'
    const type = rawType === 'reference' ? 'reference' : 'custom'

    // Normalize appearance - only allow 'default' or 'outline'
    const appearance = (rawAppearance === 'outline' || rawAppearance === 'secondary') ? 'outline' : 'default'

    if (type === 'reference' && reference) {
        let resolvedId = reference

        if (typeof reference === 'string' && isNaN(Number(reference))) {
            const id = await resolveSlugToId('pages', reference, payload)
            if (id) {
                resolvedId = id
            } else {
                // Fall through to custom below if page not found
                resolvedId = null
            }
        }

        if (resolvedId) {
            return {
                type: 'reference',
                reference: {
                    relationTo: 'pages',
                    value: resolvedId,
                },
                label,
                appearance,
                newTab,
            }
        }
    }

    // Default to custom
    return {
        type: 'custom',
        url: linkItem.url || (typeof reference === 'string' ? `/${reference}` : '#'),
        label,
        appearance,
        newTab,
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
                        translation_group_id: crypto.randomUUID(),
                    } as any
                })
                resolvedIds.push(newCat.id)
            }
        } catch (error) {
            console.error(`[AI Post-Processor] Failed to resolve category ${slug}:`, error)
        }
    }

    return resolvedIds.filter(id => id !== null && id !== undefined)
}

/**
 * Creates a form based on AI definition if it doesn't exist.
 */
async function createFormFromAI(block: any, payload: Payload): Promise<string | number | null> {
    const title = block.formTitle || block.form || 'New Contact Form'

    try {
        // Check if exists
        const existing = await payload.find({
            collection: 'forms',
            where: {
                title: { equals: title }
            }
        })

        if (existing.docs.length > 0) {
            return existing.docs[0].id
        }

        // Create new form
        console.log(`[AI Post-Processor] Creating new form: ${title}`)
        const fields = Array.isArray(block.formFields) ? block.formFields.map((f: any) => {
            const field: any = {
                ...f,
                blockType: f.blockType || 'text',
                name: f.name || f.label?.toLowerCase().replace(/\s+/g, '_') || 'field',
                label: f.label || f.name || 'Field',
                required: !!f.required,
            }

            if (field.blockType === 'message' && typeof field.message === 'string') {
                field.message = toLexical(field.message)
            }

            return field
        }) : [
            {  blockType: 'text', name: 'full_name', label: 'Full Name', required: true },
            {  blockType: 'email', name: 'email', label: 'Email Address', required: true },
            {  blockType: 'textarea', name: 'message', label: 'Message', required: true }
        ]

        const newForm = await payload.create({
            collection: 'forms',
            data: {
                title,
                fields,
                submitButtonLabel: 'Submit',
                confirmationType: 'message',
                confirmationMessage: toLexical('Thank you for your message! We will get back to you soon.'),
            } as any
        })
        return newForm.id
    } catch (error) {
        console.error(`[AI Post-Processor] Failed to create form "${title}":`, error)
        return null
    }
}

/**
 * Transforms AI's link format to Payload's link group format.
 */
async function transformLinks(links: any[], payload: Payload): Promise<any[]> {
    if (!Array.isArray(links)) return links

    const transformed = await Promise.all(links.map(async (item) => {
        if (!item || typeof item !== 'object') return item

        // If the AI already provided the { link: { ... } } structure, 
        // we still need to process the inner 'link' object to fix field names (text -> label, etc)
        const innerLink = item.link || item

        return {
            link: await transformSingleLink(innerLink, payload)
        }
    }))

    return transformed
}

/**
 * Validates a single block against its definition in AllBlocks.
 */
function validateBlock(block: any): { valid: boolean; error?: string } {
    if (!block || typeof block !== 'object') {
        return { valid: false, error: 'Block is not an object or is null' }
    }

    if (!block.blockType) {
        return { valid: false, error: 'Missing blockType' }
    }

    // Find the schema for this block type
    const schema = AllBlocks.find(s => s.slug === block.blockType)
    if (!schema) {
        return { valid: false, error: `Block type "${block.blockType}" is not recognized in the AI schema definition.` }
    }

    // Check required fields based on schema strings
    for (const [fieldName, fieldDesc] of Object.entries(schema.fields)) {
        const isRequired = typeof fieldDesc === 'string' && fieldDesc.includes('(required)')

        // Handle nested required fields in arrays if possible, 
        // but for now focus on top-level required fields of the block.
        if (isRequired && (block[fieldName] === undefined || block[fieldName] === null || block[fieldName] === '')) {
            return {
                valid: false,
                error: `Missing required field "${fieldName}" for block type "${block.blockType}". Expected: ${fieldDesc}`
            }
        }

        // Basic type validation if description mentions "Array"
        if (typeof fieldDesc === 'string' && fieldDesc.includes('Array')) {
            const data = block[fieldName]
            if (data !== undefined && !Array.isArray(data)) {
                return {
                    valid: false,
                    error: `Field "${fieldName}" should be an Array for block type "${block.blockType}".`
                }
            }

            // Basic check for empty required arrays
            if (isRequired && (!data || data.length === 0)) {
                return {
                    valid: false,
                    error: `Required array "${fieldName}" is empty or missing for block type "${block.blockType}".`
                }
            }
        }
    }

    // Special logic for blocks with conditional requirements or complex objects
    if (block.blockType === 'hero') {
        if (!block.title) return { valid: false, error: 'Hero block must have a title.' }
        if ((block.variant === 'media' || block.variant === 'split') && !block.media) {
            return { valid: false, error: 'Hero variant "media" or "split" requires a media upload.' }
        }
    }

    if (block.blockType === 'formBlock') {
        if (!block.form && !block.formTitle && !block.formFields) {
            return { valid: false, error: 'Form block must have either an existing form slug or a new form definition (formTitle/formFields).' }
        }
    }

    return { valid: true }
}


/**
 * Recursively processes the layout blocks to handle media, links, and rich text.
 * Now returns both the processed layout and any validation/processing errors.
 */
export async function postProcessLayout(
    layout: any[],
    payload: Payload,
): Promise<{ processedLayout: any[]; validationErrors: any[] }> {
    if (!Array.isArray(layout)) return { processedLayout: [], validationErrors: [] }

    console.log(`[AI Post-Processor] Cleaning and processing ${layout.length} blocks...`)

    const validationErrors: any[] = []
    const processedLayout: any[] = []

    // 1. Initial clean of the whole layout
    // We strip IDs because if this is a translation or regeneration, 
    // we want to create NEW blocks, not update existing ones by ID.
    const cleanedLayout = recursiveCleanNulls(layout, true)

    for (let i = 0; i < cleanedLayout.length; i++) {
        const block = cleanedLayout[i]

        try {
            // 2. Validate block structure
            const validation = validateBlock(block)
            if (!validation.valid) {
                console.warn(`[AI Post-Processor] Block ${i} (${block?.blockType}) failed validation: ${validation.error}`)
                validationErrors.push({
                    index: i,
                    type: block?.blockType || 'unknown',
                    error: validation.error,
                })
                continue
            }

            // 3. Strip unknown fields and prepare newBlock
            const schema = AllBlocks.find(s => s.slug === block.blockType)!
            const newBlock: any = { 
                blockType: block.blockType,
            }

            // Only copy fields defined in the schema
            for (const fieldName in schema.fields) {
                if (block[fieldName] !== undefined) {
                    newBlock[fieldName] = block[fieldName]
                }
            }

            console.log(`[AI Post-Processor] Processing block ${i}: ${newBlock.blockType}`)

            // 3. Process Links
            if (newBlock.links && Array.isArray(newBlock.links)) {
                newBlock.links = await transformLinks(newBlock.links, payload)
            }
            if (newBlock.link && typeof newBlock.link === 'object') {
                newBlock.link = await transformSingleLink(newBlock.link, payload)
            }

            // 4. Process Rich Text
            if (newBlock.richText && typeof newBlock.richText === 'string') {
                newBlock.richText = toLexical(newBlock.richText)
            }

            // 5. Convert numbers to strings for specific fields
            if (typeof newBlock.columns === 'number') {
                newBlock.columns = String(newBlock.columns)
            }

            // 6. Process Media fields at top level
            const mediaFields = ['media', 'icon', 'logo', 'image']
            for (const field of mediaFields) {
                if (newBlock[field] && typeof newBlock[field] === 'string' && newBlock[field].startsWith('http')) {
                    const mediaId = await uploadMedia(newBlock[field], payload)

                    if (mediaId) {
                        newBlock[field] = mediaId // Assign ID directly, no wrapping
                    } else {
                        newBlock[field] = undefined // Remove failed URL to prevent Drizzle crash
                    }
                }
            }

            // 7. Specific Block Handling
            if (newBlock.blockType === 'archive') {
                if (newBlock.categories && Array.isArray(newBlock.categories)) {
                    newBlock.categories = await resolveCategories(newBlock.categories, payload)
                }
                if (newBlock.introContent && typeof newBlock.introContent === 'string') {
                    newBlock.introContent = toLexical(newBlock.introContent)
                }
            }

            if (newBlock.blockType === 'formBlock') {
                if (typeof newBlock.form === 'string') {
                    const resolvedFormId = await resolveSlugToId('forms', newBlock.form, payload)
                    if (resolvedFormId) {
                        newBlock.form = resolvedFormId
                    } else if (newBlock.formTitle || newBlock.formFields) {
                        // Create it!
                        const createdId = await createFormFromAI(newBlock, payload)
                        if (createdId) {
                            newBlock.form = createdId
                        } else {
                            throw new Error(`Failed to create form "${newBlock.formTitle || newBlock.form}"`)
                        }
                    } else {
                        throw new Error(`Could not resolve form slug "${newBlock.form}" to an existing form and no definition provided.`)
                    }
                } else if (!newBlock.form && (newBlock.formTitle || newBlock.formFields)) {
                    // Create it even if form slug is missing but title/fields exist
                    const createdId = await createFormFromAI(newBlock, payload)
                    if (createdId) {
                        newBlock.form = createdId
                    } else {
                        throw new Error(`Failed to create form "${newBlock.formTitle || 'Untitled'}"`)
                    }
                }
            }

            // 8. Process nested arrays (FeatureGrid, FAQ, etc.)
            for (const key in newBlock) {
                if (Array.isArray(newBlock[key])) {
                    const items = await Promise.all(
                        newBlock[key].map(async (item: any) => {
                            if (typeof item === 'object' && item !== null) {
                                const newItem = { 
                                    ...item,
                                }

                                if (newItem.links && Array.isArray(newItem.links)) {
                                    newItem.links = await transformLinks(newItem.links, payload)
                                }
                                if (newItem.link && typeof newItem.link === 'object') {
                                    newItem.link = await transformSingleLink(newItem.link, payload)
                                }

                                for (const field of mediaFields) {
                                    if (
                                        newItem[field] &&
                                        typeof newItem[field] === 'string' &&
                                        newItem[field].startsWith('http')
                                    ) {
                                        const mediaId = await uploadMedia(newItem[field], payload)

                                        if (mediaId) {
                                            newItem[field] = mediaId // Assign ID directly
                                        } else {
                                            newItem[field] = undefined // Remove failed URL
                                        }
                                    }
                                }

                                if (newItem.richText && typeof newItem.richText === 'string') {
                                    newItem.richText = toLexical(newItem.richText)
                                }
                                if (newItem.answer && typeof newItem.answer === 'string') {
                                    newItem.answer = toLexical(newItem.answer)
                                }

                                return newItem
                            }
                            return item
                        }),
                    )
                    newBlock[key] = items.filter(item => item !== null && item !== undefined)
                }
            }

            processedLayout.push(newBlock)
        } catch (error: any) {
            console.error(`[AI Post-Processor] Unexpected error processing block ${i} (${block?.blockType}):`, error)
            validationErrors.push({
                index: i,
                type: block?.blockType || 'unknown',
                error: `Processing Error: ${error.message}`,
            })
        }
    }

    // Final deep clean for Drizzle
    const finalLayout = recursiveCleanNulls(processedLayout)

    return {
        processedLayout: finalLayout,
        validationErrors,
    }
}
