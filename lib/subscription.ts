import { prisma } from '@/lib/prisma'

export async function activateSubscription(userId: string, plan: 'STARTER' | 'PRO' | 'BUSINESS', providerSubscriptionId: string, providerCustomerId: string, endDate: Date, startDate: Date) {
    // console.log("subscription activatio nreached !!!!! ")

    return prisma.subscription.update({
        where: { userId },
        data: {
            plan,
            isActive: true,
            startDate,
            currentPeriodEnd: endDate,
            provider: 'STRIPE',
            providerSubscriptionId,
            providerCustomerId
        }
    })
}

export async function syncSubscriptionPeriod(
    providerSubscriptionId: string,
    data: {
        currentPeriodEnd: Date
        currentPeriodStart: Date
        cancelAtPeriodEnd: boolean
        status: string
    }
) {
    return prisma.subscription.update({
        where: { providerSubscriptionId },
        data: {
            currentPeriodEnd: data.currentPeriodEnd,
            startDate: data.currentPeriodStart,
            isActive: data.status === 'active' || data.status === 'trialing',
            endDate: data.cancelAtPeriodEnd ? data.currentPeriodEnd : null,
        }
    })
}