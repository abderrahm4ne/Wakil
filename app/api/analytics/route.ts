import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Plan } from '@prisma/client'

const LIMITS: Record<Plan, number | null> = {
    FREE_TRIAL: 500,
    STARTER: 2000,
    PRO: 10000,
    BUSINESS: null
}

export async function GET() {
    try {
        const session = await auth()
        if (!session) return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED' }, { status: 401 }
        )

        const bot = await prisma.bot.findUnique({
            where: { userId: session.user.id }
        })
        if (!bot) return NextResponse.json(
            { success: false, error: 'BOT_NOT_FOUND' }, { status: 404 }
        )

        const subscription = await prisma.subscription.findUnique({
        where: { userId: session.user.id }
        })

        const now = new Date()
        const month = now.getMonth() + 1
        const year = now.getFullYear()

        // Messages this month
        const usageLog = await prisma.usageLog.findFirst({
            where: { botId: bot.id, month, year }
        })

        // Total conversations
        const totalConversations = await prisma.conversation.count({
            where: { botId: bot.id }
        })

        // Total messages
        const totalMessages = await prisma.message.count({
        where: {
            conversation: { botId: bot.id },
            fromCustomer: false
        }
        })

        // Last 7 days daily messages
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const dailyMessages = await prisma.message.groupBy({
        by: ['createdAt'],
        where: {
            conversation: { botId: bot.id },
            fromCustomer: false,
            createdAt: { gte: sevenDaysAgo }
        },
        _count: { id: true }
        })

        // Top triggered rules (rule-based only)
        let topTriggers: { trigger: string; count: number }[] = []
        if (bot.type === 'RULE_BASED') {
        const ruleCounts = await prisma.message.groupBy({
            by: ['ruleId'],
                where: {
                conversation: { botId: bot.id },
                fromCustomer: false,
                ruleId: { not: null }
            },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 5
        })

        const ruleIds = ruleCounts
            .map((r: any) => r.ruleId)
            .filter(Boolean) as string[]

        const rules = await prisma.rule.findMany({
            where: { id: { in: ruleIds } },
            select: { id: true, trigger: true }
        })

        topTriggers = ruleCounts.map((r: any) => {
            const rule = rules.find((rl: any) => rl.id === r.ruleId)
            return {
                trigger: rule?.trigger ?? 'Unknown',
                count: r._count.id
            }
        })
        }

        return NextResponse.json({
        success: true,
        data: {
            totalMessages,
            totalConversations,
            messagesThisMonth: usageLog?.messageCount ?? 0,
            messageLimit: LIMITS[(subscription?.plan ?? 'FREE_TRIAL') as Plan],
            topTriggers,
            dailyMessages: dailyMessages.map((d: any) => ({
            date: d.createdAt,
            count: d._count.id
            }))
        }
        })

    } catch (err) {
        console.error(err)
        return NextResponse.json(
        { success: false, error: 'SERVER_ERROR' }, { status: 500 }
        )
    }
}