import { prisma } from "../prisma";
import CheckAndIncrementUsage from "./usage";
import { matchRule } from "./rulesMatcher";
import { callLLM } from "./llm";
import { sendMetaReply } from "./messenger";
import { BotType, Language } from "@prisma/client";

export async function handleMetaMessage(
    pageId: string,
    senderId: string,
    message: string
) {
    // Find channel by PageId
    const channel = await prisma.channel.findFirst({
        where: { pageId },
        include: {
            bot: {
                include: {
                    rules: true,
                    user: {
                        include: { subscribtion: true }
                    }
                }
            }
        }
    })

    if (!channel || !channel.bot) return

    const bot = channel.bot
    const plan = bot.user.subscription?.plan ?? 'FREE_TRIAL'

    const SYSTEM_PROMPT = `You are an automated customer support assistant for {businessName}, powered by Wakil.

    You communicate in Arabic, French, and Darija. Always reply in the same language the customer uses.

    Your responsibilities:
    - Answer frequently asked questions about products, pricing, availability, shipping, and returns
    - Take orders by collecting: product name, size/variant, full address, and phone number
    - Handle order status inquiries when the customer provides their order ID
    - Recommend products based on the customer's query

    Business information:
    - Business name: {businessName}
    - Location: {city}, Algeria
    - Contact: {contactInfo}
    - {additionalInfo}

    Rules:
    - Be concise, polite, and professional
    - Never invent information you were not given
    - If a question is outside your knowledge, say: "For more details please contact us directly at {contactInfo}"
    - Do not discuss anything unrelated to {businessName}`

    if(!bot.isActive) return

    const allowed = await CheckAndIncrementUsage(bot.id, plan)
    if(!allowed) {
        await sendMetaReply(
            senderId,
            'Sorry Service termporarily unavailable.',
            channel.accessToken
        )
        return
    }

    const conversation = await prisma.conversation.upsert({
        where: { botId_customerId: { botId: bot.id, customerId: senderId } },
        update: {},
        create: { botId: bot.id, customerId: senderId }
    })

    await prisma.message.create({
        data: {
        content: message,
        fromCustomer: true,
        conversationId: conversation.id
        }
    })

    let reply = ''

    if (bot.type === BotType.RULE_BASED) {
        const matched = matchRule(bot.rules, message, bot.languages[0] as Language)
        reply = matched ?? "Sorry, I didn't understand that."
    }
    
    if (bot.type === BotType.AI_POWERED) {
        reply = await callLLM(
        plan,
        bot.systemPrompt ?? 'You are a helpful assistant.',
        message
        )
    }

    await sendMetaReply(senderId, reply, channel.accessToken)

    await prisma.message.create({
        data: {
        content: reply,
        fromCustomer: false,
        conversationId: conversation.id
        }
    })
}