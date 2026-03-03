import { getAIService } from "../service"

export const generateTranscriptSummary = async (transcript: any[]): Promise<string> => {
    if(!transcript || transcript.length === 0) return 'No transcript available.'
    const aiService = getAIService()
    const messages: any = [
        {
            role: 'system',
            content: 'You are a helpful assistant that summarizes chat transcripts between a user and a bot. Provide a concise 2-3 sentence summary focusing on the user\'s intent and key information provided.'
        },
        {
            role: 'user',
            content: `Please summarize this chat transcript: ${JSON.stringify(transcript)}`
        }
    ]
    try{
        const response = await aiService.generate(messages, {
            type: 'json_object'
        })
        return response.data.summary ? response.data.summary : 'Summary not available.'
    } catch(err) {
        console.error('Error generating summary:', err)
        return 'Error generating summary.'
    }
}