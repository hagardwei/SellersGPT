import { AiJob } from "@/payload-types";
import { BasePayload } from "payload";

export const handleAgentSync = async (jobId: string | number, job: AiJob, payload: BasePayload): Promise<void> => {
    console.log(`[Agent Sync] Starting sync for job ${jobId}`)

    try {
        const { sourceId, sourceType } = job.input_payload as {
            sourceId: string
            sourceType: 'page' | 'post'
        }

        if(!sourceId || !sourceType){
            throw new Error('Missing sourceId or sourceType in input_payload')
        }

        // const existingJob = await payload.findByID({ collection: "ai-jobs", id: jobId })
        // if (existingJob?.status === 'completed' && existingJob.output_payload?.sourceId === sourceId && existingJob.output_payload?.sourceType === sourceType) {
        //     console.info(`[Agent Sync] Job ${jobId} already synced at ${existingJob.output_payload.syncedAt}`)
        // return
        // }

        //1. Fetch content
        let content: any = null
        if(sourceType === 'page'){
            content = await payload.findByID({
                collection: 'pages',
                id: sourceId,
            })
        } else if( sourceType === 'post') {
            content = await payload.findByID({
                collection: 'posts',
                id: sourceId,
            })
        }

        if(!content){
            throw new Error(`${sourceType} with ID ${sourceId} not found`)
        }

        const extractText = (obj: any): any => {
            if(typeof obj === 'string') return obj
            if(Array.isArray(obj)) return obj.map(extractText).join(' ');
            if(typeof obj === 'object' && obj !== null) {
                if (obj.type === 'text' && obj.text) return obj.text;
                if(obj.text) return obj.text;

                const validValues = Object.entries(obj)
                    .filter(([key]) => !['id', 'blockType', 'type', 'version', 'direction', 'format', 'indent'].includes(key))
                    .map(([, val]) => val);
                return validValues.map(extractText).join(' ')
            }
            return '';
        }

        const rawContent = sourceType === 'page' ? content.layout : content.content;
        const clean_text = extractText(rawContent).replace(/\s+/g, ' ').trim() || content.title;
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
        const urlPath = content.slug === 'home' ? '/' : `/${content.slug}`;
        const langPrefix = content.language && content.language !== 'en' ? `/${content.language}` : '';
        const fullUrl = `${serverUrl}${langPrefix}${urlPath}`;

        // 2. Format for Agent Workspace
        // This is a placeholder for the actual Agent Workspace API format
        const syncPayload = {
            id: content.id,
            title: content.title,
            clean_text: clean_text,
            url: fullUrl,
            content_type: sourceType,
            language: content.language || 'en',
            updated_at: content.updatedAt,
            content: sourceType === 'page' ? JSON.stringify(content.layout) : content.content,
            slug: content.slug,
            type: sourceType,
            updatedAt: content.updatedAt
        }

        // console.log(`[Agent Sync] Syncing ${sourceType} ${content.title} to Agent Workspace...`)

        const agentApiUrl = process.env.AGENT_WORKSPACE_API_URL || 'https://api.agentworkspace.io/v1/sync';

        const isMockUrl = agentApiUrl.includes('https://api.agentworkspace.io')

        let response;

        if(!isMockUrl){
            // // 3. Sync to external API (Mocking the request for now)
            response = await fetch(agentApiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.AGENT_WORKSPACE_TOKEN}`
              },
              body: JSON.stringify(syncPayload)
            })
        }

        if (response && !response.ok) {
          try {
            const errText = await response.text();
            console.error(`Sync failed with status ${response.status}: ${errText}`);
            throw new Error(`Sync failed with status ${response.status}: ${errText}`);
          } catch (e) {
            throw new Error(`Sync failed with status ${response.status}`);
          }
        }

        // Mock success
        await new Promise((resolve) => setTimeout(resolve, 1000))

        console.log(`[Agent Sync] Successfully synced ${sourceType} ${content.title}`)

        await payload.update({
            collection: 'ai-jobs',
            id: jobId,
            data: {
                status: 'completed',
                step: 'SYNC_COMPLETED',
                output_payload: {
                    syncedAt: new Date().toISOString(),
                    sourceId,
                    sourceType,
                    title: content.title,
                },
            },
        })
    } catch (err: any) {
        console.error(`[Agent Sync] Error: ${err.message}`)
        throw err
    }
}