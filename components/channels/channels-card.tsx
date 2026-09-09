'use client'

import { Check, X } from 'lucide-react'
import Image from 'next/image'
import { Channel} from '@/generated/prisma/client'
import facebook from '@/assets/facebook.png'
import instagram from '@/assets/instagram.png'
import { ConnectButton } from '@/components/channels/connect-button'
import { DisconnectButton } from '@/components/channels/disconnect-button'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const PLATFORM_META = {
    INSTAGRAM: { label: 'Instagram', icon: instagram, color: 'text-pink-500' },
    FACEBOOK: { label: 'Facebook', icon: facebook, color: 'text-blue-500' }
} as const

interface channelStats {
    channelId: string;
    messageCount: number;
}

interface Props{
 channels: Channel[],
 bot: { id: string },
 channelStats: channelStats[]
}

export default function ChannelsCard({ channels, bot, channelStats }: Props){

const byType = (type: 'INSTAGRAM' | 'FACEBOOK') =>
    channels.find((c) => c.type === type)
    const { t } = useTranslation('dashboard')
    const statsMap = Object.fromEntries(
        channelStats.map(s => [s.channelId, s.messageCount])
    )

    return(
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {(['INSTAGRAM', 'FACEBOOK'] as const).map((type) => {
            const meta = PLATFORM_META[type]
            const channel = byType(type)
            const connected = !!channel

            return (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
                key={type}
                className={`p-6 border rounded-xl ${
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
                      <p className="font-sans font-semibold text-xl text-foreground">{meta.label}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        {connected ? (
                          <>
                            <Check size={20} className="text-green-500" />
                            <span className="text-[0.83rem] text-green-500 font-semibold">
                                {t('channels.card.connected')}
                            </span>
                          </>
                        ) : (
                          <>
                            <X size={20} className="text-muted-foreground" />
                            <span className="text-[0.83rem] text-muted-foreground font-semibold">{t('channels.card.notConnected')}</span>
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

                      {/* PAGE ID */}
                      <div>
                        <p className="text-md text-muted-foreground">{t('channels.card.pageId')}</p>
                        <p className="text-md font-sans text-foreground mt-1">{channel!.pageId}</p>
                      </div>

                      {/* MESSAGES TODAY */}
                      <div>
                        <p className="text-md text-muted-foreground">{t('channels.card.messagestoday')}</p>
                        <p className="text-2xl font-sans font-semibold text-secondary mt-1">
                          {statsMap[channel!.id] ?? 0}
                        </p>
                      </div>

                      {/* STATUS */}
                      <div className="pt-2">
                        <p className="text-md text-muted-foreground">{t('channels.card.status')}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className={`h-2 w-2 rounded-full ${channel!.isActive ? 'bg-green-500' : 'bg-amber-500'}`} />
                          <span className="text-md font-medium text-foreground">
                            {channel!.isActive ? t('channels.card.active') : t('channels.card.inActive')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions for Connected */}
                    <div className="flex gap-2">
                      <DisconnectButton platform={meta.label} channelId={channel!.id} />
                    </div>
                  </>
                )}

                {/* Disconnected State */}
                {!connected && (
                  <div className="space-y-3">
                    <p className="text-md text-muted-foreground">
                      {t('channels.card.description',  { platform: meta.label })}
                    </p>
                    <ConnectButton platform={type} botId={bot.id} />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
    )
}