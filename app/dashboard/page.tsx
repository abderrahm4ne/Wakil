import { planChecking } from '../action/plan'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getDashboardData } from '@/lib/data/dashboard'
import { subscriptions } from '@/types/subscription'
import i18n from '@/lib/i18n-server'
import getLang from '@/lib/locale'
import { StatsGrid } from '@/components/dashboard/overview-stats-grid'
import { OrdersChannelsGrid } from '@/components/dashboard/overview-orders-channels-grid'
import { StoreInfoCard } from '@/components/dashboard/overview-store-info-grid'
import WelcomingOverView from '@/components/dashboard/overview-welcoming'

export default async function DashboardPage() {
    const lang = await getLang()
    const t = i18n.getFixedT(lang, 'dashboard')

    const session = await auth()
    if (!session) redirect("/login")

    const hasPlan = await planChecking(session.user.id)
    if (!hasPlan) redirect('/onboarding/plan-selection')

    const { analytics, bot, subscription, pendingReview, orders } = await getDashboardData()

    const planDisplayed = subscription?.plan
        ? subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1).toLowerCase()
        : ""

    const isDay = new Date().getHours() < 12

    const currentPlan = subscriptions.find(sub => (sub.name.toUpperCase() === subscription?.plan) || (sub.name === 'FREE_TRIAL'))
    const maxMessages = currentPlan?.limit ?? null
    const isUnlimited = maxMessages === null
    const messagesUsed = analytics?.messagesThisMonth ?? 0
    const percentage = isUnlimited ? 0 : Math.min((messagesUsed / maxMessages) * 100, 100)
    // console.log(subscriptions)


    const channelsCount = bot?.channels?.length ?? 0
    const botOn = session.user.isActive

    const stats = [
    { id: 0, label: t('overview.messagesThisMonth'), value: messagesUsed, icon: 'messages' as const },
    { id: 1, label: t('overview.openConversation'), value: analytics?.totalConversations ?? 0, icon: 'conversations' as const },
    { id: 2, label: t('overview.orderPendingReview'), value: pendingReview ?? 0, icon: 'orders' as const, alert: (pendingReview ?? 0) > 0 },
    { id: 3, label: t('overview.connectedChannels'), value: `${channelsCount}/2`, icon: 'channels' as const },
    ]
    return (
        <div className={`${lang === 'ar' ? 'font-arabic' : 'font-display'} flex flex-col relative`}>

            {/* Welcoming */}
            <WelcomingOverView isDay={isDay} username={session.user.name} planDisplayed={planDisplayed} botOn={botOn} />

            {/* Stats grid */}
            <StatsGrid stats={stats} isUnlimited={isUnlimited} percentage={percentage} maxMessages={maxMessages} />

            {/* Recent orders && Channels */}
            <OrdersChannelsGrid
                orders={orders?.map(order => ({
                    ...order,
                    customerName: order.customerName ?? '',
                }))}
                channelsCount={channelsCount}
                channels={bot?.channels}
            />

            {/* Shop and merchant informations */}
            <StoreInfoCard
                bot={bot
                    ? {
                        isActive: bot.isActive,
                        storeName: bot.storeName ?? '',
                        storeCity: bot.storeCity ?? '',
                        storeContact: bot.storeContact ?? '',
                    }
                    : null}
            />

        </div>
    )
}