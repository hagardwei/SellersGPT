import { CollectionBeforeChangeHook, ValidationError } from 'payload'

export const getBlockDuplicateSlug = (collection: string): CollectionBeforeChangeHook => {
    return async ({ data, req, originalDoc, operation }) => {
        const slug = data?.slug || originalDoc?.slug
        const language = data?.language || originalDoc?.language

        // Only needed for update operation
        const id = originalDoc?.id  

        console.log("#########################", slug, language, req.context, originalDoc)

        if (!slug || !language || req?.context?.aiJob) return data

        const payload = req.payload

        // Build the where filter for duplicates
        const where: any = {
            and: [
                { slug: { equals: slug } },
                { language: { equals: language } },
            ],
        }

        // Exclude the current document if this is an update
        if (operation === 'update' && id) {
            where.and.push({
                id: { not_equals: id },
            })
        }

        const result = await payload.find({
            collection: collection as any,
            overrideAccess: true,
            draft: operation !== 'create',
            where,
            limit: 1,
            pagination: false,
        })

        if (result.docs.length > 0) {
            console.log(`[blockDuplicateSlug] FAILED: Absolute block for "${slug}" in "${language}"`)
            throw new ValidationError({
                collection,
                errors: [
                    {
                        path: 'slug',
                        message: `The slug "${slug}" is already in use for the "${language}" language.`,
                    },
                ],
            })
        }

        return data
    }
}
