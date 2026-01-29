import { cn } from '@/utilities/ui'
import React from 'react'
import type { LogoCloudBlock as LogoCloudProps } from '@/payload-types'
import { Media } from '../../components/Media'

export const LogoCloudBlock: React.FC<LogoCloudProps> = (props) => {
    const { heading, logos, settings } = props

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
                    <h2 className="text-xl md:text-2xl font-semibold mb-12 text-center opacity-60 uppercase tracking-widest">{heading}</h2>
                )}

                {logos && logos.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24">
                        {logos.map((logo, index) => (
                            <div key={index} className="w-32 md:w-40 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300">
                                <Media resource={logo.logo} className="w-full h-auto object-contain max-h-12" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
