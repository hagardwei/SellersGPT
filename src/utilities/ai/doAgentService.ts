import { AIModelService, AIResponse, ChatMessage } from "./service";

export class DOAgentService implements AIModelService {
    private apiUrl: string;
    private apiToken: string;

    constructor() {
        this.apiUrl = process.env.DO_AGENT_API_URL || '';
        this.apiToken = process.env.DO_AGENT_WORKSPACE_TOKEN || '';

        if (!this.apiUrl || !this.apiToken){
            console.warn('[DO Agent] Missing AGENT_WORKSPACE_API_URL or AGENT_WORKSPACE_TOKEN. Falling back or failing.');
        }
    }

    async generate(input: string | ChatMessage[], options?: { type?: 'json_object' }): Promise<AIResponse> {
        try {
            const isChat = Array.isArray(input);
            const messages: ChatMessage[] = isChat ? input : [{ role: 'user', content: input }];
            
            // Format the request body according to typical DO Agent Workspace API specs.
            const requestBody = {
                messages: messages.map((m: any) => ({
                    role: m.role === 'bot' ? 'assistant' : m.role,
                    content: m.content
                }))
            };

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiToken}` 
                },
                body: JSON.stringify(requestBody)
            });

            if(!response.ok) {
                const errText = await response.text();
                throw new Error(`DO Agent API error: ${response.status} ${errText}`);
            }

            const data = await response.json();

            const content = data.message?.content || data.choices?.[0]?.message?.content;

            if(!content) {
                throw new Error('No content returned from DO Agent Workspace');
            }

            let parsedData = content;
            if(options?. type === 'json_object') {
                try {
                    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
                    const jsonStr = jsonMatch ? jsonMatch[1] : content;
                    parsedData = JSON.parse(jsonStr);
                } catch (err) {
                    parsedData = { reply: content, askForLead: false }; 
                }
            }

            return {
                success: true,
                data: parsedData,
            };

        } catch (error: any) {
            console.error('[DO Agent Error]', error);
            return {
                success: false,
                error: error.message || 'Unknown error occurred during DO Agent generation', 
            }
        }
    }
}