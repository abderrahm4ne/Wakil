import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getAnalyticsData } from '@/lib/data/analytics'
import getLang from '@/lib/locale'
import i18n from '@/lib/i18n-server'
import { AnalyticsStats } from '@/components/dashboard/analytics-stats'
import { OrderFunnel } from '@/components/dashboard/analytics-order-funnel'
import { PeakHours } from '@/components/dashboard/analytics-peak-hours'
import { ConversationTrend } from '@/components/dashboard/analytics-conversations-trend'
import Welcoming from '@/components/dashboard/page-title'

const FUNNEL_COLORS: Record<string, string> = {
  PENDING: 'bg-muted-foreground',
  PENDING_REVIEW: 'bg-orange-500',
  CONFIRMED: 'bg-green-500',
  CANCELLED: 'bg-destructive'
}

function formatMs(ms: number | null) {
  if (ms === null) return '—'
  const mins = Math.round(ms / 60000)
  if (mins < 1) return '<1 min'
  if (mins < 60) return `${mins} min`
  return `${(mins / 60).toFixed(1)} hr`
}

function ConversionRing({ value }: { value: number }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  const color = value >= 30 ? '#00D4AA' : value >= 15 ? '#eab308' : '#8B8FA8'
  return (
    <div className="relative w-24 h-24 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={radius} fill="none" stroke="currentColor" strokeWidth="7" className="text-muted/30" />
        <circle cx="40" cy="40" r={radius} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-foreground">{Math.round(value)}%</span>
      </div>
    </div>
  )
}

export default async function AnalyticsPage() {
  const lang = await getLang()
  const t = i18n.getFixedT(lang, 'dashboard')

  const session = await auth()
  if (!session) redirect('/login')

    // no bot
  const bot = await prisma.bot.findUnique({ where: { userId: session.user.id } })
  if (!bot) {
  return (
    <div className={`${lang === 'ar' ? 'font-arabic' : 'font-display'} flex flex-col items-center justify-center py-20 text-center`}>
      <p className="text-muted-foreground font-semibold">{t('analytics.noBot')}</p>
      <a href="/dashboard/bot" className="text-sm text-secondary hover:underline mt-2">
        {t('analytics.setUpYourBot')}
      </a>
    </div>
  )
}

  const data = await getAnalyticsData(bot.id)
  const funnelTotal = Object.values(data.funnel).reduce((a, b) => a + b, 0)
  const maxHourCount = Math.max(...data.peakHours, 1)
  const maxConvCount = Math.max(...data.conversationTrend.map(d => d.count), 1)

  return (
    <div className={`${lang === 'ar' ? 'font-arabic' : 'font-display'} flex flex-col relative space-y-8`}>
      {/* Header */}
      <Welcoming title={'analytics.title'} subTitle={'analytics.subtitle'} />

      {/* Stats */}
      <AnalyticsStats
        conversionRate={data.conversionRate}
        convertedConversations={
          data.convertedConversations
        }
        totalConversations={
          data.totalConversations
        }
        tokenUsed={data.tokenUsed}
        avgResponseMs={
          data.avgResponseMs
        }
        unAnsweredConversations={
          data.unAnsweredConversations
        }
        averageMessagesPerConversation={
          data.averageMessagesPerConversation
        }
        labels={{
          conversionRate:
            t('analytics.conversionRate'),
          conversationsToOrders:
            t('analytics.conversationsToOrders'),
          tokenUsage:
            t('analytics.tokenUsage'),
          token:
            t('analytics.token'),
          avgResponseTime:
            t('analytics.avgResponseTime'),
          unAnsweredConversation:
            t('analytics.unAnsweredConversation'),
          averageMessagesPerConversation:
            t(
              'analytics.averageMessagesPerConversation'
            )
        }}
      />


      {/* Order Funnel */}
      <OrderFunnel
        funnel={data.funnel}
        labels={{
          orderFunnel:
            t('analytics.orderFunnel'),
          noOrdersYet:
            t('analytics.noOrdersYet')
        }}
      />


      {/* Charts */}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PeakHours
          peakHours={data.peakHours}
          title={
            t('analytics.peakHours')
          }
        />

        <ConversationTrend
          conversationTrend={
            data.conversationTrend
          }
          title={
            t('analytics.conversationTrend')
          }
        />

      </section>

    </div>
  )
}