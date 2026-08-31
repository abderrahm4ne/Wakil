import { prisma } from '@/lib/prisma'

export async function OneTimePayement(
    userId: string, 
    plan: 'STARTER' | 'PRO' | 'BUSINESS', 
    providerCustomerId: string, 
    endDate: Date, 
    startDate: Date
) {
    // console.log("inside sub creating sub.ts")
    
    return prisma.subscription.update({
        where: { userId },
        data: {
            plan,
            isActive: true,
            startDate,
            currentPeriodEnd: endDate,
            provider: 'STRIPE',
            providerCustomerId,
            providerSubscriptionId: null,
            billingMode: 'ONE_TIME'
        }
    })
}

export async function activateSubscription(
    userId: string, 
    plan: 'STARTER' | 'PRO' | 'BUSINESS', 
    providerSubscriptionId: string,
    providerCustomerId: string, 
    endDate: Date, 
    startDate: Date
) {
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
        plan?: string
    }
) {
    const updateData: any = {
        currentPeriodEnd: data.currentPeriodEnd,
        isActive: data.status === 'active' || data.status === 'trialing',
        endDate: data.cancelAtPeriodEnd ? data.currentPeriodEnd : null,
    }
    
    if (data.plan) updateData.plan = data.plan
    
    return prisma.subscription.update({
        where: { providerSubscriptionId },
        data: updateData
    })
}