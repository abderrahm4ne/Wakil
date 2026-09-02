import { prisma } from '@/lib/prisma'

export async function getAnalyticsData(botId: string) {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const [totalConversations, convertedConversations, orderValueAgg, funnelRaw, messages] =
    await Promise.all([
      prisma.conversation.count({ where: { botId, createdAt: { gte: monthStart } } }),
      prisma.conversation.count({
        where: { botId, createdAt: { gte: monthStart }, order: { some: {} } }
      }),
      prisma.order.aggregate({
        where: { botId, status: 'CONFIRMED', createdAt: { gte: monthStart } },
        _sum: { totalPrice: true }
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
      })
    ])

  // response time + peak hours — computed in JS from raw message rows.
  // Fine at current volume. Move to $queryRaw/rollup table once message count grows.
  const responseTimes: number[] = []
  const hourCounts = new Array(24).fill(0)
  let lastCustomerMsgTime: Date | null = null
  let lastConvId: string | null = null

  for (const m of messages) {
    hourCounts[m.createdAt.getHours()]++ // server TZ — see note below

    if (m.conversationId !== lastConvId) {
      lastCustomerMsgTime = null
      lastConvId = m.conversationId
    }

    if (m.fromCustomer) {
      lastCustomerMsgTime = m.createdAt
    } else if (lastCustomerMsgTime) {
      const diffMs = m.createdAt.getTime() - lastCustomerMsgTime.getTime()
      if (diffMs > 0 && diffMs < 1000 * 60 * 30) responseTimes.push(diffMs) // ignore >30min gaps
      lastCustomerMsgTime = null
    }
  }

  const avgResponseMs = responseTimes.length
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    : null

  const funnel = { PENDING: 0, PENDING_REVIEW: 0, CONFIRMED: 0, CANCELLED: 0 }
  for (const f of funnelRaw) funnel[f.status as keyof typeof funnel] = f._count._all

  return {
    conversionRate: totalConversations ? (convertedConversations / totalConversations) * 100 : 0,
    totalConversations,
    convertedConversations,
    orderValueThisMonth: Number(orderValueAgg._sum.totalPrice ?? 0),
    funnel,
    avgResponseMs,
    peakHours: hourCounts
  }
}