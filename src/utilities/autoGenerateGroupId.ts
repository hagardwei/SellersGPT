import { CollectionBeforeValidateHook } from 'payload'
import crypto from 'crypto'

export const autoGenerateGroupId: CollectionBeforeValidateHook = ({ data, operation }) => {
    if (operation === 'create' || !data?.translation_group_id) {
        if (!data?.translation_group_id) {
            return {
                ...data,
                translation_group_id: crypto.randomUUID(),
            }
        }
    }
    return data
}
