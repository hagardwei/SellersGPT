import { cn } from '@/utilities/ui'
import React from 'react'
import type { TimelineBlock as TimelineProps } from '@/payload-types'

export const TimelineBlock: React.FC<TimelineProps> = (props) => {
    const { heading, steps, settings } = props

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
            <div className="container max-w-5xl">
                {heading && (
                    <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">{heading}</h2>
                )}

                {steps && steps.length > 0 && (
                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" />

                        <div className="space-y-12">
                            {steps.map((step, index) => (
                                <div key={index} className={cn(
                                    'relative flex flex-col md:flex-row gap-8',
                                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                )}>
                                    {/* Dot */}
                                    <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm -translate-x-1/2 z-10 hidden md:block" />

                                    <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-12">
                                        <div className={cn(
                                            'p-8 rounded-2xl border border-border bg-background shadow-sm',
                                            index % 2 === 0 ? 'md:text-left' : 'md:text-right'
                                        )}>
                                            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
                                                {step.date}
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                            <p className="opacity-70 leading-relaxed">{step.description}</p>
                                        </div>
                                    </div>
                                    <div className="hidden md:block w-1/2 px-12" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
