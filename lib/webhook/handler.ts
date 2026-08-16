import { prisma } from "../prisma";
import { checkUsage, incrementUsage } from "./usage";
import { callLLM } from "./llm";
import { sendMetaReply } from "./messenger";
import { ModelMessage } from 'ai'

export async function handleMetaMessage(
    pageId: string,
    senderId: string,
    text: string,
    mid: string
) {
    const existing = await prisma.message.findUnique({ where: { metaMessageId: mid } })
    if (existing) return

    const channel = await prisma.channel.findFirst({
        where: { pageId },
        include: { bot: { include: { user: { include: { subscription: true } } } } }
    })

    if (!channel || !channel.bot) return

    const bot = channel.bot
    const plan = bot.user.subscription?.plan ?? 'FREE_TRIAL'

    if (!bot.isActive) return

    const allowed = await checkUsage(bot.id, plan)
    if (!allowed) {
        await sendMetaReply(senderId, 'Sorry, service temporarily unavailable.', channel.accessToken)
        return
    }

    const conversation = await prisma.conversation.upsert({
        where: { botId_customerId: { botId: bot.id, customerId: senderId } },
        update: {},
        create: { botId: bot.id, customerId: senderId }
    })

    await prisma.message.create({
        data: {
            content: text,
            fromCustomer: true,
            conversationId: conversation.id,
            metaMessageId: mid
        }
    })

    try {
        const pastMessages = await prisma.message.findMany({
            where: { conversationId: conversation.id },
            orderBy: { createdAt: 'desc' },
            take: 10
        })

        const history: ModelMessage[] = pastMessages
            .reverse()
            .map(m => ({
                role: m.fromCustomer ? 'user' : 'assistant',
                content: m.content
            }))

        const reply = await callLLM(plan, bot.systemPrompt, text, history)

        const sendResult = await sendMetaReply(senderId, reply, channel.accessToken)

        if (!sendResult.success) {
            console.error(`[handleMetaMessage] send failed bot ${bot.id}:`, sendResult.error)
            if (sendResult.tokenExpired) {
                await prisma.channel.update({ where: { id: channel.id }, data: { isActive: false } })
                // TODO: Resend email to bot.user.email
            }
            return
        }

        await incrementUsage(bot.id)

        await prisma.message.create({
            data: {
                content: reply,
                fromCustomer: false,
                conversationId: conversation.id
            }
        })
    } catch (err) {
        console.error(`[handleMetaMessage] reply failed for bot ${bot.id}:`, err)
    }
}