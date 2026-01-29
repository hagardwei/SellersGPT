import React from 'react'
import type { HeroBlock as HeroBlockProps } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

export const MediaHero: React.FC<HeroBlockProps> = ({
    title,
    subTitle,
    links,
    media,
}) => {
    return (
        <section className="relative overflow-hidden min-h-[80vh] flex items-center ">
            {media && typeof media === 'object' && (
                <Media
                    resource={media}
                    imgClassName="absolute inset-0 w-full h-full  object-cover"
                    priority
                />
            )}

            <div className="absolute inset-0 bg-black/60" />

            <div className="container relative z-10 text-white text-center my-auto">
                <h1 className="text-5xl font-bold mb-6">{title}</h1>
                <p className="max-w-2xl mx-auto mb-10">{subTitle}</p>

                <div className="flex justify-center gap-4">
                    {(links || []).map(({ link }, i) => (
                        <CMSLink key={i} size="lg" {...link} />
                    ))}
                </div>
            </div>
        </section>
    )
}
