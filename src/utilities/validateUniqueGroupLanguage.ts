import { CollectionBeforeValidateHook, ValidationError } from 'payload'

export const validateUniqueGroupLanguage: CollectionBeforeValidateHook = async ({
    data,
    req,
    originalDoc,
    operation,
    collection
}) => {
    const language = data?.language || originalDoc?.language
    const groupId = data?.translation_group_id || originalDoc?.translation_group_id
    const id = originalDoc?.id

    if (!language || !groupId) return data
    if (!req?.payload) return data

    // Check if another document in the same group already has this language
    const result = await req.payload.find({
        collection: collection.slug as any,
        where: {
            and: [
                {
                    translation_group_id: { equals: groupId },
                },
                {
                    language: { equals: language },
                },
                ...(id ? [{ id: { not_equals: id } }] : []),
            ],
        },
        depth: 0,
        limit: 1,
        pagination: false,
    })

    if (result.docs.length > 0) {
        throw new ValidationError({
            collection: collection.slug,
            errors: [
                {
                    path: 'language',
                    message: `The language "${language}" is already taken for this translation group.`,
                },
            ],
        })
    }

    return data
}
