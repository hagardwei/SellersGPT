import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function sendLeadNotification({
  name,
  email,
  summary,
  transcript,
}: {
  name: string
  email: string
  summary: string
  transcript: any
}) {
  await resend.emails.send({
    from: "SellersGPT <leads@yourdomain.com>",
    to: process.env.SALES_EMAIL!,
    subject: `New Lead from ${name}`,
    html: `
      <h2>New Lead</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>AI Summary:</strong> ${summary}</p>
      <hr />
      <pre>${JSON.stringify(transcript, null, 2)}</pre>
    `,
  })
}