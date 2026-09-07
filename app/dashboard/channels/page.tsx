import { Card } from '@/components/ui/card'
import { Check, X, Link2, Unlink } from 'lucide-react'
import Image from 'next/image'
import facebook from '@/assets/facebook.png'
import instagram from '@/assets/instagram.png'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getChannelsData } from '@/lib/actions/getChannelData'
import { ConnectButton } from '@/components/channels/connect-button'
import { DisconnectButton } from '@/components/channels/disconnect-button'
import { prisma } from '@/lib/prisma'
import i18n from '@/lib/i18n-server'
import getLang from '@/lib/locale'
import { platform } from 'os'

const PLATFORM_META = {
  INSTAGRAM: { label: 'Instagram', icon: instagram, color: 'text-pink-500' },
  FACEBOOK: { label: 'Facebook', icon: facebook, color: 'text-blue-500' }
} as const

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

    const statsMap = Object.fromEntries(
        channelStats.map(s => [s.channelId, s.messageCount])
    )

    const byType = (type: 'INSTAGRAM' | 'FACEBOOK') =>
        channels.find((c) => c.type === type)



  return (
    <div className="space-y-8 p-6 font-display">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('channels.title')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('channels.description')}
        </p>
      </div>

      {!bot && (
        <Card className="p-6 border-amber-500/30 bg-amber-500/5">
          <p className="text-sm text-amber-200">
            {t('channels.errors.noBot.title')}
          </p>
        </Card>
      )}

      {/* Channel Cards Grid */}
      {bot && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {(['INSTAGRAM', 'FACEBOOK'] as const).map((type) => {
            const meta = PLATFORM_META[type]
            const channel = byType(type)
            const connected = !!channel

            return (
              <Card
                key={type}
                className={`p-6 transition-all ${
                  connected
                    ? 'border-secondary/50 bg-linear-to-br from-secondary/5 to-secondary/2'
                    : 'border-border hover:border-muted-foreground/50'
                }`}
              >
                {/* Header with icon and status */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Image
                      src={meta.icon}
                      alt={meta.label}
                      className={`h-10 w-10 ${meta.color}`}
                    />
                    <div>
                      <p className="font-semibold text-foreground">{meta.label}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        {connected ? (
                          <>
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-500 font-medium">{t('channels.card.connected')}</span>
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{t('channels.card.notConnected')}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connected State */}
                {connected && (
                  <>
                    <div className="space-y-3 mb-6 pb-6 border-b border-border/50">
                      <div>
                        <p className="text-xs text-muted-foreground">{t('channels.card.pageId')}</p>
                        <p className="text-sm font-mono text-foreground mt-1">{channel!.pageId}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">{t('channels.card.messagestoday')}</p>
                        <p className="text-2xl font-semibold text-secondary mt-1">
                          {statsMap[channel!.id] ?? 0}
                        </p>
                      </div>

                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground">{t('channels.card.status')}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className={`h-2 w-2 rounded-full ${channel!.isActive ? 'bg-green-500' : 'bg-amber-500'}`} />
                          <span className="text-xs font-medium text-foreground">
                            {channel!.isActive ? t('channels.card.active') : t('channels.card.inActive')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions for Connected */}
                    <div className="flex gap-2">
                      <DisconnectButton channelId={channel!.id} />
                    </div>
                  </>
                )}

                {/* Disconnected State */}
                {!connected && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {t('channels.card.description',  { platform: meta.label })}
                    </p>
                    <ConnectButton platform={type} botId={bot.id} />
                  </div>
                )}
              </Card>
            )
          })}
        </div>
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