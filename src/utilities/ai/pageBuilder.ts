import { getAIService } from './service'
import { loadReference } from './loadReference'
import * as BlockSchemas from './blockReference'
import { seoArticlePrompt } from './prompts/seoArticlePrompt'
import { landingPagePrompt } from './prompts/landingPagePrompt'

export type MediaObject = {
    url: string
    alt: string
}

export type BlockData = {
    blockType: string
    [key: string]: any
}

export type PageContent = {
    layout: BlockData[]
}

const VIDEO_ASPECT_RATIO_MAP: Record<string, string> = {
    '16:9': 'video',
    '16x9': 'video',
    'video': 'video',

    '4:3': '4/3',
    '4/3': '4/3',

    '1:1': 'square',
    'square': 'square',
}

/**
 * Ensures that all "reference" links from AI are converted to valid "custom" URLs for Payload.
 */
function normalizeLinks(block: BlockData): BlockData {
    const processLink = (link: any) => {
        if (!link || typeof link !== 'object') return link

        if (link.type === 'reference' && typeof link.url === 'string') {
            // Convert to a proper custom link path
            const slug = link.url.startsWith('/') ? link.url : `/${link.url}`
            return {
                ...link,
                type: 'custom',
                url: slug,
            }
        }
        return link
    }

    // Process top-level link
    if (block.link) {
        block.link = processLink(block.link)
    }

    // Process array of links
    if (Array.isArray(block.links)) {
        block.links = block.links.map(processLink)
    }

    // Process nested items (e.g., featureGrid items)
    for (const key in block) {
        if (Array.isArray(block[key])) {
            block[key] = block[key].map((item: any) => {
                if (item && typeof item === 'object') {
                    if (item.link) item.link = processLink(item.link)
                    if (Array.isArray(item.links)) item.links = item.links.map(processLink)
                }
                return item
            })
        }
    }

    return block
}

function normalizeVideoBlock(block: BlockData): BlockData {
    if (block.blockType !== 'video') return block

    if (typeof block.aspectRatio === 'string') {
        block.aspectRatio =
            VIDEO_ASPECT_RATIO_MAP[block.aspectRatio] ?? 'video'
    }

    return block
}


function normalizeBlock(block: BlockData): BlockData {
    normalizeLinks(block)
    normalizeVideoBlock(block)
    return block
}

/**
 * Generates the full content for a single page.
 * Converts AI "reference" links to valid Payload custom links.
 */
export const buildPageContent = async (
    pageJob: any,
    websiteInfo: any
): Promise<{ data: PageContent | null; prompt: string }> => {
    const aiService = getAIService()
    const blockRef = loadReference({
        mode: 'detailed',
        includeBlocks: pageJob.blocks
    })

    const mode = pageJob?.template === "seo-article" ? "seo-article" : "landing"

    const systemPrompt =
        mode === "seo-article"
            ? seoArticlePrompt(websiteInfo, blockRef)
            : landingPagePrompt(websiteInfo, blockRef)

    const internalLinkingContext = pageJob.allPlannedSlugs
        ? `\nAVAILABLE PAGES FOR INTERNAL LINKING:\n- ${pageJob.allPlannedSlugs.join('\n- ')}\nUse these exact slugs for internal reference links (buttons, nav items).`
        : ''

    const userPrompt = `
Generate the page "${pageJob.title}" (slug: ${pageJob.slug}).

Page Type: ${mode === "seo-article" ? "SEO Article" : "Landing Page"}

Required block sequence:
${pageJob.blocks.join(', ')}

${internalLinkingContext}

BUSINESS CONTEXT:
Industry: ${websiteInfo.industry}
Description: ${websiteInfo.description}
Goal: ${websiteInfo.goal}
Target Audience: ${websiteInfo.targetAudience}

${
    mode === "seo-article"
        ? `The reader searched for "${pageJob.title}". The content must directly satisfy that search intent.`
        : `The goal is to convert visitors into customers aligned with the business objective.`
}`

    const fullPrompt = userPrompt + "\n\nSystem Context:\n" + systemPrompt
    const response = await aiService.generate(fullPrompt, { type: 'json_object' })

    if (response.success && response.data) {
        const data = response.data as PageContent

        // Normalize all reference links to custom URLs
        if (Array.isArray(data.layout)) {
            data.layout = data.layout.map(normalizeBlock)
        }

        return { data, prompt: fullPrompt }
    }

    console.error('[Page Builder Error]', response.error)
    return { data: null, prompt: fullPrompt }
}
