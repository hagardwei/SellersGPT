import { cn } from '@/utilities/ui'
import React from 'react'
import type { SplitBlock as SplitProps } from '@/payload-types'
import { Media } from '../../components/Media'
import RichText from '@/components/RichText'
import { CMSLink } from '../../components/Link'

export const SplitBlock: React.FC<SplitProps> = (props) => {
    const { title, richText, media, mediaPosition = 'right', links, settings } = props

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
            <div className="container">
                <div className={cn(
                    'grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center',
                    mediaPosition === 'left' ? 'lg:direction-rtl' : ''
                )}>
                    <div className={cn(
                        'order-2 lg:order-1',
                        mediaPosition === 'left' ? 'lg:order-2' : 'lg:order-1'
                    )}>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{title}</h2>
                        {richText && (
                            <div className="prose prose-lg dark:prose-invert mb-8 opacity-80">
                                <RichText data={richText} enableGutter={false} />
                            </div>
                        )}
                        {links && links.length > 0 && (
                            <div className="flex flex-wrap gap-4">
                                {links.map((link, i) => (
                                    <CMSLink key={i} {...link.link} />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className={cn(
                        'order-1 lg:order-2',
                        mediaPosition === 'left' ? 'lg:order-1' : 'lg:order-2'
                    )}>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <Media resource={media} className="w-full h-auto object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
