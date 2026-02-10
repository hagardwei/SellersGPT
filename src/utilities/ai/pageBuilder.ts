import { getAIService } from './service'
import { loadReference } from './loadReference'
import * as BlockSchemas from './blockReference'

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

    const systemPrompt = `You are a professional content writer and web architect. 
Your goal is to generate extremely realistic, high-converting content for a specific web page.

RULES:
1. ONLY generate content for the blocks requested in the user prompt.
2. Use the exact "slug" from the Block Reference for the "blockType".
3. For rich text fields (LexicalJSON), provide them as PLAIN STRING for now; our system will convert them.
4. MEDIA HANDLING (CRITICAL):
   - Any field defined as "upload" MUST be returned as a DIRECT STRING URL
   - Example: "https://images.unsplash.com/photo-123..."
   - Do NOT return objects, alt text, or IDs
   - Use Unsplash, Pexels, or Pixabay only
   - URLs must be public, HTTPS, and relevant
5. Brand Tone must be: ${websiteInfo.brandTone}.
6. Business Name: ${websiteInfo.websiteName}.

Output JSON format:
{
  "layout": [
    { "blockType": "hero", "title": "...", "subTitle": "...", "links": [...] },
    ...
  ]
}

BLOCK REFERENCE:
${blockRef}
`

    const internalLinkingContext = pageJob.allPlannedSlugs
        ? `\nAVAILABLE PAGES FOR INTERNAL LINKING:\n- ${pageJob.allPlannedSlugs.join('\n- ')}\nUse these exact slugs for internal reference links (buttons, nav items).`
        : ''

    const userPrompt = `Generate the content for the page "${pageJob.title}" (slug: ${pageJob.slug}).
The page should contain the following sequence of blocks: ${pageJob.blocks.join(', ')}.
${internalLinkingContext}

CONTEXT:
Industry: ${websiteInfo.industry}
Description: ${websiteInfo.description}
Goal: ${websiteInfo.goal}
Target Audience: ${websiteInfo.targetAudience}
`

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
