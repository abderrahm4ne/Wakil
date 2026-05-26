import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, Bot, MessageSquare, Zap } from 'lucide-react'
import { headers } from 'next/headers'

async function getDashboardData() {
    const host = (await headers()).get('host')
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
    const baseUrl = `${protocol}://${host}`

    const [analyticsRes, botRes] = await Promise.all([
        fetch(`${baseUrl}/api/analytics`, { headers: await headers() }),
        fetch(`${baseUrl}/api/bot`, { headers: await headers() })
    ])

    const analytics = await analyticsRes.json()
    const bot = await botRes.json()

    return {
        analytics: analytics.success ? analytics.data : null,
        bot: bot.success ? bot.data : null
    }
}

export default async function DashboardPage() {
    const { analytics, bot } = await getDashboardData()

    const stats = [
        {
            label: 'Active Bots',
            value: bot ? 1 : 0,
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
            {!bot && <Button className='text-secondary bg-card hover:bg-card/60 hover:cursor-pointer px-10' size="lg">Create Bot</Button>}
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
                {analytics?.topTriggers?.length > 0 ? (
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
