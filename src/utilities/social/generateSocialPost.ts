import { WebsiteInfo } from "@/payload-types";
import { socialPostPrompt } from "../ai/prompts/socialPostsPrompt";
import { generateText } from "../ai/service";

export interface SocialSnippet {
    platform: 'linkedin' | 'facebook' | 'twitter'
    content: string
}

export async function generateSocialSnippets(
    sourceContent: string,
    sourceTitle: string,
    websiteInfo: WebsiteInfo
): Promise<SocialSnippet[]> {
    const prompt = socialPostPrompt(websiteInfo, sourceTitle, sourceContent)
    try {
        const response = await generateText(prompt, 'Generate social media snippets')

        // Attempt to parse JSON from AI response
        const jsonMatch = response.match(/\[[\s\S]*\]/)
        if(jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }

        throw new Error('Failed to parse AI response for social snippets')
    } catch (error) {
        console.error('Error generating social snippets:', error)
        return []
    }
}