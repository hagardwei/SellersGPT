import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { HeroBlock } from '@/blocks/Hero/Component'
import { FeatureGridBlock } from '@/blocks/FeatureGrid/Component'
import { SplitBlock } from '@/blocks/Split/Component'
import { TestimonialsBlock } from '@/blocks/Testimonials/Component'
import { StatsBlock } from '@/blocks/Stats/Component'
import { LogoCloudBlock } from '@/blocks/LogoCloud/Component'
import { FAQBlock } from '@/blocks/FAQ/Component'
import { TimelineBlock } from '@/blocks/Timeline/Component'
import { GalleryBlock } from '@/blocks/Gallery/Component'
import { VideoBlock } from '@/blocks/Video/Component'

const blockComponents = {
  hero: HeroBlock,
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  featureGrid: FeatureGridBlock,
  split: SplitBlock,
  testimonials: TestimonialsBlock,
  stats: StatsBlock,
  logoCloud: LogoCloudBlock,
  faq: FAQBlock,
  timeline: TimelineBlock,
  gallery: GalleryBlock,
  video: VideoBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0
  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className={blockType === "hero" ? "" : "my-16"} key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
