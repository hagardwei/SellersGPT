import type { Block } from 'payload'
import { blockFields } from '../../fields/blockFields'

export const VideoBlock: Block = {
    slug: 'video',
    interfaceName: 'VideoBlock',
    fields: [
        {
            name: 'title',
            type: 'text',
        },
        {
            name: 'videoType',
            type: 'select',
            defaultValue: 'youtube',
            options: [
                { label: 'YouTube', value: 'youtube' },
                { label: 'Vimeo', value: 'vimeo' },
                { label: 'Self Hosted', value: 'selfHosted' },
            ],
        },
        {
            name: 'url',
            type: 'text',
            required: true,
            admin: {
                description: 'URL for YouTube/Vimeo or Direct link to video file',
            },
        },
        {
            name: 'thumbnail',
            type: 'upload',
            relationTo: 'media',
            admin: {
                condition: (data, siblingData) => siblingData.videoType === 'selfHosted',
            },
        },
        {
            name: 'aspectRatio',
            type: 'select',
            defaultValue: 'video',
            options: [
                { label: '16:9', value: 'video' },
                { label: '4:3', value: '4/3' },
                { label: '1:1', value: 'square' },
            ],
        },
        ...blockFields,
    ],
}
