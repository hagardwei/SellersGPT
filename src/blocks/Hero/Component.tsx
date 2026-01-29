import React from 'react'
import type { HeroBlock as HeroBlockProps } from '@/payload-types'
import { SimpleHero } from './SimpleHero'
import { MediaHero } from './MediaHero'
import { SplitHero } from './SplitHero'



export const HeroBlock: React.FC<HeroBlockProps> = (props) => {
    switch (props.variant) {
        case 'simple':
            return <SimpleHero {...props} />

        case 'media':
            return <MediaHero {...props} />

        case 'split':
            return <SplitHero {...props} />

        default:
            return null
    }
}
