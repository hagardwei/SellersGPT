import * as BlockSchemas from './blockReference'

/**
 * Loads and formats the block reference for AI consumption.
 * @param options - Mode 'summary' (slugs only) or 'detailed' (full fields), and optional block slugs filter.
 */
export const loadReference = (options: { mode?: 'summary' | 'detailed', includeBlocks?: string[] } = {}): string => {
    const { mode = 'detailed', includeBlocks } = options
    let blocks = BlockSchemas.AllBlocks

    if (includeBlocks && includeBlocks.length > 0) {
        blocks = blocks.filter(b => includeBlocks.includes(b.slug))
    }

    let referenceString = mode === 'summary' ? "# Available Website Blocks (Inventory)\n\n" : "# Detailed Block Schemas\n\n"

    blocks.forEach((block) => {
        referenceString += `## Block: ${block.slug}\n`
        referenceString += `Description: ${block.description}\n`
        if (mode === 'detailed') {
            referenceString += `Schema:\n\`\`\`json\n${JSON.stringify(block.fields, null, 2)}\n\`\`\`\n`
        }
        referenceString += `\n`
    })

    return referenceString
}
