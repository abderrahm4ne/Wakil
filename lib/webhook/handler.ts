import { prisma } from "../prisma";
import CheckAndIncrementUsage from "./usage";
import { matchRule } from "./rulesMatcher";
import { callLLM } from "./llm";
import { sendMetaReply } from "./messenger";
import { BotType, Language } from "@/generated/prisma/enums";

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
                    rules: true, // rules [] for ai-powered bots
                    user: {
                        include: { subscription: true }
                    }
                }
            }
        }
    })

    if (!channel || !channel.bot) return

    const bot = channel.bot
    const plan = bot.user.subscription?.plan ?? 'FREE_TRIAL'

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
    let matched
    if (bot.type === BotType.RULE_BASED) {
        matched = matchRule(bot.rules, message, bot.languages[0] as Language)
        reply = matched?.response ?? "Sorry, I didn't understand that."
    }
    
    if (bot.type === BotType.AI_POWERED) {
        reply = await callLLM(
        plan,
        bot.systemPrompt,
        message
        )
    }

    await sendMetaReply(senderId, reply, channel.accessToken)

    await prisma.message.create({
        data: {
            content: reply,
            fromCustomer: false,
            ruleId: matched?.id ?? null,
            conversationId: conversation.id
        }
    })
}