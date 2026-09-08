import { Card } from '@/components/ui/card'
import facebook from '@/assets/facebook.png'
import instagram from '@/assets/instagram.png'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getChannelsData } from '@/lib/actions/getChannelData'
import { prisma } from '@/lib/prisma'
import i18n from '@/lib/i18n-server'
import getLang from '@/lib/locale'
import Welcoming from '@/components/dashboard/page-title'
import ChannelsCard from '@/components/channels/channels-card'
import { ChannelErrorToastHandler } from '@/components/channels/channels-errors-handler'
import { Suspense } from 'react'

export default async function ChannelsPage() {

    const lang = await getLang()
    const t = i18n.getFixedT(lang, 'dashboard')

    const session = await auth()
    if (!session) redirect('/login')

    const { channels, bot } = await getChannelsData(session.user.id)
    const channelStats = await Promise.all(
        channels.map(async (channel) => {
        const todayMessages = await prisma.message.count({
            where: {
            conversation: { botId: bot?.id },
            createdAt: {
                gte: new Date(new Date().setHours(0, 0, 0, 0))
            },
            fromCustomer: false
            }
        })
        return { channelId: channel.id, messageCount: todayMessages }
        })
    )

  return (
    <div className={`space-y-8 sm:p-6 p-2 ${lang === 'ar' ? 'font-arabic' : 'font-display'}`}>
      {/* Header */}

      <Suspense fallback={null}>
        <ChannelErrorToastHandler />
      </Suspense>

      <Welcoming title={'channels.title'} subTitle={'channels.description'} />

      {!bot && (
        <Card className="p-6 border-amber-500/30 bg-amber-500/5">
          <p className="text-sm text-amber-200">
            {t('channels.errors.noBot.title')}
          </p>
        </Card>
      )}

      {/* Channel Cards Grid */}
      {bot && (
        <ChannelsCard channels={channels} bot={bot} channelStats={channelStats} />
      )}

      {/* Additional Info */}
      {bot && channels.length > 0 && (
        <Card className="p-4 border-border/50 bg-muted/20">
          <p className="text-xs text-muted-foreground">
            Connected channels receive customer messages in real-time. Wakil will automatically
            reply based on your bot's rules or AI model.
          </p>
        </Card>
      )}
    </div>
  )
}