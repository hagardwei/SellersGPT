import { CollectionBeforeChangeHook } from 'payload'

export const syncGroupSlug: CollectionBeforeChangeHook = async ({
    data,
    req,
    originalDoc,
    operation,
    collection
}) => {
    // Only run if slug is changing and it's an update
    if (operation !== 'update') return data

    // Prevent infinite recursion using context flag
    if (req.context?.syncingGroupSlug) {
        return data
    }

    const newSlug = data?.slug
    const oldSlug = originalDoc?.slug
    const groupId = data?.translation_group_id || originalDoc?.translation_group_id
    if (newSlug && oldSlug && newSlug !== oldSlug && groupId) {
        // Find all siblings in the same group
        const siblings = await req.payload.find({
            collection: collection.slug as any, 
            where: {
                and: [
                    {
                        translation_group_id: { equals: groupId },
                    },
                    {
                        id: { not_equals: originalDoc.id },
                    }
                ]
            },
            depth: 0,
            limit: 100,
            pagination: false,
            req, // Pass req to maintain access/context
        })

        if (siblings.docs.length === 0) return data

        // Set context flag for subsequent updates
        req.context.syncingGroupSlug = true

        // Update all siblings with the new slug
        try {
            await Promise.all(
                siblings.docs.map((sibling) =>
                    req.payload.update({
                        collection: collection.slug as any,
                        id: sibling.id,
                        data: {
                            slug: newSlug,
                        },
                        req, // Pass req to preserve context
                        context: {
                            syncingGroupSlug: true, // Also set in context to be sure
                        }
                    })
                )
            )
        } catch (err) {
            console.error('[syncGroupSlug] FAILED to sync variants:', err)
        } finally {
            // No need to clear it on this request as it's returned soon, 
            // and req.context is local to the request chain.
        }
    }

    return data
}
