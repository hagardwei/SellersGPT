import { rateLimit } from "@/lib/rateLimiter"
import { getAIService } from "@/utilities/ai/service"

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json()
        const aiService = getAIService()
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown' // Get client IP address
        const allowed = await rateLimit(ip)

        if (!allowed) {
            return Response.json({ error: "Too many requests" }, { status: 429 })
        }

        const messages: any = [
            {
                role: "system",
                content: `
            You are a helpful presales assistant for SellersGPT.

            Your goal is to answer user questions and gently encourage them to leave their contact details (lead generation) if they express interest in pricing, quotes, or direct contact.

            You MUST respond with a valid JSON object.

            Return ONLY valid JSON.
            Do not include markdown.
            Do not include explanations.

            The JSON structure must be:
            {
            "reply": "your message here",
            "askForLead": true or false
            }
            `
            },
            ...(history || []).map((h: any) => ({
                role: h.role === "bot" ? "assistant" : "user",
                content: h.content
            })),
            { role: "user", content: message }
        ];


        const response = await aiService.generate(messages, {
            type: 'json_object'
        })

        if (response.success && response.data) {
            return Response.json(response.data)
        }

        const data = response.data

        // 🔥 Fallback rule-based trigger (AI safety net)
        const lower = message.toLowerCase()
        const forceLead =
            lower.includes("price") ||
            lower.includes("quote") ||
            lower.includes("demo") ||
            lower.includes("call") ||
            lower.includes("contact")

        if (forceLead) {
            data.askForLead = true
        }

        return Response.json(data)

    } catch (err: any) {
        return Response.json(
      {
        reply: "Sorry, something went wrong.",
        askForLead: false,
      },
      { status: 500 }
    )
    }
}