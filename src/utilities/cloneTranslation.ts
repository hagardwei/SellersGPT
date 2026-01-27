import { PayloadHandler } from 'payload'

const removeIds = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map(removeIds)
    } else if (obj !== null && typeof obj === 'object') {
        const newObj: any = {}
        for (const [key, value] of Object.entries(obj)) {
            if (key !== 'id' && key !== '_id' && key !== 'createdAt' && key !== 'updatedAt') {
                newObj[key] = removeIds(value)
            }
        }
        return newObj
    }
    return obj
}

export const cloneTranslationHandler: PayloadHandler = async (req: any) => {
    const { routeParams, payload, user, url } = req
    if (!user) return new Response('Unauthorized', { status: 401 })

    const id = routeParams?.id
    const parsedUrl = new URL(url || '', 'http://localhost')
    const newLang = parsedUrl.searchParams.get('newLang')

    if (!id) return new Response('Missing document ID', { status: 400 })
    if (!newLang) return new Response('Missing newLang parameter', { status: 400 })

    const pathSegments = parsedUrl.pathname.split('/')
    const collectionSlug = req.collection?.slug || pathSegments[pathSegments.indexOf('api') + 1]

    if (!collectionSlug) return new Response('Could not determine collection', { status: 400 })

    try {
        // Fetch source document
        const sourceDoc = await payload.findByID({
            collection: collectionSlug as any,
            id,
            depth: 0,
        })

        if (!sourceDoc) return new Response('Source document not found', { status: 404 })

        // Clean data recursively to remove all internal IDs and system fields
        const cleanedData = removeIds(sourceDoc)

        // Create new document variant
        const newDoc = await payload.create({
            collection: collectionSlug as any,
            data: {
                ...cleanedData,
                language: newLang,
                _status: 'draft', // Always start as draft
            },
        })

        return new Response(JSON.stringify(newDoc), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (err: any) {
        console.error('Clone Error:', err)
        return new Response(JSON.stringify({ error: err.message || 'Clone failed', detail: err.data }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}
