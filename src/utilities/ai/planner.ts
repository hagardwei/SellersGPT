import { getAIService } from './service'
import { loadReference } from './loadReference'

export type PlannedPage = {
    slug: string
    title: string
    blocks: string[]
}

export type WebsitePlan = {
    pages: PlannedPage[]
}

/**
 * Plans the structure of the website using AI.
 */
export const planWebsiteStructure = async (websiteInfo: any): Promise<{ data: WebsitePlan | null, prompt: string }> => {
    const aiService = getAIService()
    const blockReference = loadReference({ mode: 'summary' })

    const systemPrompt = `You are a professional UX strategy and web design AI. 
Your goal is to plan a comprehensive, conversion-optimized website structure for a client based on their business information.

RULES:
1. ONLY use the blocks provided in the reference guide below.
2. Output your plan strictly as a JSON object.
3. Keep page slugs lowercase and URL-friendly.
4. Ensure a logical flow (e.g., Home, About, Services, Contact).

BLOCK REFERENCE GUIDE:
${blockReference}
`

    const userPrompt = `Please plan a website structure for the following business:
- Name: ${websiteInfo.websiteName}
- Industry: ${websiteInfo.industry}
- Description: ${websiteInfo.description}
- Goal: ${websiteInfo.goal}
- Target Audience: ${websiteInfo.targetAudience}
- Brand Tone: ${websiteInfo.brandTone}

Return a JSON with a "pages" array. Each page must have "slug", "title", and a "blocks" array of block slugs.`

    const fullPrompt = userPrompt + "\n\nSystem Context:\n" + systemPrompt
    const response = await aiService.generate(fullPrompt, { type: 'json_object' })

    if (response.success && response.data) {
        return { data: response.data as WebsitePlan, prompt: fullPrompt }
    }

    console.error('[AI Planner Error]', response.error)
    return { data: null, prompt: fullPrompt }
}
