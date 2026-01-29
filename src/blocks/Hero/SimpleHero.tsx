import React from 'react'
import type { HeroBlock as HeroBlockProps } from '@/payload-types'
import { CMSLink } from '@/components/Link'

export const SimpleHero: React.FC<HeroBlockProps> = ({
    title,
    subTitle,
    links,
}) => {
    return (
        <section className="container py-24 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {title}
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                {subTitle}
            </p>

            <div className="flex justify-center gap-4">
                {(links || []).map(({ link }, i) => (
                    <CMSLink key={i} size="lg" {...link} />
                ))}
            </div>
        </section>
    )
}
