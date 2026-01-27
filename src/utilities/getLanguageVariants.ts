import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const getLanguageVariants = async (collection: string, groupId: string) => {
    if (!groupId) return []

    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
        collection: collection as any,
        where: {
            translation_group_id: {
                equals: groupId,
            },
        },
        depth: 0,
        limit: 20,
        pagination: false,
        select: {
            language: true,
        }
    })

    return result.docs.map((doc: any) => doc.language as string)
}
