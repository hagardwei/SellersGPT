import { cn } from '@/utilities/ui'
import React from 'react'
import type { GalleryBlock as GalleryProps } from '@/payload-types'
import { Media } from '../../components/Media'

export const GalleryBlock: React.FC<GalleryProps> = (props) => {
    const { heading, images, columns = '3', settings } = props

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

    const gridCols = {
        '2': 'grid-cols-1 sm:grid-cols-2',
        '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
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
                {heading && (
                    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{heading}</h2>
                )}

                {images && images.length > 0 && (
                    <div className={cn('grid gap-4 md:gap-8', gridCols[columns as keyof typeof gridCols] || gridCols['3'])}>
                        {images.map((item, index) => (
                            <div key={index} className="group relative aspect-square rounded-2xl overflow-hidden bg-background">
                                <Media resource={item.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                {item.caption && (
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                        <p className="text-white text-sm font-medium">{item.caption}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
