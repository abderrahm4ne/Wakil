import { MessageSquare, Zap, Radio, SendHorizontal, ArrowUpRight } from 'lucide-react'
import { planChecking } from '../action/plan'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getDashboardData } from '@/lib/data/dashboard'
import { subscriptions } from '@/types/subscription'
import { Progress } from '@/components/ui/progress'
import i18n from '@/lib/i18n-server'
import { cookies } from 'next/headers'

export default async function DashboardPage() {
    const cookieStore = await cookies()
    const locale = cookieStore.get('locale')?.value ?? 'fr'
    const t = i18n.getFixedT(locale, 'dashboard')

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
    console.log(subscriptions)


    const channelsCount = bot?.channels?.length ?? 0
    const botOn = session.user.isActive

    const stats = [
        { id: 0, label: t('overview.messagesThisMonth'), value: messagesUsed, icon: MessageSquare },
        { id: 1, label: t('overview.openConversation'), value: analytics?.totalConversations ?? 0, icon: Radio },
        { id: 2, label: t('overview.orderPendingReview'), value: pendingReview ?? 0, icon: SendHorizontal, alert: (pendingReview ?? 0) > 0 },
        { id: 3, label: t('overview.connectedChannels'), value: `${channelsCount}/2`, icon: Zap },
    ]

    return (
        <div className={`${locale === 'ar' ? 'font-arabic' : 'font-display'} flex flex-col relative`}>

            {/* Welcoming */}
            <section className='flex flex-col space-y-3 relative '>
                <h1 className='sm:text-4xl text-[1.6rem] text-foreground tracking-tight font-semibold'>
                    {isDay ? t('overview.goodmorning') : t('overview.goodafternoon')}, {session.user.name}
                </h1>
                <div className=' flex-row items-center space-x-5 font-medium hidden sm:flex'>
                    <span className='text-muted-foreground text-xl '>{planDisplayed} {t('overview.plan')}</span>
                    <div className='w-0.5 h-6 bg-muted-foreground' />
                    <span className='flex items-center gap-2 text-xl '>
                        <span className={`relative flex h-2 w-2`}>
                            {botOn && (
                                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75' />
                            )}
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${botOn ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                        </span>
                        <span className={botOn ? 'text-foreground' : 'text-muted-foreground'}>
                            {t('Bot')} {botOn ? t('overview.active') : t('overview.paused')}
                        </span>
                    </span>
                </div>
            </section>

            {/* Stats grid */}
            <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-15'>
                {stats.map(stat => (
                    <div
                        key={stat.id}
                        className={`group relative overflow-hidden bg-card border rounded-xl px-4 py-4 flex flex-col space-y-4 transition-colors
                            ${stat.alert ? 'border-orange-500/30' : 'border-border hover:border-secondary/30'}`}
                    >
                        <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl transition-opacity opacity-0 group-hover:opacity-100
                            ${stat.alert ? 'bg-orange-500/20' : 'bg-secondary/20'}`} />
                        <stat.icon className={`relative ${stat.alert ? 'text-orange-500' : 'text-secondary'}`} size={26} />
                        <h2 className='relative text-xl text-muted-foreground font-normal'>{stat.label}</h2>
                        <h2 className='relative text-2xl font-semibold'>{stat.value}</h2>
                        {stat.label === 'Messages this month' && !isUnlimited && (
                            <div className='relative space-y-1'>
                                <Progress value={percentage} className="h-1.5" />
                                <p className='text-xs text-muted-foreground font-italic'>{Math.round(percentage)}% of {maxMessages}</p>
                            </div>
                        )}
                        {stat.id === 0 && isUnlimited && (
                            <span className='relative text-xs text-secondary font-medium'>Unlimited</span>
                        )}
                    </div>
                ))}
            </section>

            {/* Recent orders && Channels */}
            <section  className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-15 justify-center space-x-10 '>

                <div className='flex flex-col bg-linear-to-br from-secondary/10 to-green-600/5 border border-border rounded-xl px-5 py-4  w-full'>
                    <div className='flex items-center justify-between mb-4'>
                        <h2 className='text-lg font-normal'>{t('overview.recentOrders')}</h2>
                        <a href='/dashboard/orders' className='flex items-center gap-1 text-md text-secondary font-normal tracking-wider hover:underline'>
                            {t('overview.viewAll')} <ArrowUpRight size={12} />
                        </a>
                    </div>

                    {(!orders || orders.length === 0) ? (
                        <p className='text-muted-foreground text-sm py-6 text-center font-semibold'>{t('overview.noRecentOrdersYet')}</p>
                    ) : (
                        <div className='flex flex-col divide-y divide-border'>
                            {orders.map(order => (
                                <div key={order.orderNumber} className='flex items-center gap-3 py-2.5'>
                                    <span className='text-xs font-mono text-muted-foreground w-8'>#{order.orderNumber}</span>
                                    <span className='font-medium text-sm truncate flex-1'>{order.customerName}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                        ${order.status === 'PENDING_REVIEW'
                                            ? 'bg-orange-400/15 text-orange-500'
                                            : 'bg-green-500/15 text-green-600'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className='flex flex-col bg-card border border-border rounded-xl px-5 py-4 w-full'>
                    <h2 className='font-normal text-lg mb-4'>{t('overview.Channels')}</h2>
 
                    {channelsCount === 0 ? (
                        <div className='flex flex-col items-center justify-center py-6 gap-2 text-center'>
                            <p className='text-sm text-muted-foreground font-semibold'>{t('overview.noChannelConnectedYet')}</p>
                            <a href='/dashboard/channels' className='text-xs text-secondary tracking-wide hover:underline font-normal'>{t('overview.connecteInstagramOrFacebook')}</a>
                        </div>
                    ) : (
                        <div className='flex flex-col divide-y divide-border'>
                            {bot?.channels?.map(channel => (
                                <div key={channel.id} className='flex items-center gap-3 py-2.5'>
                                    <span className={`w-2 h-2 rounded-full ${channel.isActive ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                                    <span className='text-sm font-medium flex-1'>
                                        {channel.type.charAt(0) + channel.type.slice(1).toLowerCase()}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                        ${channel.isActive ? 'bg-green-500/15 text-green-600' : 'bg-muted-foreground/15 text-muted-foreground'}`}>
                                        {channel.isActive ? t('overview.connected') : t('overview.inActive')}
                                    </span>
                                </div>
                            ))}
                            {channelsCount < 2 && (
                                <a href='/settings/channels' className='flex items-center gap-1 text-xs text-secondary hover:underline pt-3 font-normal'>
                                    <span>{t('overview.connectAnotherChannel')}</span>
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Shop and merchant informations */}
            <div className='flex flex-col bg-linear-to-br from-red-600/10 to-green-600/5 border border-border rounded-xl px-5 py-4 w-full mt-15'>
                    <div className='flex items-center justify-between mb-4 font-normal'>
                        <h2 className=''>{t('overview.storeInformations')}</h2>
                        <a href='/orders' className='flex items-center gap-1 text-xs text-secondary hover:underline'>
                            {t('overview.botConfiguration')} <ArrowUpRight size={15} />
                        </a>
                    </div>

                    {(!bot || bot.isActive === false) ? (
                        <p className='text-muted-foreground text-sm py-6 text-center font-normal'>{t('overview.botIs')}<span className='text-red-600 px-2'>OFF</span></p>
                    ) : (
                        <div className='flex flex-col divide-y divide-border text-xl font-medium'>
                            <h2>{t('overview.storeName')} : {bot.storeName}</h2>
                            <h2>{t('overview.storeLocation')} : {bot.storeCity}</h2>
                            <h2>{t('overview.storeContact')} : {bot.storeContact}</h2>
                        </div>
                    )}
            </div>

        </div>
    )
}