import { cn } from '@/utilities/ui'
import React from 'react'
import type { VideoBlock as VideoProps } from '@/payload-types'

export const VideoBlock: React.FC<VideoProps> = (props) => {
    const { title, videoType, url, aspectRatio = 'video', settings } = props

    // Padding classes
    const pt = {
        none: 'pt-0',
        small: 'pt-8',
        medium: 'pt-16',
        large: 'pt-24',
    }
    const pb = {
        none: 'pb-0',
        small: 'pb-8',
        medium: 'pb-16',
        large: 'pb-24',
    }

    // Theme classes
    const themes = {
        light: 'bg-white text-black',
        dark: 'bg-black text-white',
        brand: 'bg-primary text-white',
    }

    const getEmbedUrl = () => {
        if (videoType === 'youtube') {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
            const match = url.match(regExp)
            if (match && match[2].length === 11) {
                return `https://www.youtube.com/embed/${match[2]}`
            }
        }
        if (videoType === 'vimeo') {
            const regExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/posts\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/
            const match = url.match(regExp)
            if (match) {
                return `https://player.vimeo.com/video/${match[1]}`
            }
        }
        return url
    }

    return (
        <div
            id={settings?.blockId || undefined}
            className={cn(
                themes[(settings?.theme || 'light') as keyof typeof themes],
                pt[(settings?.padding?.top || 'medium') as keyof typeof pt],
                pb[(settings?.padding?.bottom || 'medium') as keyof typeof pb],
                settings?.visibility === 'desktop' && 'hidden md:block',
                settings?.visibility === 'mobile' && 'md:hidden',
            )}
        >
            <div className="container max-w-5xl">
                {title && <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>}

                <div className={cn(
                    'relative w-full rounded-2xl overflow-hidden shadow-2xl bg-black',
                    aspectRatio === 'video' ? 'aspect-video' : '',
                    aspectRatio === '4/3' ? 'aspect-[4/3]' : '',
                    aspectRatio === 'square' ? 'aspect-square' : ''
                )}>
                    {videoType === 'selfHosted' ? (
                        <video
                            src={url}
                            controls
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <iframe
                            src={getEmbedUrl()}
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
