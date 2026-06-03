import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { SubscriptionClient } from "@/components/dashboard/subscription-client"

export default async function SubscriptionPage() {
    const session = await auth()
    if (!session) redirect("/login")

    const subscription = await prisma.subscription.findUnique({
        where: { userId: session.user.id }
    })

    const currentPlan = subscription?.plan ?? "FREE_TRIAL"

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Subscription Management</h1>
                <p className="text-slate-400">Manage your plan, billing, and upgrade options</p>
            </div>

            <SubscriptionClient
                currentPlan={currentPlan}
                isActive={subscription?.isActive ?? false}
                renewalDate={subscription?.endDate?.toISOString() ?? null}
            />
        </div>
    )
}