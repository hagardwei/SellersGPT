import { HeaderClient } from './Component.client'
import { getCachedLocalizedCollectionItem } from '@/utilities/getLocalizedCollection'
import React from 'react'

import type { Header } from '@/payload-types'

export async function Header({ lang = 'en' }: { lang?: string }) {
  const headerData: Header = await getCachedLocalizedCollectionItem('header', lang, 1)()

  return <HeaderClient data={headerData} lang={lang} />
}
