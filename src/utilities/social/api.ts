import { SOCIAL_PLATFORMS } from "./service";

interface SocialToken {
    accessToken: string;
    refreshToken?: string;
    expiresAt: string | Date;
}

/**
 * Publishes a post to the specified platform using the provided tokens.
 */
export async function publishToPlatform(
    platform: string,
    content: string,
    tokens: SocialToken
): Promise<{ success: boolean; externalId?: string; error?: any }> {
    try {
        switch (platform) {
            case SOCIAL_PLATFORMS.LINKEDIN:
                return await publishToLinkedIn(content, tokens.accessToken);
            case SOCIAL_PLATFORMS.FACEBOOK:
                return await publishToFacebook(content, tokens.accessToken);
            case SOCIAL_PLATFORMS.TWITTER:
                return await publishToTwitter(content, tokens.accessToken);
            default:
                throw new Error(`Unsupported platform: ${platform}`);
        }
    } catch (error: any) {
        console.error(`[Social API] Error publishing to ${platform}:`, error);
        return { success: false, error: error.message || error };
    }
}

/**
 * LinkedIn UGC Post API
 */
async function publishToLinkedIn(content: string, accessToken: string) {
    // 1. Get member ID (urn:li:person:XXX)
    const meRes = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
        },
    });
    const meData = await meRes.json();
    if (!meRes.ok) throw new Error(`LinkedIn /me failed: ${JSON.stringify(meData)}`);
    
    const personUrn = `urn:li:person:${meData.sub}`;

    // 2. Create Post
    const postRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            author: personUrn,
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: { text: content },
                    shareMediaCategory: 'NONE',
                },
            },
            visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
            },
        }),
    });

    const postData = await postRes.json();
    if (!postRes.ok) throw new Error(`LinkedIn post failed: ${JSON.stringify(postData)}`);

    return { success: true, externalId: postData.id };
}

/**
 * Facebook Page Feed API
 */
async function publishToFacebook(content: string, userAccessToken: string) {
    // 1. Get Pages managed by user to find a Page access token
    const accountsRes = await fetch(`https://graph.facebook.com/me/accounts?access_token=${userAccessToken}`);
    const accountsData = await accountsRes.json();
    if (!accountsRes.ok) throw new Error(`Facebook /me/accounts failed: ${JSON.stringify(accountsData)}`);

    const page = accountsData.data?.[0]; // Default to first page for automation
    if (!page) throw new Error('No Facebook pages found for this user account.');

    const pageId = page.id;
    const pageAccessToken = page.access_token;

    // 2. Publish to Page Feed
    const postRes = await fetch(`https://graph.facebook.com/${pageId}/feed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: content,
            access_token: pageAccessToken,
        }),
    });

    const postData = await postRes.json();
    if (!postRes.ok) throw new Error(`Facebook post failed: ${JSON.stringify(postData)}`);

    return { success: true, externalId: postData.id };
}

/**
 * Twitter/X API v2 Tweets
 */
async function publishToTwitter(content: string, accessToken: string) {
    const postRes = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: content }),
    });

    const postData = await postRes.json();
    if (!postRes.ok) throw new Error(`Twitter post failed: ${JSON.stringify(postData)}`);

    return { success: true, externalId: postData.data.id };
}
