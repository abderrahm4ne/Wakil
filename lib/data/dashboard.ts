import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function getDashboardData() {
    const session = await auth()
    if (!session?.user?.id) return { analytics: null, bot: null }

    const bot = await prisma.bot.findUnique({
        where: { userId: session.user.id },
        include: { channels: true }
    })
    const subscription = await prisma.subscription.findFirst({
        where: {userId: session.user.id}
    })

    if (!bot) return { analytics: null, bot: null, subscription}

    const now = new Date()
    const [usage, totalConversations, topTriggers] = await Promise.all([
        prisma.usageLog.findUnique({
            where: {
                botId_month_year: {
                    botId: bot.id,
                    month: now.getMonth() + 1,
                    year: now.getFullYear()
                }
            }
        }),
        prisma.conversation.count({ where: { botId: bot.id } }),
        prisma.rule.findMany({
            where: { botId: bot.id },
            include: { _count: { select: { messages: true } } },
            orderBy: { messages: { _count: 'desc' } },
            take: 5
        })
    ])

    return {
        bot,
        analytics: {
            messagesThisMonth: usage?.messageCount ?? 0,
            totalConversations,
            topTriggers: topTriggers.map(r => ({
                trigger: r.trigger,
                count: r._count.messages
            }))
        },
        subscription
    }
}