import { getPayload } from "payload";
import configPromise from '@payload-config'

export const SOCIAL_PLATFORMS = {
    LINKEDIN: 'linkedin',
    FACEBOOK: 'facebook',
    TWITTER: 'twitter',
}

export async function saveSocialToken(
    userId: string,
    platform: string,
    tokenData: {
        accessToken: string;
        refreshToken?: string;
        expiresAt: Date;
        username?: string
        platfornUserId?: string;
        scope?: string;
    }
) {
    console.log(`[SocialAuth] Saving token for user=${userId}, platform=${platform}`);

    try {
        const payload = await getPayload({ config: configPromise });
        console.log('[SocialAuth] Payload initialized');

        const user = await payload.findByID({
            collection: 'users',
            id: userId,
        });

        if (!user) {
            console.error(`[SocialAuth] User not found: ${userId}`);
            throw new Error('User not found');
        }

        console.log(`[SocialAuth] User found: ${(user as any).email}`);

        const existingAccounts = (user as any).socialAccounts || [];
        console.log(`[SocialAuth] Existing accounts count: ${existingAccounts.length}`);

        const otherAccounts = existingAccounts.filter(
            (acc: any) => acc.platform !== platform
        );

        console.log(
            `[SocialAuth] Replacing existing account for platform=${platform}`
        );

        const updatedUser = await payload.update({
                collection: 'users',
                id: userId,
                data: {
                    socialAccounts: [
                    ...otherAccounts,
                    {
                        platform,
                        ...tokenData,
                        isActive: true,
                    },
                ],
            },
            overrideAccess: true,
            depth: 0,
        })

        console.log('[SocialAuth] Returned socialAccounts:', updatedUser.socialAccounts)

    } catch (error) {
        console.error(
            `[SocialAuth] Failed to save token for user=${userId}, platform=${platform}`,
            error
        );
        throw error;
    }
}

export async function getSocialAccounts(userId: string) {
    console.log(`[SocialAuth] Fetching social accounts for user=${userId}`);

    try {
        const payload = await getPayload({ config: configPromise });

        const user = (await payload.findByID({
            collection: 'users',
            id: userId,
        })) as any;

        if (!user) {
            console.warn(`[SocialAuth] User not found while fetching accounts: ${userId}`);
            return [];
        }

        const accounts = user?.socialAccounts || [];

        console.log(
            `[SocialAuth] Found ${accounts.length} social account(s) for user=${userId}`
        );

        return accounts;
    } catch (error) {
        console.error(
            `[SocialAuth] Failed to fetch social accounts for user=${userId}`,
            error
        );
        throw error;
    }
}