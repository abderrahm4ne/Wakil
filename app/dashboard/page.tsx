import { Card } from '@/components/ui/card'
import { BarChart3, Bot, MessageSquare, Zap, Check, X, CreditCard } from 'lucide-react'
import { planChecking } from '../action/plan'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getDashboardData } from '@/lib/data/dashboard'

export default async function DashboardPage() {
    const session = await auth()
    const { analytics, bot, subscription } = await getDashboardData()

    console.log(session)
    if(!session) redirect("/login")
    const hasPlan = await planChecking(session?.user.id)
    if(!hasPlan){
        redirect('/onboarding/plan-selection')
    }

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

    const isDay = new Date().getHours() > 12 ? true : false

    return (
        <div className='font-display'>
            <section className='flex flex-col space-y-2'>
                <h1 className='md:text-3xl text-xl text-foreground tracking-tight font-bold'>{isDay ? 'Good Morning' : 'Good Afternoon'}, {session.user.name}</h1>
                <div className='flex flex-row space-x-3'>
                    <h2 className='font-semibold text-muted-foreground text-xl pl-4'>{planDisplayed} Plan </h2>
                    <div />
                    <h2>bot : {session.user.plan}</h2>
                </div>
            </section>
        </div>
    )
}
