import { prisma } from '@/lib/prisma'
import { Plan } from "@/generated/prisma/enums"

const LIMITS: Record<Plan, number | null> = {
    FREE_TRIAL: 500,
    STARTER: 2000,
    PRO: 10000,
    BUSINESS: null
}

export default async function CheckAndIncrementUsage(botId: string, plan: Plan): Promise<boolean> {
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    return await prisma.$transaction(async (tx) => {
        await tx.usageLog.upsert({
            where: { botId_month_year: { botId, month, year } },
            update: {},
            create: { botId, month, year, messageCount: 0 }
        })

        const log = await tx.$queryRaw<{ id: string; messageCount: number }[]>`
            SELECT id, "messageCount" FROM "UsageLog"
            WHERE "botId" = ${botId} AND month = ${month} AND year = ${year}
            FOR UPDATE
        `

        const current = log[0]
        const limit = LIMITS[plan]

        if (limit !== null && current.messageCount >= limit) {
            return false
        }

        await tx.usageLog.update({
            where: { id: current.id },
            data: { messageCount: { increment: 1 } }
        })

        return true
    })
}