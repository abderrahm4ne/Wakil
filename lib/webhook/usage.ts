import { prisma } from '@/lib/prisma'
import { Plan } from "@/generated/prisma/enums";

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

    // create log for this month
    const log = await prisma.usageLog.upsert({
        where: { botId_month_year: { botId, month, year } },
        update: {},
        create: { botId, month, year, messageCount: 0 }
    })

    const limit = LIMITS[plan]
    if (limit == null) {
        await prisma.usageLog.update({
            where : { id: log.id },
            data: { messageCount: log.messageCount + 1 }
        })
        return true
    }

    if (log.messageCount >= limit) return false

    // increment
    await prisma.usageLog.update({
        where: { id: log.id },
        data: { messageCount: { increment: 1 } }
    })
    
    return true
}