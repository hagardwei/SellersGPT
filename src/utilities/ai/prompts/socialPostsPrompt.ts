export const socialPostPrompt = (websiteInfo: any, sourceTitle: string, sourceContent: any) => `
    You are a social media expert. Generate 3 short, engaging social media posts based on the following content.
    
    Content Title: ${sourceTitle}
    Content Summary: ${sourceContent.substring(0, 2000)}
    
    Brand Info:
    - Industry: ${websiteInfo.industry}
    - Tone: ${websiteInfo.brandTone}
    - Target Audience: ${websiteInfo.targetAudience}
    
    Requirements per platform:
    1. LinkedIn: Professional, industry-focused, include 2-3 relevant hashtags.
    2. Facebook: Engaging, community-focused, slightly more casual.
    3. Twitter/X: Concise (under 280 chars), punchy, 1-2 hashtags.
    
    Return the result as a raw JSON array of objects with "platform" and "content" keys.
    Example: [{"platform": "linkedin", "content": "..."}, ...]
  `