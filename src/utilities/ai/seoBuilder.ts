import { getAIService } from './service'
import type { BlockData } from './pageBuilder'
import type { WebsiteInfo } from '@/payload-types'
import type { ReviewResult } from './reviewer'

export type PageSEO = {
  meta: {
    title: string
    description: string
  }
}

export const buildPageSEO = async (
  pageInput: {
    title: string,
    slug: string
  },
  websiteInfo: WebsiteInfo,
  layout: BlockData[],
  review?: ReviewResult,
  options?: {   
    skipAI?: boolean
  }
): Promise<PageSEO> => {
  const hero = layout.find(b => b.blockType === 'hero') as any

  // ---------- 1. Base fallback SEO (NO AI) ----------
  let baseTitle =
    hero?.title ||
    pageInput.title ||
    websiteInfo.websiteName

  let baseDescription =
    hero?.subTitle ||
    websiteInfo.description ||
    `Learn more about ${pageInput.title} at ${websiteInfo.websiteName}.`

  const image =
    hero?.media ||
    undefined

  // Trim safely
  baseTitle = trim(baseTitle, 60)
  baseDescription = trim(baseDescription, 160)

  // ---------- 2. Skip AI if requested ----------
  if (options?.skipAI) {
    return {
      meta: {
        title: baseTitle,
        description: baseDescription,
      },
    }
  }

  // ---------- 3. AI-enhanced SEO ----------
  const aiService = getAIService()

  const seoHints = review?.suggestions?.join(' • ') || ''

  const prompt = `
You are an expert SEO copywriter.

Improve the following SEO metadata.

RULES:
- Meta title max 60 characters
- Meta description max 160 characters
- Must be compelling and click-worthy
- Match brand tone: ${websiteInfo.brandTone}
- Business name: ${websiteInfo.websiteName}
- Industry: ${websiteInfo.industry}

PAGE SLUG: /${pageInput.slug}

BASE META TITLE:
${baseTitle}

BASE META DESCRIPTION:
${baseDescription}

REVIEWER NOTES:
${seoHints || 'None'}

OUTPUT JSON ONLY:
{
  "meta": {
    "title": "...",
    "description": "..."
  }
}
`

  try {
    const response = await aiService.generate(prompt, {
      type: 'json_object',
    })

    if (response.success && response.data?.meta) {
      return {
        meta: {
          title: trim(response.data.meta.title, 60),
          description: trim(response.data.meta.description, 160),
        },
      }
    }
  } catch (err) {
    console.warn('[SEO Builder] AI SEO generation failed, using fallback')
  }

  // ---------- 4. Guaranteed fallback ----------
  return {
    meta: {
      title: baseTitle,
      description: baseDescription,
    },
  }
}

// ---------- helpers ----------
function trim(text: string, max: number) {
  if (!text) return text
  return text.length > max
    ? text.slice(0, max - 1).trim() + '…'
    : text
}
