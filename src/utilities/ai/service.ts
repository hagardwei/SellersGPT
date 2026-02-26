import OpenAI from 'openai'
import { DOAgentService } from './doAgentService'

export type AIResponse = {
    success: boolean
    data?: any
    error?: string
}

export type ChatMessage = {
    role: 'user' | 'assistant' | 'system'
    content: string
}

export interface AIModelService {
    generate(prompt: string, schema?: any): Promise<AIResponse>
}

export class GeminiService implements AIModelService {
    private modelName: string
    private apiKey: string

    constructor() {
        this.modelName = process.env.GEMINI_MODEL_NAME || 'gemini-1.5-pro'
        this.apiKey = process.env.GEMINI_API_KEY || ''
    }

    async generate(prompt: string | ChatMessage[], schema?: any): Promise<AIResponse> {
        // console.log(`[Gemini] Generating with prompt: ${prompt.substring(0, 50)}...`)

        return {
            success: true,
            data: {},
        }
    }
}

export class OpenAIService implements AIModelService {
    private client: OpenAI
    private modelName: string

    constructor() {
        this.modelName = process.env.OPENAI_MODEL_NAME || 'gpt-4o'
        const apiKey = process.env.OPENAI_API_KEY || ''
        this.client = new OpenAI({
            apiKey: apiKey,
        })
    }

    async generate(input: string | ChatMessage[], options?: { type?: 'json_object' }): Promise<AIResponse> {
        try {
            const isChat = Array.isArray(input)
            let messages: ChatMessage[] = isChat
                ? input
                : [{ role: 'user', content: input }]
            console.log(`[OpenAI] Generating with prompt: ${isChat ? 'chat messages' : 'string prompt'}...`)

            if (options?.type === 'json_object') {
                messages = [
                    {
                    role: 'system',
                    content:
                        'You must respond ONLY with a valid JSON object. Return valid JSON.',
                    },
                    ...messages,
                ]
            }


            const response = await this.client.chat.completions.create({
                model: this.modelName,
                messages,
                response_format:
                    options?.type === 'json_object'
                        ? { type: 'json_object' }
                        : undefined,
            })

            console.log(response, "response")
            const content = response.choices[0]?.message?.content

            if (!content) {
                throw new Error('No content returned from OpenAI')
            }

            return {
                success: true,
                data:
                    options?.type === 'json_object'
                        ? JSON.parse(content)
                        : content,
            }
        } catch (error: any) {
            console.error('[OpenAI Error]', error)
            return {
                success: false,
                error: error.message || 'Unknown error occurred during OpenAI generation',
            }
        }
    }
}

/**
 * Factory to get the configured AI implementation.
 */
export const getAIService = (): AIModelService => {
    // if(process.env.DO_AGENT_WORKSPACE_API_URL && process.env.DO_AGENT_WORKSPACE_TOKEN){
    //     return new DOAgentService()
    // }
    return new OpenAIService()
}
