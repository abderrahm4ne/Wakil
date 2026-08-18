import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createGroq } from '@ai-sdk/groq'
import { generateText, ModelMessage, tool, stepCountIs } from 'ai'
import { z } from 'zod'
import { Plan } from "@/generated/prisma/enums"
import { prisma } from '@/lib/prisma'

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
    botId: string,
    plan: Plan,
    systemPrompt: string,
    userMessage: string,
    history: ModelMessage[]
): Promise<string> {

    if (plan === 'FREE_TRIAL' || plan === 'STARTER') {
        return "Sorry, AI responses are not available on the Free Trial and Starter plans. Please upgrade to the Pro plan to access AI-powered customer support. For more details please contact us directly."
    }

    const model = plan === 'PRO'
        ? groq('openai/gpt-oss-120b')
        : groq('openai/gpt-oss-120b')

    const { text } = await generateText({
        model,
        system: systemPrompt,
        messages: [
        ...history,
        {
            role: 'user',
            content: userMessage
        }
    ],
        tools: {
            searchProduct: tool({
                description: `
                    Search the merchant's product catalog.

                    IMPORTANT:
                    - You MUST use this tool whenever the customer asks about product
                    availability, price, stock, variants, or whether a product exists.
                    - NEVER guess product information.
                    - NEVER claim a product is in or out stock without calling this tool.
                    - Search using the product name, keyword, or variant mentioned by the customer.
                    `,
                inputSchema: z.object({ query: z.string().describe('product name or keyword to search') }),
                execute: async ({ query }) => {
                    const products = await prisma.product.findMany({
                        where: {
                            botId,
                            stock: { gt: 0 },
                            name: { contains: query, mode: 'insensitive'}
                        },
                        take: 5,
                        select: { name: true, variant: true, price: true, stock: true}
                    })
                    return products.length > 0 ? products.map(p => ({
                        name: p.name,
                        variant: p.variant,
                        price: Number(p.price),
                        stock: p.stock
                    }))
                    : { message: 'No in-stock products matched this query.' }
                }
            }),
        },
        stopWhen: stepCountIs(3),
        temperature: 1,
    })

    return text
}