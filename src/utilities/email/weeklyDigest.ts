import { getPayload } from "payload"
import configPromise from '@payload-config'

export async function sendWeeklySocialDigest() {
    const payload = await getPayload({ config: configPromise })

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    // 1. Fetch activities from the last week
    const posts = await payload.find({
        collection: 'social-posts' as any,
        where: {
            publishedAt: { greater_than_equal: oneWeekAgo.toISOString() }
        },
        limit: 100,
    })

    const publishedCount = (posts.docs as any[]).filter(p => p.status === 'published').length
    const failedCount = (posts.docs as any[]).filter(p => p.status === 'failed').length

    const emailBody = `
        <h1>Weekly Social Media Automation Digest</h1>
        <p>Summary of activity from ${oneWeekAgo.toLocaleDateString()} to ${new Date().toLocaleDateString()}</p>
        <ul>
        <li>Total Posts Published: <strong>${publishedCount}</strong></li>
        <li>Failed Attempts: <strong>${failedCount}</strong></li>
        </ul>
        <h3>Recent Posts:</h3>
        <ul>
        ${(posts.docs as any[]).slice(0, 5).map(p => `<li>[${p.platform}] ${p.content.substring(0, 50)}...</li>`).join('')}
        </ul>
    `

    await payload.sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@example.com',
        subject: 'Weekly Social Media Digest',
        html: emailBody,
    })

    console.log('[Social Digest] Weekly email sent to admin')
}