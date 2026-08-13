import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createAnthropic } from '@ai-sdk/anthropic'
import { generateText, ModelMessage } from 'ai'
import { Plan } from "@/generated/prisma/enums"

const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY })
const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function callLLM( plan: Plan, 
    systemPrompt: string, 
    userMessage: string,
    history: ModelMessage[]
): Promise<string> {

    if (plan === 'FREE_TRIAL' || plan === 'STARTER') {
        return "Sorry, AI responses are not available on the Free Trial and Starter plans. Please uupgrage to the Pro plan to access AI-powered customer support. For more details please contact us directly."
    }

    const model = plan === 'PRO'
        ? google('gemini-1.5-flash')
        : anthropic('claude-sonnet-4.5')

    const { text } = await generateText({
        model,
        system: systemPrompt,
        messages: history
    })
    return text
}