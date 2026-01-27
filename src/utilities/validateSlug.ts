import { Validate } from 'payload'

export const getValidateSlug = (collection: string): Validate => {
    return async (value, { req, siblingData, id }) => {
        if (!value) return 'Slug is required'

        const language = siblingData?.language
        const payload = req.payload

        if (!language) {
            return true
        }

        try {
            const result = await payload.find({
                collection: collection as any,
                overrideAccess: true,
                draft: true, // Check both draft and published
                where: {
                    and: [
                        {
                            slug: {
                                equals: value,
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
                return `The slug "${value}" is already in use for the "${language}" language. Slugs must be unique per language.`
            }
        } catch (err) {
            return true
        }

        return true
    }
}

// Keep the old one for compatibility or legacy if needed
/** @deprecated Use getValidateSlug('collection-slug') instead */
export const validateSlug: Validate = (value, args) => {
    const collection = (args.req as any).collection?.slug || 'pages'
    return getValidateSlug(collection)(value, args)
}
