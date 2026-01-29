'use client'
import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import type { FAQBlock as FAQProps } from '@/payload-types'
import RichText from '@/components/RichText'

export const FAQBlock: React.FC<FAQProps> = (props) => {
    const { heading, questions, settings } = props
    const [openIndex, setOpenIndex] = useState<number | null>(null)

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
            <div className="container max-w-4xl">
                {heading && (
                    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{heading}</h2>
                )}

                {questions && questions.length > 0 && (
                    <div className="space-y-4">
                        {questions.map((item, index) => (
                            <div key={index} className="border border-border rounded-2xl overflow-hidden bg-background/5">
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-background/10 transition-colors"
                                >
                                    <span className="text-lg font-semibold">{item.question}</span>
                                    <svg
                                        className={cn('w-6 h-6 transform transition-transform duration-300', openIndex === index ? 'rotate-180' : '')}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div
                                    className={cn(
                                        'overflow-hidden transition-all duration-300 ease-in-out',
                                        openIndex === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                                    )}
                                >
                                    <div className="p-6 pt-0 opacity-80 prose prose-md dark:prose-invert max-w-none">
                                        <RichText data={item.answer} enableGutter={false} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
