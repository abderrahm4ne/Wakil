import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createGroq } from '@ai-sdk/groq'
import { generateText, ModelMessage, tool, stepCountIs } from 'ai'
import { z } from 'zod'
import { Plan } from "@/generated/prisma/enums"
import { prisma } from '@/lib/prisma'

const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY })
const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const groq = createGroq({ apiKey: process.env.GROQ_API_KEY })

export async function callLLM(
    botId: string,
    plan: Plan,
    systemPrompt: string,
    userMessage: string,
    history: ModelMessage[],
    conversationId: string,
    customerId: string
): Promise<string> {

    if (plan === 'FREE_TRIAL' || plan === 'STARTER') {
        return "Sorry, AI responses are not available on the Free Trial and Starter plans. Please upgrade to the Pro plan to access AI-powered customer support. For more details please contact us directly."
    }

    const canTakeOrders = plan === 'PRO' || plan === 'BUSINESS'

    const model = plan === 'PRO'
        ? groq('openai/gpt-oss-120b')
        : groq('openai/gpt-oss-120b')

    const searchProduct = tool({
        description: `
            Search the merchant's product catalog.

            IMPORTANT:
            - You MUST use this tool whenever the customer asks about product
            availability, price, stock, variants, or whether a product exists.
            - NEVER guess product information.
            - NEVER claim a product is in or out of stock without calling this tool.
            - Search using the product name, keyword, or variant mentioned by the customer.
            - NEVER EXPOSE HOW MUCH QUANTITY IS STILL IN STOCK
        `,
        inputSchema: z.object({ query: z.string().describe('product name or keyword to search') }),
        execute: async ({ query }) => {
            const products = await prisma.product.findMany({
                where: {
                    botId,
                    stock: { gt: 0 },
                    name: { contains: query, mode: 'insensitive' }
                },
                take: 5,
                select: { sku: true, name: true, variant: true, price: true, stock: true }
            })
            return products.length > 0
                ? products.map(p => ({
                    sku: p.sku,
                    name: p.name,
                    variant: p.variant,
                    price: Number(p.price),
                    stock: p.stock
                }))
                : { message: 'No in-stock products matched this query.' }
        }
    })

    const createOrder = tool({
        description: `
            Create a pending order once the customer has confirmed the specific item, quantity, and variant they want.

            IMPORTANT:
            - Before calling this tool, resolve the item via the searchProduct tool using the customer's description (name, color, variant). Never call createOrder with a product that hasn't been looked up first.
            - Never ask the customer for a SKU or product ID — that's an internal catalog field the customer cannot know. Resolve it yourself through searchProduct.
            - If searchProduct returns no match for something the customer wants, tell the customer that item isn't available. Do not call createOrder for unresolved items, and do not ask the customer to supply an identifier.
            - Only call createOrder after the customer has explicitly confirmed the item, variant, and quantity, and, if collected, delivery details. Do not create an order from an ambiguous or partial request.
            - For multiple different items in one order, call this tool once per item.
        `,
        inputSchema: z.object({
            sku: z.string(),
            productName: z.string(),
            variant: z.string().optional(),
            quantity: z.number().int().positive(),
            pricePerItem: z.number(),
            customerName: z.string().optional(),
            customerPhone: z.string().optional(),
            address: z.string().optional(),
        }),
        execute: async (
            { sku, productName, variant, quantity, pricePerItem, customerName, customerPhone, address },
            { experimental_context }
        ) => {
            const ctx = experimental_context as { botId: string; conversationId: string; customerId: string }
            const totalPrice = pricePerItem * quantity

            const order = await prisma.order.create({
                data: {
                    botId: ctx.botId,
                    conversationId: ctx.conversationId,
                    customerId: ctx.customerId,
                    items: [{ sku, name: productName, variant, qty: quantity, price: pricePerItem }],
                    totalPrice,
                    customerName,
                    customerPhone,
                    address,
                    status: 'PENDING_REVIEW',
                }
            })

            return { orderId: order.id, totalPrice, status: 'PENDING_REVIEW' }
        }
    })

    const { text } = await generateText({
        model,
        system: systemPrompt,
        messages: [
            ...history,
            { role: 'user', content: userMessage }
        ],
        tools: {
            searchProduct,
            ...(canTakeOrders && { createOrder }),
        },
        experimental_context: { botId, conversationId, customerId },
        stopWhen: stepCountIs(3),
        temperature: 0.3,
    })

    return text
}