import { cn } from '@/utilities/ui'
import React from 'react'
import type { StatsBlock as StatsProps } from '@/payload-types'

export const StatsBlock: React.FC<StatsProps> = (props) => {
    const { heading, stats, settings } = props

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
                {heading && (
                    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{heading}</h2>
                )}

                {stats && stats.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center p-8 rounded-2xl border border-border bg-background/5 backdrop-blur-sm">
                                <div className="text-4xl md:text-5xl font-bold mb-2 text-primary">{stat.value}</div>
                                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                                {stat.description && <p className="text-sm opacity-60">{stat.description}</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
