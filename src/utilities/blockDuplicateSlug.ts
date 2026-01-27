import { CollectionBeforeChangeHook, ValidationError } from 'payload'

export const getBlockDuplicateSlug = (collection: string): CollectionBeforeChangeHook => {
    return async ({ data, req, originalDoc, operation }) => {
        const slug = data?.slug || originalDoc?.slug
        const language = data?.language || originalDoc?.language
        const id = originalDoc?.id

        if (!slug || !language) return data

        const payload = req.payload

        const result = await payload.find({
            collection: collection as any,
            overrideAccess: true,
            draft: true, // Check both draft and published
            where: {
                and: [
                    {
                        slug: {
                            equals: slug,
                        },
                    },
                    {
                        language: {
                            equals: language,
                        },
                    },
                    ...(id
                        ? [
                            {
                                id: {
                                    not_equals: id,
                                },
                            },
                        ]
                        : []),
                ],
            },
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
