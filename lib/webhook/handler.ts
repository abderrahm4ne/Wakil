import { prisma } from "../prisma";
import { checkUsage, incrementUsage } from "./usage";
import { matchRule } from "./rulesMatcher";
import { callLLM } from "./llm";
import { sendMetaReply } from "./messenger";
import { BotType } from "@/generated/prisma/enums";
import { detectLanguage } from "./detectLanguage";
import { ModelMessage } from 'ai'

type MessageInput =
    | { type: 'text'; content: string; mid: string }
    | { type: 'postback'; content: string }

export async function handleMetaMessage(
    pageId: string,
    senderId: string,
    input: MessageInput
) {
    // Dedup only applies to text messages — postbacks don't carry Meta's mid the same way
    if (input.type === 'text') {
        const existing = await prisma.message.findUnique({ where: { metaMessageId: input.mid } })
        if (existing) return
    }

    const channel = await prisma.channel.findFirst({
        where: { pageId },
        include: { bot: { include: { rules: true, user: { include: { subscription: true } } } } }
    })

    if (!channel || !channel.bot) return

    const bot = channel.bot
    const plan = bot.user.subscription?.plan ?? 'FREE_TRIAL'

    if (!bot.isActive) return

    const conversation = await prisma.conversation.upsert({
        where: { botId_customerId: { botId: bot.id, customerId: senderId } },
        update: {},
        create: { botId: bot.id, customerId: senderId }
    })

    // ---- POSTBACK: customer tapped a menu button ----
    if (input.type === 'postback') {
        const node = await prisma.menuNode.findFirst({
            where: { id: input.content, botId: bot.id },
            include: { children: { orderBy: { order: 'asc' } } }
        })
        if (!node) return

        try {
            if (node.children.length > 0) {
                const sendResult = await sendMetaReply(
                    senderId,
                    node.responseText ?? node.label,
                    channel.accessToken,
                    { quickReplies: node.children.map(c => ({ title: c.label, payload: c.id })) }
                )
                if (!sendResult.success) {
                    console.error(`[handleMetaMessage] menu send failed bot ${bot.id}:`, sendResult.error)
                    if (sendResult.tokenExpired) {
                        await prisma.channel.update({ where: { id: channel.id }, data: { isActive: false } })
                        // TODO: Resend email to bot.user.email — "reconnect your Meta page"
                    }
                }
                return
            }

            switch (node.nodeType) {
                case 'CONFIRM':
                    await sendMetaReply(senderId, node.responseText ?? 'Confirmed.', channel.accessToken)
                    return
                case 'CALL_OWNER':
                    await sendMetaReply(
                        senderId,
                        `${node.responseText ?? ''} ${bot.storeContact}`.trim(),
                        channel.accessToken
                    )
                    return
                case 'FALLBACK':
                default:
                    // fall through to normal text handling below, using the node's label as the "message"
                    input = { type: 'text', content: node.label, mid: `postback-${node.id}-${Date.now()}` }
                    break
            }
        } catch (err) {
            console.error(`[handleMetaMessage] postback handling failed bot ${bot.id}:`, err)
            return
        }
    }

    // ---- TEXT: normal rule/AI flow ----
    if (input.type !== 'text') return // narrows type below, satisfies TS

    // First contact: if this conversation has no messages yet and the bot has
    // a configured root menu, greet with the menu instead of running rule/AI matching.
    const messageCount = await prisma.message.count({ where: { conversationId: conversation.id } })
    if (messageCount === 0) {
        const rootNodes = await prisma.menuNode.findMany({
            where: { botId: bot.id, parentId: null },
            orderBy: { order: 'asc' }
        })

        if (rootNodes.length > 0) {
            // still log the inbound message so it's not lost from history / dedup
            await prisma.message.create({
                data: {
                    content: input.content,
                    fromCustomer: true,
                    conversationId: conversation.id,
                    metaMessageId: input.mid
                }
            })

            const sendResult = await sendMetaReply(
                senderId,
                'How can I help you?',
                channel.accessToken,
                { quickReplies: rootNodes.map(n => ({ title: n.label, payload: n.id })) }
            )

            if (!sendResult.success) {
                console.error(`[handleMetaMessage] root menu send failed bot ${bot.id}:`, sendResult.error)
                if (sendResult.tokenExpired) {
                    await prisma.channel.update({ where: { id: channel.id }, data: { isActive: false } })
                    // TODO: Resend email to bot.user.email — "reconnect your Meta page"
                }
            }
            return
        }
    }

    const allowed = await checkUsage(bot.id, plan)
    if (!allowed) {
        await sendMetaReply(senderId, 'Sorry, service temporarily unavailable.', channel.accessToken)
        return
    }

    // messageCount === 0 case already saved+returned above, so this only runs
    // for conversations that already had at least one message
    await prisma.message.create({
        data: {
            content: input.content,
            fromCustomer: true,
            conversationId: conversation.id,
            metaMessageId: input.mid
        }
    })

    let reply = ''
    let matched
    try {
        const detectedLang = detectLanguage(input.content, bot.languages)

        if (bot.type === BotType.RULE_BASED) {
            matched = matchRule(bot.rules, input.content, detectedLang)
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

            reply = await callLLM(plan, bot.systemPrompt, input.content, history)
        }

        const sendResult = await sendMetaReply(senderId, reply, channel.accessToken)

        if (!sendResult.success) {
            console.error(`[handleMetaMessage] send failed bot ${bot.id}:`, sendResult.error)
            if (sendResult.tokenExpired) {
                await prisma.channel.update({ where: { id: channel.id }, data: { isActive: false } })
                // TODO: Resend email to bot.user.email — "reconnect your Meta page"
            }
            return // usage never incremented, nothing lost
        }

        await incrementUsage(bot.id)

        await prisma.message.create({
            data: {
                content: reply,
                fromCustomer: false,
                ruleId: matched?.id ?? null,
                conversationId: conversation.id
            }
        })
    } catch (err) {
        console.error(`[handleMetaMessage] reply failed for bot ${bot.id}:`, err)
    }
}