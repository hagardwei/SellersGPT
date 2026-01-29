import React from 'react'
import type { HeroBlock as HeroBlockProps } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

export const SplitHero: React.FC<HeroBlockProps> = ({
    title,
    subTitle,
    links,
    media,
}) => {
    return (
        <section className="container py-24 grid md:grid-cols-2 gap-16 items-center">
            <div>
                <h1 className="text-5xl font-bold mb-6">{title}</h1>
                <p className="text-muted-foreground mb-8">{subTitle}</p>

                <div className="flex gap-4">
                    {(links || []).map(({ link }, i) => (
                        <CMSLink key={i} size="lg" {...link} />
                    ))}
                </div>
            </div>

            {media && typeof media === 'object' && (
                <Media
                    resource={media}
                    imgClassName="rounded-xl shadow-lg"
                />
            )}
        </section>
    )
}
