import { getAIService, AIResponse } from './service'
import { PageContent, BlockData } from './pageBuilder'

/**
 * Review result from the AI Reviewer
 */
export interface ReviewResult {
    approved: boolean
    score: number              // 0-100 quality score
    seoIssues: SEOIssue[]      // List of SEO problems
    contentIssues: ContentIssue[] // Content quality issues
    correctedContent?: PageContent // Auto-corrected content (if possible)
    suggestions: string[]      // Improvement suggestions
    seoRecommendations?: SEORecommendations
}

export interface SEOIssue {
    severity: 'error' | 'warning' | 'info'
    category: 'title' | 'meta' | 'headings' | 'links' | 'structure'
    message: string
    blockIndex?: number
}

export interface ContentIssue {
    severity: 'error' | 'warning' | 'info'
    category: 'tone' | 'length' | 'clarity' | 'relevance'
    message: string
    blockIndex?: number
}

export interface SEORecommendations {
  primaryKeyword?: string
  secondaryKeywords?: string[]
  suggestedTitle?: string
  suggestedMetaDescription?: string
  internalLinkSuggestions?: string[]
}

/**
 * SEO and content quality thresholds
 */
const SEO_RULES = {
    titleMinLength: 30,
    titleMaxLength: 60,
    subtitleMinLength: 50,
    subtitleMaxLength: 160,
    minBlocksPerPage: 3,
    maxBlocksPerPage: 15,
    requiredBlockTypes: ['hero'], // Every page should have a hero
}

/**
 * Pre-AI validation: Quick structural checks before sending to AI reviewer
 */
function performStructuralChecks(content: PageContent): { issues: SEOIssue[], deductions: number } {
    const issues: SEOIssue[] = []
    let deductions = 0

    if (!content.layout || !Array.isArray(content.layout)) {
        issues.push({
            severity: 'error',
            category: 'structure',
            message: 'Layout is missing or invalid'
        })
        return { issues, deductions: 50 }
    }

    // Check block count
    if (content.layout.length < SEO_RULES.minBlocksPerPage) {
        issues.push({
            severity: 'warning',
            category: 'structure',
            message: `Page has only ${content.layout.length} blocks. Recommended minimum is ${SEO_RULES.minBlocksPerPage}.`
        })
        deductions += 10
    }

    if (content.layout.length > SEO_RULES.maxBlocksPerPage) {
        issues.push({
            severity: 'warning',
            category: 'structure',
            message: `Page has ${content.layout.length} blocks. Consider reducing to ${SEO_RULES.maxBlocksPerPage} for better UX.`
        })
        deductions += 5
    }

    // Check for required blocks
    for (const requiredType of SEO_RULES.requiredBlockTypes) {
        const hasBlock = content.layout.some(block => block.blockType === requiredType)
        if (!hasBlock) {
            issues.push({
                severity: 'warning',
                category: 'structure',
                message: `Missing recommended block type: ${requiredType}`
            })
            deductions += 5
        }
    }

    // Check hero block if present
    const heroBlock = content.layout.find(block => block.blockType === 'hero')
    if (heroBlock) {
        if (heroBlock.title) {
            const titleLen = heroBlock.title.length
            if (titleLen < SEO_RULES.titleMinLength) {
                issues.push({
                    severity: 'warning',
                    category: 'title',
                    message: `Hero title is too short (${titleLen} chars). Aim for ${SEO_RULES.titleMinLength}-${SEO_RULES.titleMaxLength} chars.`,
                    blockIndex: 0
                })
                deductions += 5
            }
            if (titleLen > SEO_RULES.titleMaxLength) {
                issues.push({
                    severity: 'warning',
                    category: 'title',
                    message: `Hero title is too long (${titleLen} chars). Keep under ${SEO_RULES.titleMaxLength} chars for SEO.`,
                    blockIndex: 0
                })
                deductions += 5
            }
        } else {
            issues.push({
                severity: 'error',
                category: 'title',
                message: 'Hero block is missing a title',
                blockIndex: 0
            })
            deductions += 15
        }

        if (heroBlock.subTitle) {
            const subLen = heroBlock.subTitle.length
            if (subLen < SEO_RULES.subtitleMinLength) {
                issues.push({
                    severity: 'info',
                    category: 'meta',
                    message: `Hero subtitle is short (${subLen} chars). Consider expanding for better engagement.`,
                    blockIndex: 0
                })
                deductions += 2
            }
        }
    }

    // Check for internal links
    let hasInternalLinks = false
    content.layout.forEach((block, idx) => {
        if (block.links && Array.isArray(block.links)) {
            const internalLinks = block.links.filter((link: any) => 
                link.type === 'reference' || 
                (link.link?.type === 'reference') ||
                (link.url && link.url.startsWith('/')) ||
                (link.link?.url && link.link.url.startsWith('/'))
            )
            if (internalLinks.length > 0) hasInternalLinks = true
        }
    })

    if (!hasInternalLinks) {
        issues.push({
            severity: 'info',
            category: 'links',
            message: 'No internal links found. Consider adding links to other pages for better navigation and SEO.'
        })
        deductions += 5
    }

    // Check for FAQ block (good for SEO)
    const hasFAQ = content.layout.some(block => block.blockType === 'faq')
    if (!hasFAQ) {
        issues.push({
            severity: 'info',
            category: 'structure',
            message: 'Consider adding an FAQ block for better SEO schema markup.'
        })
        // No deduction, just a suggestion
    }

    return { issues, deductions }
}

