import { PayloadHandler } from 'payload'

export const deleteGroupHandler: PayloadHandler = async (req: any) => {
    const { routeParams, payload, user, url } = req
    if (!user || user.role !== 'admin') {
        return new Response('Unauthorized - Admin only', { status: 401 })
    }

    const id = routeParams?.id
    if (!id) return new Response('Missing document ID', { status: 400 })

    const parsedUrl = new URL(url || '', 'http://localhost')
    const pathSegments = parsedUrl.pathname.split('/')
    const collectionSlug = req.collection?.slug || pathSegments[pathSegments.indexOf('api') + 1]

    if (!collectionSlug) return new Response('Could not determine collection', { status: 400 })

    try {
        // Fetch document to get groupId
        const doc = await payload.findByID({
            collection: collectionSlug as any,
            id,
            depth: 0,
        })

        if (!doc) return new Response('Document not found', { status: 404 })

        const groupId = doc.translation_group_id

        if (!groupId) return new Response('Document is not part of a translation group', { status: 400 })

        // Delete all documents in the same group
        const result = await payload.delete({
            collection: collectionSlug as any,
            where: {
                translation_group_id: { equals: groupId },
            },
        })

        return new Response(JSON.stringify({ success: true, deletedCount: result.errors.length === 0 ? result.docs.length : 0 }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}
