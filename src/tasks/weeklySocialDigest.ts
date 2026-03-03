import { sendWeeklySocialDigest } from "@/utilities/email/weeklyDigest";

export const weeklySocialDigestTask: any = {
  slug: 'weeklySocialDigest',
  handler: async () => {
    console.log('[Task] Running Weekly Social Media Digest...')
    await sendWeeklySocialDigest()
    return { success: true }
  },
  schedule: [
    {
      cron: '0 0 * * 1', // Weekly on Monday at midnight
    },
  ],
}
