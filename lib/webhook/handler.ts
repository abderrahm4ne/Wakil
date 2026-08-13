import { prisma } from "../prisma";
import { checkUsage, incrementUsage } from "./usage";
import { matchRule } from "./rulesMatcher";
import { callLLM } from "./llm";
import { sendMetaReply } from "./messenger";
import { BotType, Language } from "@/generated/prisma/enums";
import { detectLanguage } from "./detectLanguage";
import { ModelMessage } from 'ai'

export async function handleMetaMessage(
    pageId: string,
    senderId: string,
    message: string,
    mid: string
) {

    const existing = await prisma.message.findUnique({ where: { metaMessageId: mid } })
    if (existing) return

    // Find channel by PageId
    const channel = await prisma.channel.findFirst({
        where: { pageId },
        include: { bot: { include: { rules: true, user: { include: { subscription: true } } } } }
    })  

    if (!channel || !channel.bot) return

    const bot = channel.bot
    const plan = bot.user.subscription?.plan ?? 'FREE_TRIAL'

    if(!bot.isActive) return

    const allowed = await checkUsage(bot.id, plan)
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
        conversationId: conversation.id,
        metaMessageId: mid
        }
    })

    let reply = ''
    let matched
    try {
        const detectedLang = detectLanguage(message, bot.languages)
            if (bot.type === BotType.RULE_BASED) {
                matched = matchRule(bot.rules, message, detectedLang)
                reply = matched?.response ?? "Sorry, I didn't understand that."
            } else {
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
            reply = await callLLM(plan, bot.systemPrompt, message, history)
        }

        const sendResult = await sendMetaReply(senderId, reply, channel.accessToken)

        if (!sendResult.success) {
            console.error(`[handleMetaMessage] send failed bot ${bot.id}:`, sendResult.error)

            if (sendResult.tokenExpired) {
                await prisma.channel.update({
                    where: { id: channel.id },
                    data: { isActive: false }
                })
                // to-do: Resend email to bot.user.email — "reconnect your Meta page"
            }
            return // usage never incremented, nothing lost
        }
        await incrementUsage(bot.id)

        await prisma.message.create({
            data: { content: reply, fromCustomer: false, 
                ruleId: matched?.id ?? null, 
                conversationId: conversation.id }
        })
    } catch (err) {
        console.error(`[handleMetaMessage] reply failed for bot ${bot.id}:`, err)
    }
}