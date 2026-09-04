import { prisma } from '@/lib/prisma'
import ResposneTimeCalculator from '@/lib/data/analyticsLib/response-time'
import unAnsweredConversationsCalculator from '@/lib/data/analyticsLib/unanswered-conversations'
import averageMessagesPerConversationsCalculator from '@/lib/data/analyticsLib/message-per-conversation'
import conversationsPerDayCalculator from '@/lib/data/analyticsLib/conversations-per-day'

export async function getAnalyticsData(botId: string) {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const [convertedConversations, funnelRaw, messages, tokenUsage, conversations] =
    await Promise.all([
      prisma.conversation.count({
        where: { botId, createdAt: { gte: monthStart }, order: { some: {} } }
      }),
      prisma.order.groupBy({
        by: ['status'],
        where: { botId, createdAt: { gte: monthStart } },
        _count: { _all: true }
      }),
      prisma.message.findMany({
        where: { conversation: { botId }, createdAt: { gte: monthStart } },
        select: { conversationId: true, fromCustomer: true, createdAt: true },
        orderBy: [{ conversationId: 'asc' }, { createdAt: 'asc' }]
      }),
      prisma.message.aggregate({
        where: { conversation: { botId }, createdAt: { gte: monthStart } },
        _sum: { tokensUsed: true }
      }),
      prisma.conversation.findMany({
        where: { botId, createdAt: { gte: monthStart } },
        select: { createdAt: true }
      })
    ])

  // totalConversations: conversations OPENED this month.

  const totalConversations = conversations.length

  const [avgResponseMs, hourCounts] = await ResposneTimeCalculator(messages)

  // funnel data
  const funnel = { PENDING: 0, PENDING_REVIEW: 0, CONFIRMED: 0, CANCELLED: 0 }
  for (const f of funnelRaw) funnel[f.status as keyof typeof funnel] = f._count._all

  // token used
  const tokenUsed = tokenUsage._sum.tokensUsed || 0

  // last message by user
  const unAnsweredConversations = await unAnsweredConversationsCalculator(messages)

  // Average messages per conversation: scoped to conversations that had
  const activeConversationCount = new Set(messages.map(m => m.conversationId)).size
  const averageMessagesPerConversation = Number(
    (await averageMessagesPerConversationsCalculator(messages, activeConversationCount)).toFixed(1)
  )

  // conversation opened per day
  const conversationTrend = await conversationsPerDayCalculator(conversations, monthStart, now)

  // Return the analytics data
  return {
    conversionRate: totalConversations ? (convertedConversations / totalConversations) * 100 : 0,
    totalConversations,
    convertedConversations,
    funnel,
    avgResponseMs,
    peakHours: hourCounts,
    tokenUsed,
    unAnsweredConversations,
    averageMessagesPerConversation,
    conversationTrend
  }
}