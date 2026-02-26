import { spacesClient } from "@/lib/spaces";
import { AiJob } from "@/payload-types";
import { BasePayload } from "payload";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const handleAgentSync = async (
  jobId: string | number,
  job: AiJob,
  payload: BasePayload
): Promise<void> => {
  console.log(`[Agent Sync] Starting sync for job ${jobId}`);

  try {
    const { sourceId, sourceType } = job.input_payload as {
      sourceId: string;
      sourceType: 'page' | 'post';
    };

    console.log(`[Agent Sync] sourceId: ${sourceId}, sourceType: ${sourceType}`);

    if (!sourceId || !sourceType) {
      throw new Error('Missing sourceId or sourceType in input_payload');
    }

    // 1. Fetch content
    let content: any = null;
    if (sourceType === 'page') {
      console.log(`[Agent Sync] Fetching page with ID ${sourceId}`);
      content = await payload.findByID({ collection: 'pages', id: sourceId });
    } else if (sourceType === 'post') {
      console.log(`[Agent Sync] Fetching post with ID ${sourceId}`);
      content = await payload.findByID({ collection: 'posts', id: sourceId });
    }

    if (!content) {
      throw new Error(`${sourceType} with ID ${sourceId} not found`);
    }

    console.log(`[Agent Sync] Content fetched:`, content);

    const extractText = (obj: any): string => {
      if (typeof obj === 'string') return obj;
      if (Array.isArray(obj)) return obj.map(extractText).join(' ');
      if (typeof obj === 'object' && obj !== null) {
        if (obj.type === 'text' && obj.text) return obj.text;
        if (obj.text) return obj.text;

        const validValues = Object.entries(obj)
          .filter(([key]) =>
            !['id', 'blockType', 'type', 'version', 'direction', 'format', 'indent'].includes(key)
          )
          .map(([, val]) => val);

        return validValues.map(extractText).join(' ');
      }
      return '';
    };

    const rawContent = sourceType === 'page' ? content.layout : content.content;
    const clean_text = extractText(rawContent).replace(/\s+/g, ' ').trim() || content.title;

    console.log(`[Agent Sync] Extracted text length: ${clean_text.length}`);

    // 2. Build URL safely
    const serverUrlRaw = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
    let serverUrl: string;
    try {
      const urlObj = new URL(serverUrlRaw);
      serverUrl = urlObj.toString().replace(/\/$/, ''); // remove trailing slash
    } catch (e) {
      console.error(`[Agent Sync] Invalid NEXT_PUBLIC_SERVER_URL: ${serverUrlRaw}`);
      throw e;
    }

    console.log(`[Agent Sync] Using serverUrl: ${serverUrl}`);

    const urlPath = content.slug === 'home' ? '/' : `/${encodeURIComponent(content.slug)}`;
    const langPrefix = content.language && content.language !== 'en' ? `/${encodeURIComponent(content.language)}` : '';
    const fullUrl = `${serverUrl}${langPrefix}${urlPath}`;

    console.log(`[Agent Sync] Full URL: ${fullUrl}`);

    // 3. Format for Agent Workspace
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
      updatedAt: content.updatedAt,
    };

    console.log(`[Agent Sync] Payload ready, uploading to Spaces...`);

    const fileKey = `sync/${sourceType}/${content.id}-${Date.now()}.json`;

    await spacesClient.send(
      new PutObjectCommand({
        Bucket: process.env.DO_SPACES_BUCKET!,
        Key: fileKey,
        Body: JSON.stringify(syncPayload, null, 2),
        ContentType: 'application/json',
      })
    );

    console.log(`[Agent Sync] Uploaded to Spaces: ${fileKey}`);

    // 4. Update job status
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
    });

    console.log(`[Agent Sync] Job ${jobId} marked as completed`);
  } catch (err: any) {
    console.error(`[Agent Sync] Error: ${err.message}`, err);
    throw err;
  }
};