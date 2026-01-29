import { cn } from '@/utilities/ui'
import React from 'react'
import type { TestimonialsBlock as TestimonialsProps } from '@/payload-types'
import { Media } from '../../components/Media'

export const TestimonialsBlock: React.FC<TestimonialsProps> = (props) => {
    const { heading, testimonials, settings } = props

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

                {testimonials && testimonials.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="flex flex-col h-full p-8 rounded-2xl border border-border bg-background shadow-sm hover:shadow-md transition-shadow">
                                <div className="mb-6 opacity-60">
                                    <svg width="45" height="36" viewBox="0 0 45 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.4141 35.1563C11.5391 35.1563 9.71094 34.6641 7.92969 33.6797C6.19531 32.6953 4.76562 31.3359 3.64062 29.6016C2.5625 27.8203 2.02344 25.8047 2.02344 23.5547C2.02344 21.0703 2.53906 18.7969 3.57031 16.7344C4.64844 14.6719 6.26562 12.3984 8.42188 9.91406L14.75 2.60156C15.3125 1.94531 16.0391 1.61719 16.9297 1.61719C17.6328 1.61719 18.2188 1.875 18.6875 2.39062C19.2031 2.90625 19.4609 3.49219 19.4609 4.14844C19.4609 4.57031 19.3438 4.96875 19.1094 5.34375L13.7656 12.0234C15.125 12.4453 16.2969 13.2656 17.2813 14.4844C18.2656 15.6562 18.7578 17.1328 18.7578 18.9141C18.7578 20.3203 18.4297 21.6094 17.7734 22.7813C17.1172 23.9062 16.2266 24.8203 15.1016 25.5234C13.9766 26.2266 12.7109 26.5781 11.3047 26.5781C10.7422 26.5781 10.2734 26.5078 9.89844 26.3672C9.89844 26.9297 10.1328 27.5625 10.6016 28.2656C11.1172 28.9219 11.75 29.5313 12.5 30.0938C13.25 30.6562 14.0703 31.0781 14.9609 31.3594C15.8984 31.6406 16.3672 32.1797 16.3672 32.9766C16.3672 33.6328 16.1094 34.1719 15.5938 34.5938C15.125 35.0156 14.3984 35.1563 13.4141 35.1563ZM37.9531 35.1563C36.0781 35.1563 34.25 34.6641 32.4688 33.6797C30.7344 32.6953 29.3047 31.3359 28.1797 29.6016C27.1016 27.8203 26.5625 25.8047 26.5625 23.5547C26.5625 21.0703 27.0781 18.7969 28.1094 16.7344C29.1875 14.6719 30.8047 12.3984 32.9609 9.91406L39.2891 2.60156C39.8516 1.94531 40.5781 1.61719 41.4688 1.61719C42.1719 1.61719 42.7578 1.875 43.2266 2.39062C43.7422 2.90625 44 3.49219 44 4.14844C44 4.57031 43.8828 4.96875 43.6484 5.34375L38.3047 12.0234C39.6641 12.4453 40.8359 13.2656 41.8203 14.4844C42.8047 15.6562 43.2969 17.1328 43.2969 18.9141C43.2969 20.3203 42.9688 21.6094 42.3125 22.7813C41.6563 23.9062 40.7656 24.8203 39.6406 25.5234C38.5156 26.2266 37.25 26.5781 35.8438 26.5781C35.2813 26.5781 34.8125 26.5078 34.4375 26.3672C34.4375 26.9297 34.6719 27.5625 35.1406 28.2656C35.6563 28.9219 36.2891 29.5313 37.0391 30.0938C37.7891 30.6562 38.6094 31.0781 39.5 31.3594C40.4375 31.6406 40.9063 32.1797 40.9063 32.9766C40.9063 33.6328 40.6484 34.1719 40.1328 34.5938C39.6641 35.0156 38.9375 35.1563 37.9531 35.1563Z" />
                                    </svg>
                                </div>
                                <blockquote className="text-lg leading-relaxed mb-8 flex-grow">
                                    "{testimonial.quote}"
                                </blockquote>
                                <div className="flex items-center gap-4">
                                    {testimonial.image && (
                                        <div className="w-12 h-12 rounded-full overflow-hidden border border-border">
                                            <Media resource={testimonial.image} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-bold">{testimonial.author}</div>
                                        {(testimonial.role || testimonial.company) && (
                                            <div className="text-sm opacity-60">
                                                {testimonial.role}{testimonial.role && testimonial.company && ', '}{testimonial.company}
                                            </div>
                                        )}
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
