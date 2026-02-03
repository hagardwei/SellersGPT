import { getAIService } from './service'
import { loadReference } from './loadReference'
import * as BlockSchemas from './blockReference'

export type BlockData = {
    blockType: string
    [key: string]: any
}

export type PageContent = {
    layout: BlockData[]
}

/**
 * Generates the full content for a single page.
 */
export const buildPageContent = async (pageJob: any, websiteInfo: any): Promise<{ data: PageContent | null, prompt: string }> => {
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
4. For image/upload fields, return relevant media urls from open source.
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
        return { data: response.data as PageContent, prompt: fullPrompt }
    }

    console.error('[Page Builder Error]', response.error)
    return { data: null, prompt: fullPrompt }
}
