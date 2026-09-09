import { Card } from '@/components/ui/card'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getChannelsData } from '@/lib/actions/getChannelData'
import { prisma } from '@/lib/prisma'
import i18n from '@/lib/i18n-server'
import getLang from '@/lib/locale'
import Welcoming from '@/components/dashboard/page-title'
import ChannelsCard from '@/components/channels/channels-card'

export default async function ChannelsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const lang = await getLang()
  const t = i18n.getFixedT(lang, 'dashboard')
  const { channels, bot } = await getChannelsData(session.user.id)

  // Get live message counts for today
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
    <div className={`space-y-8 p-6 ${lang === 'ar' ? 'font-arabic' : 'font-display'}`}>
      {/* Header */}

      <Welcoming title={t('channels.title')} subTitle={t('channels.description')}/>

      {!bot && (
        <Card className="p-6 border-amber-500/30 bg-amber-500/5">
          <p className="text-sm text-[amber-200">
            {t('overview.noChannelConnectedYet')}
          </p>
        </Card>
      )}

      {/* Channel Cards Grid */}
      {bot && (
        <ChannelsCard channels={channels} bot={{id: bot.id}} channelStats={channelStats} />
      )}

      {/* Additional Info */}
      {bot && channels.length > 0 && (
        <Card className="p-4 border-border/50 bg-muted/20">
          <p className="text-xs text-muted-foreground">
            {t('channels.info')}
          </p>
        </Card>
      )}
    </div>
  )
}