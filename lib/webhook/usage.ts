import { prisma } from '@/lib/prisma'
import { Plan } from "@/generated/prisma/enums"
import { subscriptions } from '@/types/subscription'

const LIMITS: Record<Plan, number | null> = {
    FREE_TRIAL: subscriptions[0].limit,
    STARTER: subscriptions[1].limit,
    PRO: subscriptions[2].limit,
    BUSINESS: subscriptions[3].limit
}

export async function checkUsage(botId: string, plan: Plan): Promise<boolean> {
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    const log = await prisma.usageLog.findUnique({
        where: { botId_month_year: { botId, month, year } }
    })

    const limit = LIMITS[plan]
    if (limit === null) return true
    if (!log) return true // no usage yet this month

    return log.messageCount < limit
}

export async function incrementUsage(botId: string): Promise<void> {
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    await prisma.$transaction(async (tx) => {
        await tx.usageLog.upsert({
            where: { botId_month_year: { botId, month, year } },
            update: {},
            create: { botId, month, year, messageCount: 0 }
        })

        await tx.$executeRaw`
            UPDATE "UsageLog" SET "messageCount" = "messageCount" + 1
            WHERE "botId" = ${botId} AND month = ${month} AND year = ${year}
        `
    })
}