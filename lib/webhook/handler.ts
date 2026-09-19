import { prisma } from "../prisma";
import { checkUsage, incrementUsage } from "./usage";
import { callLLM } from "./llm";
import { sendMetaReply } from "./messenger";
import { ModelMessage } from 'ai'
import { MediaType } from "@/generated/prisma/enums";

type MetaMessageInput = {
  pageId: string
  senderId: string
  text: string | null
  metaMessageId: string
  mediaType: MediaType
  mediaUrl: string | null
}

export async function handleMetaMessage(
    { pageId,
      senderId,
      text,
      metaMessageId,
      mediaType,
      mediaUrl 
    }: MetaMessageInput
) { 
    try {
        const existing = await prisma.message.findUnique({ where: { metaMessageId} })
        if (existing) return

        const channel = await prisma.channel.findFirst({
            where: { pageId },
            include: { bot: { 
                include: { 
                    user: { 
                        include: { 
                            subscription: true 
                        } 
                    } 
                } 
            } 
        }
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

        let processedText = text
        let transcriptText: string | null = null
        let imageAnalysis: string | null = null
        let modelUsed: string | null = null

        if (mediaType === MediaType.VOICE && mediaUrl) {

            // to be done
        }

        if (mediaType === MediaType.IMAGE && mediaUrl) {

           // to be done
        }

        if (mediaType === MediaType.MIXED && mediaUrl) {

            if (text) {
                // to be done
            }
        }

        if (!processedText) {
            return
        }

        const { conversation, message } = await prisma.$transaction(async (tx) => {
            const conversation = await tx.conversation.upsert({
                where: { botId_customerId: { botId: bot.id, 
                    customerId: senderId } },
                update: {},
                create: { botId: bot.id, customerId: senderId }
            })

            const message = await tx.message.create({
                data: {
                    content: processedText,
                    fromCustomer: true,
                    conversationId: conversation.id,
                    metaMessageId,
                    mediaType,
                    transcriptText,
                    imageAnalysis,
                    modelUsed
                }
            })

            return { conversation, message }
        })
        
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

        const reply = await callLLM(bot.id, plan, bot.systemPrompt, processedText, history, conversation.id, senderId)

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
        console.error(`[handleMetaMessage] reply failed for bot `, err)
    }
}