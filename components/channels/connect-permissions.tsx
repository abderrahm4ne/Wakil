'use client'

import { AlertCircle, ChevronDown, Shield } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

type ChannelType = 'INSTAGRAM' | 'FACEBOOK'

const getPermissions = (t: any) => ({
  INSTAGRAM: [
    {
      id: 'read_messages',
      titleKey: 'channels.permissions.readMessages',
      descKey: 'channels.permissions.readMessagesDesc',
      whyKey: 'channels.permissions.readMessagesWhy',
      securityKey: 'channels.permissions.readMessagesSecurity'
    },
    {
      id: 'send_messages',
      titleKey: 'channels.permissions.sendMessages',
      descKey: 'channels.permissions.sendMessagesDesc',
      whyKey: 'channels.permissions.sendMessagesWhy',
      securityKey: 'channels.permissions.sendMessagesSecurity'
    },
    {
      id: 'manage_metadata',
      titleKey: 'channels.permissions.manageMetadata',
      descKey: 'channels.permissions.manageMetadataDesc',
      whyKey: 'channels.permissions.manageMetadataWhy',
      securityKey: 'channels.permissions.manageMetadataSecurity'
    }
  ],
  FACEBOOK: [
    {
      id: 'read_messages',
      titleKey: 'channels.permissions.readMessages',
      descKey: 'channels.permissions.readMessagesDesc',
      whyKey: 'channels.permissions.readMessagesWhy',
      securityKey: 'channels.permissions.readMessagesSecurity'
    },
    {
      id: 'send_messages',
      titleKey: 'channels.permissions.sendMessages',
      descKey: 'channels.permissions.sendMessagesDesc',
      whyKey: 'channels.permissions.sendMessagesWhy',
      securityKey: 'channels.permissions.sendMessagesSecurity'
    },
    {
      id: 'manage_metadata',
      titleKey: 'channels.permissions.manageMetadata',
      descKey: 'channels.permissions.manageMetadataDesc',
      whyKey: 'channels.permissions.manageMetadataWhy',
      securityKey: 'channels.permissions.manageMetadataSecurity'
    }
  ]
})

interface ConnectPermissionsProps {
  platform: ChannelType
  botId: string
}

export function ConnectPermissions({ platform, botId }: ConnectPermissionsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { t, i18n } = useTranslation('dashboard')

  const permissions = getPermissions(t)[platform]

  const handleConnect = async () => {
    setIsLoading(true)
    window.location.href = `/api/channels/connect?platform=${platform}&botId=${botId}`
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className={`min-h-[80vh] bg-background flex items-center justify-center p-4 ${i18n.language === 'ar' ? 'font-arabic' : 'font-display'}`}>
      <div className="w-full max-w-md space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">

          {/* SHIELD ICON */}
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/30">
              <Shield className="h-6 w-6 text-secondary" />
            </div>
          </div>


          <h1 className="text-2xl font-semibold text-foreground">
            {t('channels.permissions.title', { platform: platform === 'INSTAGRAM' ? 'Instagram' : 'Facebook' })}
          </h1>

          <p className="text-sm font-medium text-muted-foreground">
            {t('channels.permissions.subtitle')}
          </p>
        </div>

        {/* Permissions List */}
        <div className="space-y-2 border border-border rounded-lg p-4 bg-card/50">
          {permissions.map((permission) => (
            <div
              key={permission.id}
              className="border border-border/50 rounded-lg overflow-hidden bg-background/50"
            >
              <button
                onClick={() =>
                  setExpandedId(expandedId === permission.id ? null : permission.id)
                }
                className="w-full px-4 py-3 flex items-start justify-between hover:bg-muted/30 transition-colors text-left hover:cursor-pointer"
              >
                <div className="flex items-start gap-3 flex-1">

                  {/* DOT */}
                  <div className="mt-0.5">              
                    <div className="h-5 w-5 rounded-full bg-secondary/20 border border-secondary flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-secondary" />
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-start text-foreground text-sm">
                      {t(permission.titleKey)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t(permission.descKey)}
                    </p>
                  </div>
                </div>

                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ml-2 mt-0.5 ${
                    expandedId === permission.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedId === permission.id && (
                <div className="px-4 py-3 bg-muted/20 border-t border-border/50 text-xs text-muted-foreground space-y-2">
                  <p>{t(permission.whyKey)}</p>
                  <p className="text-secondary font-medium">{t(permission.securityKey)}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="flex gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-sm text-blue-200">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <p>{t('channels.permissions.redirectInfo', { platform: platform === 'INSTAGRAM' ? 'Instagram' : 'Facebook' })}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="flex-1 hover:cursor-pointer"
            disabled={isLoading}
          >
            {t('channels.permissions.cancelBtn')}
          </Button>
          <Button
            onClick={handleConnect}
            className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground hover:cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? t('channels.permissions.redirecting') : t('channels.permissions.continueBtn', { platform: platform === 'INSTAGRAM' ? 'Instagram' : 'Facebook' })}
          </Button>
        </div>
      </div>
    </div>
  )
}