import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createGroq } from '@ai-sdk/groq'
import { generateText, ModelMessage } from 'ai'
import { Plan } from "@/generated/prisma/enums"

const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY
})

const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
})

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY
})

export async function callLLM(
    plan: Plan,
    systemPrompt: string,
    userMessage: string,
    history: ModelMessage[]
): Promise<string> {

    if (plan === 'FREE_TRIAL' || plan === 'STARTER') {
        return "Sorry, AI responses are not available on the Free Trial and Starter plans. Please upgrade to the Pro plan to access AI-powered customer support. For more details please contact us directly."
    }

    const model = plan === 'PRO'
        ? groq('llama-3.3-70b-versatile')
        : groq('llama-3.3-70b-versatile')

    const { text } = await generateText({
        model,
        system: systemPrompt,
        messages: [
        ...history,
        {
            role: 'user',
            content: userMessage
        }
    ]
    })

    return text
}