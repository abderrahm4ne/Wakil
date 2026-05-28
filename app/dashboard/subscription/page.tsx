import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { SubscriptionClient } from "@/components/dashboard/subscription-client"

const PLAN_LIMITS: Record<string, number> = {
    FREE_TRIAL: 500,
    STARTER: 2000,
    PRO: 10000,
    BUSINESS: 1000000,
}

export default async function SubscriptionPage() {
    const session = await auth()
    if (!session) redirect("/login")

    const [subscription, bot] = await Promise.all([
        prisma.subscription.findUnique({ where: { userId: session.user.id } }),
        prisma.bot.findUnique({ where: { userId: session.user.id } }),
    ])

    const currentPlan = subscription?.plan ?? "FREE_TRIAL"
    const messagesLimit = PLAN_LIMITS[currentPlan]

    // Get current month usage from UsageLog
    const now = new Date()
    const usageLog = bot ? await prisma.usageLog.findUnique({
        where: {
            botId_month_year: {
                botId: bot.id,
                month: now.getMonth() + 1,
                year: now.getFullYear(),
            }
        }
    }) : null

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Subscription Management</h1>
                <p className="text-slate-400">Manage your plan, billing, and upgrade options</p>
            </div>

            <SubscriptionClient
                currentPlan={currentPlan}
                isActive={subscription?.isActive ?? false}
                messagesUsed={usageLog?.messageCount ?? 0}
                messagesLimit={messagesLimit}
                renewalDate={subscription?.endDate?.toISOString() ?? null}
            />
        </div>
    )
}