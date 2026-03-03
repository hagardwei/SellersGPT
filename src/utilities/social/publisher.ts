import { getPayload } from "payload";
import configPromise from '@payload-config'
import { publishToPlatform } from "./api";

export async function publishSocialPosts() {
    const payload = await getPayload({ config: configPromise })

    const now = new Date().toISOString()

    // 1. Find Scheduled posts that are due
    const pendingPosts = await payload.find({
        collection: 'social-posts' as any,
        where: {
            and: [
                { status: { equals: 'scheduled' } },
                { scheduledAt: { less_than_equal: now } }
            ]
        }
    })

    console.log(`[Social Worker] Found ${pendingPosts.docs.length} posts due for publishing`)

    if (pendingPosts.docs.length === 0) return;

    // Fetch potential users with social accounts once to avoid repeated queries
    const usersWithAccounts = await payload.find({
        collection: 'users',
        limit: 100,
    })


    for (const post of pendingPosts.docs as any[]) {
        try {
            console.log(`[Social Worker] Publishing post ${post.id} to ${post.platform}`)

            // 2. Find a user with a connected account for this platform
            const userWithPlatform = usersWithAccounts.docs.find((u: any) => 
                u.socialAccounts?.some((acc: any) => acc.platform === post.platform && acc.isActive)
            ) as any;


            if (!userWithPlatform) {
                throw new Error(`No user found with a connected and active ${post.platform} account.`);
            }

            const tokenData = userWithPlatform.socialAccounts.find((acc: any) => acc.platform === post.platform);

            // 3. Publish to platform
            const result = await publishToPlatform(post.platform, post.content, {
                accessToken: tokenData.accessToken,
                refreshToken: tokenData.refreshToken,
                expiresAt: tokenData.expiresAt,
            });

            if (!result.success) {
                throw new Error(result.error || 'Unknown API error');
            }

            // 4. Update Status
            await payload.update({
                collection: 'social-posts' as any,
                id: post.id,
                data: {
                    status: 'published',
                    publishedAt: new Date().toISOString(),
                    externalId: result.externalId || `ID_${Date.now()}`
                }
            })
            console.log(`[Social Worker] Successfully published post ${post.id} to ${post.platform}`);

        } catch (error: any) {
            console.error(`[Social Worker] Failed to publish post ${post.id}:`, error)
            await payload.update({
                collection: 'social-posts' as any,
                id: post.id,
                data: {
                    status: 'failed',
                    error: { message: error.message, stack: error.stack }
                }
            })
        }
    }
}