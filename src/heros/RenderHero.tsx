import React from 'react'

import type { Page, HeroBlock } from '@/payload-types'

import { HighImpactHero } from '@/heros/HighImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { MediumImpactHero } from '@/heros/MediumImpact'

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
}

export const RenderHero: React.FC<HeroBlock> = (props) => {
  const { variant: type } = props || {}

  if (!type) return null

  const HeroToRender = (heroes as any)[type === 'split' ? 'highImpact' : type === 'media' ? 'mediumImpact' : 'lowImpact']

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}
