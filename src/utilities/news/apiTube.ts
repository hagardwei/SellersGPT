export interface ApiTubeArticle {
    id: string;
    title: string;
    description: string;
    content: string;
    url: string;
    source: string;
    publishedAt: string;
}

export async function fetchFromApiTube(apiKey: string, query: string, limit: number = 20): Promise<ApiTubeArticle[]> {
    if (!apiKey) {
        console.warn('[APITube] No API key provided. Skipping fetch.');
        return [];
    }

    try {
        const params = new URLSearchParams({
            per_page: limit.toString(),
            q: query,
            industry: 'auto', // optional if needed
        });
        const url = `https://api.apitube.io/v1/news/everything?q=${encodeURIComponent(query)}&limit=${limit}&key=${apiKey}`;
        const response = await fetch(`https://api.apitube.io/v1/news/everything?${params.toString()}`, {
            method: 'GET',
            headers: {
            'X-API-Key': apiKey,
            'Accept': 'application/json'
            },
        });


        if(!response.ok) {
            console.error(`[APITube] API error: ${response.status} ${await response.text()}`);
            return [];
        }

        const data = await response.json();

        const results = data.results || data.data || []


        return results.map((item: any) => ({
            id: item.id || item.article_id || item.url,
            title: item.title,
            description: item.description,
            content: item.content || item.body || item.description,
            url: item.href,
            source: item.source_name || item.source || 'unknown',
            publishedAt: item.published_at || item.date || new Date().toISOString()
        }));
    } catch (err) {
        console.error('[APITube] Fetch failed:', err);
        return [];
    }
}