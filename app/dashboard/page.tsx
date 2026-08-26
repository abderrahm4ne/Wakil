import { MessageSquare, Zap, Radio, SendHorizontal, ArrowUpRight } from 'lucide-react'
import { planChecking } from '../action/plan'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getDashboardData } from '@/lib/data/dashboard'
import { subscriptions } from '@/types/subscription'
import { Progress } from '@/components/ui/progress'

export default async function DashboardPage() {
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
        { id: 0, label: 'Messages this month', value: messagesUsed, icon: MessageSquare },
        { id: 1, label: 'Open conversations', value: analytics?.totalConversations ?? 0, icon: Radio },
        { id: 2, label: 'Orders pending review', value: pendingReview ?? 0, icon: SendHorizontal, alert: (pendingReview ?? 0) > 0 },
        { id: 3, label: 'Connected channels', value: `${channelsCount}/2`, icon: Zap },
    ]

    return (
        <div className='font-display flex flex-col relative'>

            {/* Welcoming */}
            <section className='flex flex-col space-y-3 relative'>
                <h1 className='sm:text-4xl text-3xl text-foreground tracking-tight font-bold'>
                    {isDay ? 'Good Morning' : 'Good Afternoon'}, {session.user.name}
                </h1>
                <div className='flex flex-row items-center space-x-3 ml-10'>
                    <span className='font-semibold text-muted-foreground text-xl px-3'>{planDisplayed} Plan</span>
                    <div className='w-0.5 h-6 bg-muted-foreground' />
                    <span className='flex items-center gap-2 font-semibold text-xl px-3'>
                        <span className={`relative flex h-2 w-2`}>
                            {botOn && (
                                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75' />
                            )}
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${botOn ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                        </span>
                        <span className={botOn ? 'text-foreground' : 'text-muted-foreground'}>
                            Bot {botOn ? 'active' : 'paused'}
                        </span>
                    </span>
                </div>
            </section>

            {/* Stats grid */}
            <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4  mt-15'>
                {stats.map(stat => (
                    <div
                        key={stat.id}
                        className={`group relative overflow-hidden bg-card border rounded-xl px-4 py-4 flex flex-col space-y-4 transition-colors
                            ${stat.alert ? 'border-orange-500/30' : 'border-border hover:border-secondary/30'}`}
                    >
                        <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl transition-opacity opacity-0 group-hover:opacity-100
                            ${stat.alert ? 'bg-orange-500/20' : 'bg-secondary/20'}`} />
                        <stat.icon className={`relative ${stat.alert ? 'text-orange-500' : 'text-secondary'}`} size={26} />
                        <h2 className='relative text-md text-muted-foreground font-medium'>{stat.label}</h2>
                        <h2 className='relative text-2xl font-bold'>{stat.value}</h2>
                        {stat.label === 'Messages this month' && !isUnlimited && (
                            <div className='relative space-y-1'>
                                <Progress value={percentage} className="h-1.5" />
                                <p className='text-xs text-muted-foreground'>{Math.round(percentage)}% of {maxMessages}</p>
                            </div>
                        )}
                        {stat.label === 'Messages this month' && isUnlimited && (
                            <span className='relative text-xs text-secondary font-medium'>Unlimited</span>
                        )}
                    </div>
                ))}
            </section>

            {/* Recent orders */}
            <section className='flex flex-row mt-15 w-full'>
                <div className='flex flex-col bg-linear-to-br from-secondary/10 to-green-600/5 border border-border rounded-xl w-full max-w-sm px-5 py-4'>
                    <div className='flex items-center justify-between mb-4'>
                        <h2 className='font-semibold'>Recent orders</h2>
                        <a href='/orders' className='flex items-center gap-1 text-xs text-secondary hover:underline'>
                            View all <ArrowUpRight size={12} />
                        </a>
                    </div>

                    {(!orders || orders.length === 0) ? (
                        <p className='text-muted-foreground text-sm py-6 text-center'>No recent orders yet</p>
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
                <div className='flex flex-col bg-card border border-border rounded-xl w-full max-w-sm px-5 py-4'>
                    <h2 className='font-semibold mb-4'>Channels</h2>
 
                    {channelsCount === 0 ? (
                        <div className='flex flex-col items-center justify-center py-6 gap-2 text-center'>
                            <p className='text-sm text-muted-foreground'>No channel connected yet</p>
                            <a href='/settings/channels' className='text-xs text-secondary hover:underline'>Connect Instagram or Facebook</a>
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
                                        {channel.isActive ? 'Connected' : 'Inactive'}
                                    </span>
                                </div>
                            ))}
                            {channelsCount < 2 && (
                                <a href='/settings/channels' className='flex items-center gap-1 text-xs text-secondary hover:underline pt-3'>
                                    <span>+ Connect another channel</span>
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}