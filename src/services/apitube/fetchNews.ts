export type APITubeArticle = {
  id: string;
  title: string;
  url: string;
  content: string;
  publishedAt: string;
};

export async function fetchIndustryNews(): Promise<APITubeArticle[]> {
  const response = await fetch(
    `https://api.apitube.io/v1/news?limit=100&industry=ecommerce`,
    {
      headers: {
        Authorization: `Bearer ${process.env.APITUBE_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`APITube error: ${response.statusText}`);
  }

  const data = await response.json();

  return data.articles as APITubeArticle[];
}
