import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getAnalyticsData } from '@/lib/data/analytics'
import getLang from '@/lib/locale'
import i18n from '@/lib/i18n-server'
import { TrendingUp, Clock, ShoppingBag, PieChart } from 'lucide-react'

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

  const bot = await prisma.bot.findUnique({ where: { userId: session.user.id } })
  if (!bot) {
  return (
    <div className={`${lang === 'ar' ? 'font-arabic' : 'font-display'} flex flex-col items-center justify-center py-20 text-center`}>
      <p className="text-muted-foreground font-semibold">{t('analytics.noBotYet')}</p>
      <a href="/dashboard/bot" className="text-sm text-secondary hover:underline mt-2">
        {t('analytics.setUpYourBot')}
      </a>
    </div>
  )
}

  const data = await getAnalyticsData(bot.id)
  const funnelTotal = Object.values(data.funnel).reduce((a, b) => a + b, 0)
  const maxHourCount = Math.max(...data.peakHours, 1)

  return (
    <div className={`${lang === 'ar' ? 'font-arabic' : 'font-display'} flex flex-col relative space-y-8`}>
      <div>
        <h1 className="sm:text-4xl text-[1.6rem] text-foreground tracking-tight font-semibold">{t('analytics.title')}</h1>
        <p className="text-muted-foreground font-medium">{t('analytics.subtitle')}</p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="group relative overflow-hidden bg-linear-to-tr from-black to-black/5 border border-border rounded-2xl p-6 flex items-center gap-6">
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-secondary/20" />
          <ConversionRing value={data.conversionRate} />
          <div className="relative">
            <p className="text-sm text-muted-foreground">{t('analytics.conversionRate')}</p>
            <p className="text-2xl font-semibold text-foreground">{data.convertedConversations}/{data.totalConversations}</p>
            <p className="text-xs text-muted-foreground">{t('analytics.conversationsToOrders')}</p>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-linear-to-br from-secondary/10 to-green-600/5 border border-border rounded-2xl p-6 flex flex-col justify-center space-y-2">
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-secondary/20" />
          <ShoppingBag className="relative text-secondary" size={24} />
          <p className="relative text-sm text-muted-foreground">{t('analytics.orderValueThisMonth')}</p>
          <p className="relative text-3xl font-semibold text-foreground">{data.orderValueThisMonth.toLocaleString()} DZD</p>
        </div>

        <div className="group relative overflow-hidden bg-linear-to-tr from-black to-black/5 border border-border rounded-2xl p-6 flex flex-col justify-center space-y-2">
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-secondary/20" />
          <Clock className="relative text-secondary" size={24} />
          <p className="relative text-sm text-muted-foreground">{t('analytics.avgResponseTime')}</p>
          <p className="relative text-3xl font-semibold text-foreground">{formatMs(data.avgResponseMs)}</p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-normal mb-4 flex items-center gap-2">
            <PieChart size={18} className="text-secondary" />
            {t('analytics.orderFunnel')}
          </h2>
          {funnelTotal === 0 ? (
            <p className="text-muted-foreground text-sm py-6 text-center font-semibold">{t('analytics.noOrdersYet')}</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(data.funnel).map(([status, count]) => (
                <div key={status} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground font-medium">{status.replace('_', ' ')}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                    <div className={`h-full rounded-full ${FUNNEL_COLORS[status]}`}
                      style={{ width: `${funnelTotal ? (count / funnelTotal) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-normal mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-secondary" />
            {t('analytics.peakHours')}
          </h2>
          <div className="flex items-end gap-1 h-32">
            {data.peakHours.map((count, hour) => (
              <div key={hour} className="flex-1 flex flex-col items-center gap-1 group/bar">
                <div className="w-full rounded-t-sm bg-secondary/40 group-hover/bar:bg-secondary transition-colors"
                  style={{ height: `${(count / maxHourCount) * 100}%`, minHeight: count > 0 ? '4px' : '0px' }} />
                {hour % 4 === 0 && <span className="text-[10px] text-muted-foreground">{hour}h</span>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}