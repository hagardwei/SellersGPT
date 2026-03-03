import { generateTranscriptSummary } from "@/utilities/ai/handlers/generateSummary"

export const generateSummaryBeforeSave = async ({ data, operation }: { data: any; operation: any }) => {
  if (operation === 'create' && data?.transcript?.length) {
    try {
      const summary = await generateTranscriptSummary(data.transcript)

      data.message = `${data.message || ''}\n\nAI Summary: ${summary}`.trim()

    } catch (err) {
      console.error('Error generating summary:', err)
    }
  }

  return data
}