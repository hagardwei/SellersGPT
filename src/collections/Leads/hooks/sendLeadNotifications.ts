
export const sendLeadNotifications = async ({ doc, operation,  req: { payload, context }, }: { doc: any; operation: any, req: any }) => {
    if(operation === 'create') {
        const transcript = doc.transcript as any[]

        try {
            // 1. Send Email Notification
            const chatbotSettings = await payload.findGlobal({
                slug: 'chatbot-settings',
            })

            if(chatbotSettings?.emailNotifications){
                await payload.sendEmail({
                    to: process.env.ADMIN_EMAIL || 'neerajpathania@devexhub.in',
                    subject: `New Lead: ${doc.name}`,
                    html: `
                        <h1>New Lead Captured</h1>
                        <p><strong>Name:</strong> ${doc.name}</p>
                        <p><strong>Email:</strong> ${doc.email}</p>
                        <p><strong>Company:</strong> ${doc.company}</p>
                        <p><strong>Need:</strong> ${doc.need}</p>
                        <p><strong>Summary:</strong> ${doc.message}</p>
                        <p>View the full details in the admin panel.</p>
                    `
                })
            }
        } catch (err) {
                console.error('Error sending lead notification:', err)
        }
    }
}