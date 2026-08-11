import { Card } from '@/components/ui/card'
import { BarChart3, Bot, MessageSquare, Zap, Check, X, CreditCard } from 'lucide-react'
import { planChecking } from '../action/plan'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getDashboardData } from '@/lib/data/dashboard'

export default async function DashboardPage() {
    const session = await auth()
    console.log(session)
    if(!session) redirect("/login")
    const hasPlan = await planChecking(session?.user.id)
    if(!hasPlan){
        redirect('/onboarding/plan-selection')
    }

    const { analytics, bot, subscription } = await getDashboardData()
    // console.log(subscription)
    const planDisplayed =
         subscription?.plan
        ? subscription.plan.charAt(0).toUpperCase() +
        subscription.plan.slice(1).toLowerCase()
        : "";

    const stats = [
        {
            label: 'Plan',
            value: planDisplayed,
            icon: CreditCard
        },
        {
            label: 'Bot Alive',
            value: bot ? <Check className='text-emerald-400' size={34}/> : <X className='text-red-500' size={34}/>,
            icon: Bot,
        },
        {
            label: 'Messages This Month',
            value: analytics?.messagesThisMonth?.toLocaleString() ?? '0',
            icon: MessageSquare,
        },
        {
            label: 'Active Channels',
            value: bot?.channels?.length ?? 0,
            icon: Zap,
        },
        {
            label: 'Total Conversations',
            value: analytics?.totalConversations?.toLocaleString() ?? '0',
            icon: BarChart3,
        }
    ]

    return (
        <div className="space-y-8 p-6 font-display">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-3xl font-bold text-foreground">Overview</h1>
            <p className="mt-2 text-sm text-muted-foreground">
                Welcome back! Here&apos;s what&apos;s happening with your bot today.
            </p>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.label} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                {stat.label}
                            </p>
                            <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
                        </div>
                        <stat.icon className="h-8 w-8 text-primary/50" />
                    </div>
                </Card>
            ))}
        </div>

        {/* Activity && Bot Info */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground">Top Triggers</h2>
                <div className="mt-6 space-y-4">
                {analytics && analytics.topTriggers && analytics.topTriggers.length > 0 ? (
                    analytics.topTriggers.map((trigger: any, index: number) => (
                        <div
                        key={index}
                        className="flex items-center justify-between border-b border-border pb-4 last:border-0"
                        >
                        <div>
                            <p className="font-medium text-foreground">{trigger.trigger}</p>
                            <p className="text-sm text-muted-foreground">
                            Triggered {trigger.count} times
                            </p>
                        </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground italic">No triggers recorded yet.</p>
                )}
                </div>
            </Card>

            <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground">Bot Status</h2>
                <div className="mt-6 space-y-4">
                    {bot ? (
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Name:</span>
                                <span className="text-sm font-medium">{bot.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Type:</span>
                                <span className="text-sm font-medium">{bot.type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Status:</span>
                                <span className={`text-sm font-medium ${bot.isActive ? 'text-green-500' : 'text-red-500'}`}>
                                    {bot.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">No bot configured.</p>
                    )}
                </div>
            </Card>
        </div>
        </div>
    )
}