/**
 * AI-powered content quality review
 */
async function performAIReview(
    content: PageContent, 
    context: { pageTitle: string, brandTone: string, industry: string }
): Promise<{ issues: ContentIssue[], suggestions: string[], deductions: number,   seoRecommendations?: SEORecommendations }> {
    const aiService = getAIService()

    const prompt = `You are an expert SEO and content quality reviewer. Analyze the following webpage content and provide a structured review.

PAGE TITLE: ${context.pageTitle}
BRAND TONE: ${context.brandTone}
INDUSTRY: ${context.industry}

CONTENT TO REVIEW:
${JSON.stringify(content.layout, null, 2)}

Provide your review as JSON with this exact structure:
{
    "contentIssues": [
        {
            "severity": "error|warning|info",
            "category": "tone|length|clarity|relevance",
            "message": "Description of the issue",
            "blockIndex": 0
        }
    ],
    "suggestions": [
        "Suggestion 1",
        "Suggestion 2"
    ],
    "overallQuality": "excellent|good|acceptable|poor",
    "toneMatch": true|false,
    "seoRecommendations": {
        "primaryKeyword": "string",
        "secondaryKeywords": ["string"],
        "suggestedTitle": "string",
        "suggestedMetaDescription": "string",
        "internalLinkSuggestions": ["slug"]
    }
}

REVIEW CRITERIA:
1. Does the content match the brand tone (${context.brandTone})?
2. Is the content relevant to the industry (${context.industry})?
3. Is the content clear and engaging?
4. Are there any grammatical or clarity issues?
5. Is the content length appropriate for each section?

Be constructive and specific. Limit to top 5 most important issues.`

    try {
        const response = await aiService.generate(prompt, { type: 'json_object' })
        
        if (!response.success || !response.data) {
            console.warn('[AI Reviewer] AI review failed, using structural checks only')
            return { issues: [], suggestions: [], deductions: 0 }
        }

        const reviewData = response.data
        const issues: ContentIssue[] = reviewData.contentIssues || []
        const suggestions: string[] = reviewData.suggestions || []
        const seoRecommendations = reviewData.seoRecommendations || undefined


        // Calculate deductions based on AI review
        let deductions = 0
        if (reviewData.overallQuality === 'poor') deductions += 20
        else if (reviewData.overallQuality === 'acceptable') deductions += 10
        else if (reviewData.overallQuality === 'good') deductions += 5

        if (reviewData.toneMatch === false) deductions += 10

        issues.forEach(issue => {
            if (issue.severity === 'error') deductions += 5
            else if (issue.severity === 'warning') deductions += 2
        })

        return { issues, suggestions, deductions, seoRecommendations }
    } catch (error) {
        console.error('[AI Reviewer] Error during AI review:', error)
        return { issues: [], suggestions: [], deductions: 0 }
    }
}

/**
 * Main review function - combines structural and AI-powered review
 */
export async function reviewContent(
    content: PageContent,
    context: {
        pageTitle: string
        pageSlug: string
        brandTone: string
        industry: string
        skipAIReview?: boolean
    }
): Promise<ReviewResult> {
    console.log(`[AI Reviewer] Starting review for page: ${context.pageTitle}`)

    // Start with perfect score
    let score = 100

    // 1. Perform structural/SEO checks (fast, no AI call)
    const structuralResult = performStructuralChecks(content)
    score -= structuralResult.deductions

    // 2. Perform AI-powered content review (optional, slower)
    let aiIssues: ContentIssue[] = []
    let suggestions: string[] = []
    let seoRecommendations: SEORecommendations | undefined
    if (!context.skipAIReview) {
        const aiResult = await performAIReview(content, {
            pageTitle: context.pageTitle,
            brandTone: context.brandTone,
            industry: context.industry
        })
        aiIssues = aiResult.issues
        suggestions = aiResult.suggestions
        seoRecommendations = aiResult.seoRecommendations
        score -= aiResult.deductions
    }

    // Ensure score is within bounds
    score = Math.max(0, Math.min(100, score))

    const approved = score >= 70

    console.log(`[AI Reviewer] Review complete. Score: ${score}, Approved: ${approved}`)

    return {
        approved,
        score,
        seoIssues: structuralResult.issues,
        contentIssues: aiIssues,
        suggestions,
        seoRecommendations,
    }
}

/**
 * Quick review without AI (for retry scenarios to avoid extra API costs)
 */
export async function quickReview(content: PageContent): Promise<{ score: number, issues: SEOIssue[] }> {
    const result = performStructuralChecks(content)
    const score = Math.max(0, 100 - result.deductions)
    return { score, issues: result.issues }
}
