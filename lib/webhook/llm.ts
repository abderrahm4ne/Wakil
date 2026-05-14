import { createGroq } from '@ai-sdk/groq'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createAnthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'
import { Plan } from '@prisma/client'

const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY })
const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function callLLM( plan: Plan, systemPrompt: string, userMessage: string ): Promise<string> {

  if (plan === 'FREE_TRIAL' || plan === 'STARTER') {
    return "Sorry, AI responses are not available on the Free Trial and Starter plans. Please uupgrage to the Pro plan to access AI-powered customer support. For more details please contact us directly."
  }

  if (plan === 'PRO') {
    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      system: systemPrompt,
      prompt: userMessage
    })
    return text
  }

  const { text } = await generateText({
    model: anthropic('claude-sonnet-4-5'),
    system: systemPrompt,
    prompt: userMessage
  })
  return text
}