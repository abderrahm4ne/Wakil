"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Plan } from "@/generated/prisma/client"

const PLAN_MAP: Record<string, Plan> = {
    Starter: "STARTER",
    Pro: "PRO",
    Business: "BUSINESS",
}

export async function createSubscriptionForCurrentUser(planLabel: string) {
    const session = await auth()
    if (!session?.user?.id) {
        return { success: false, error: "UNAUTHENTICATED" }
    }

    const plan = PLAN_MAP[planLabel]
    if (!plan) {
        return { success: false, error: "INVALID_PLAN" }
    }

    const existing = await prisma.subscription.findUnique({
        where: { userId: session.user.id }
    })
    if (existing) {
        return { success: true }
    }

    await prisma.subscription.create({
        data: {
            userId: session.user.id,
            plan,
            isActive: plan === "FREE_TRIAL" ? true : false,
        }
    })

    return { success: true }
}