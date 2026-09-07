"use client"
import { motion } from 'framer-motion'
import { MessageSquare, Radio, SendHorizontal, Zap, LucideIcon } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

const ICONS: Record<string, LucideIcon> = {
    messages: MessageSquare,
    conversations: Radio,
    orders: SendHorizontal,
    channels: Zap,
}

type Stat = {
    id: number
    label: string
    value: string | number
    icon: keyof typeof ICONS
    alert?: boolean
}

export function StatsGrid({ stats, isUnlimited, percentage, maxMessages }: {
    stats: Stat[]
    isUnlimited: boolean
    percentage: number
    maxMessages: number | null
}) {
    return (
        <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-15'>
            {stats.map((stat, i) => {
                const Icon = ICONS[stat.icon]
                return (
                    <motion.div
                        key={stat.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className='group relative overflow-hidden bg-linear-to-tr from-black to-black/5 border rounded-xl px-4 py-4 flex flex-col space-y-4 transition-colors'
                    >
                        <div className='absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl transition-opacity opacity-0 group-hover:opacity-100 bg-secondary/20' />
                        <Icon className={`relative ${stat.alert ? 'text-orange-500' : 'text-secondary'}`} size={26} />
                        <h2 className='relative text-xl text-muted-foreground font-normal'>{stat.label}</h2>
                        <h2 className='relative text-2xl font-semibold'>{stat.value}</h2>
                        {stat.id === 0 && !isUnlimited && (
                            <div className='relative space-y-1'>
                                <Progress value={percentage} className="h-1.5" />
                                <p className='text-xs text-muted-foreground font-italic'>{Math.round(percentage)}% of {maxMessages}</p>
                            </div>
                        )}
                        {stat.id === 0 && isUnlimited && (
                            <span className='relative text-xs text-secondary font-medium'>Unlimited</span>
                        )}
                    </motion.div>
                )
            })}
        </section>
    )
}