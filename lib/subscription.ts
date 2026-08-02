import { prisma } from '@/lib/prisma'

export async function activateSubscription(userId: string, plan: 'STARTER' | 'PRO' | 'BUSINESS') {
    const start = new Date()
    const currentPeriodEnd = new Date(start)
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)

    return prisma.subscription.update({
        where: { userId },
        data: {
            plan,
            isActive: true,
            startDate: start,
            currentPeriodEnd,
        }
    })
}