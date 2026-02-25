import { getPayload } from "payload"
import configPromise from '@payload-config'

export async function POST(req: Request) {
    try {
        const { name, email, message, transcript } = await req.json()

        if (transcript.length > 50) {
            return Response.json(
                { error: "Transcript too long" },
                { status: 400 }
            )
        }

        if (!name || !email) {
            return Response.json({ error: "Missing fields" }, { status: 400 })
        }

        const payload = await getPayload({ config: configPromise })

        const lead = await (payload as any).create({
            collection: 'leads',
            data: {
                name,
                email,
                message,
                transcript,
                status: 'new',
            },
        })

        return Response.json({ success: true, leadId: lead.id })
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 500 })
    }
}