import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { SubscriptionClient } from "@/components/dashboard/subscription-client"
import { subscriptions } from "@/types/subscription"
import getLang from '@/lib/locale'
import i18n from "@/lib/i18n-server"

export default async function SubscriptionPage() {
    const lang = await getLang()
    const t = i18n.getFixedT(lang, 'dashboard')
    const session = await auth()
    if (!session) redirect("/login")

    const subscription = await prisma.subscription.findUnique({
        where: { userId: session.user.id }
    })

    const bot = await prisma.bot.findUnique({
        where: { userId: session.user.id },
        include: { usageLogs: true, channels: true }
    })

    const now = new Date()
    const currentUsage = bot?.usageLogs.find(
        log => log.month === now.getMonth() + 1 && log.year === now.getFullYear()
    )

    const currentPlan = subscription?.plan ?? "FREE_TRIAL"
    const planConfig = subscriptions.find(
        p => p.name.toUpperCase() === currentPlan || (currentPlan === 'FREE_TRIAL' && p.name === 'FREE_TRIAL')
    )

    return (
        <div className={`${lang === 'ar' ? 'font-arabic' : 'font-display'} flex flex-col relative space-y-8`}>
            <div>
                <h1 className="sm:text-4xl text-[1.6rem] text-foreground tracking-tight font-semibold">
                    {t('subscription.title')}
                </h1>
                <p className="text-muted-foreground font-medium">{t('subscription.subtitle')}</p>
            </div>

            <SubscriptionClient
                currentPlan={currentPlan}
                isActive={subscription?.isActive ?? false}
                renewalDate={subscription?.currentPeriodEnd?.toISOString() ?? null}
                cancelScheduled={subscription?.endDate !== null && subscription?.endDate !== undefined}
                messagesUsed={currentUsage?.messageCount ?? 0}
                messageLimit={planConfig?.limit ?? null}
                productLimit={planConfig?.productLimit ?? null}
                billingMode={subscription?.billingMode ?? 'MONTHLY'}
            />
        </div>
    )
}