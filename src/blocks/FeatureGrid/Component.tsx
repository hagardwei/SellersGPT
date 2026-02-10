import { cn } from '@/utilities/ui'
import React from 'react'
import type { FeatureGridBlock as FeatureGridProps } from '@/payload-types'
import { Media } from '../../components/Media'

export const FeatureGridBlock: React.FC<FeatureGridProps> = (props) => {
    const { heading, subheading, items, columns = '3', settings } = props

    const gridCols = {
        '2': 'md:grid-cols-2',
        '3': 'md:grid-cols-3',
        '4': 'md:grid-cols-4',
    }

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
                {(heading || subheading) && (
                    <div className="mb-12 text-center max-w-2xl mx-auto">
                        {heading && <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>}
                        {subheading && <p className="text-lg opacity-80">{subheading}</p>}
                    </div>
                )}

                {items && items.length > 0 && (
                    <div className={cn('grid gap-8', gridCols[columns as keyof typeof gridCols] || gridCols['3'])}>
                        {items.map((item, index) => (
                            <div key={index} className="flex flex-col items-start p-6 rounded-xl border border-border/20 bg-background/5 backdrop-blur-sm">
                                {item.icon && (
                                    <div className="mb-6 flex items-center justify-center rounded-lg bg-primary/10">
                                        <Media resource={item.icon} />
                                    </div>
                                )}
                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                <p className="opacity-70 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
