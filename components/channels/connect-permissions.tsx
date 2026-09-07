'use client'

import { AlertCircle, ChevronDown, Shield } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

type ChannelType = 'INSTAGRAM' | 'FACEBOOK'

const PERMISSIONS = {
  INSTAGRAM: [
    {
      id: 'read_messages',
      title: 'Read Messages',
      description: 'See direct messages from your customers'
    },
    {
      id: 'send_messages',
      title: 'Send Messages',
      description: 'Reply to customer messages automatically'
    },
    {
      id: 'manage_metadata',
      title: 'Manage Metadata',
      description: 'Track message status and conversation metadata'
    }
  ],
  FACEBOOK: [
    {
      id: 'read_messages',
      title: 'Read Messages',
      description: 'See direct messages from your customers'
    },
    {
      id: 'send_messages',
      title: 'Send Messages',
      description: 'Reply to customer messages automatically'
    },
    {
      id: 'manage_metadata',
      title: 'Manage Metadata',
      description: 'Track message status and conversation metadata'
    }
  ]
}

interface ConnectPermissionsProps {
  platform: ChannelType
  botId: string
}

export function ConnectPermissions({ platform, botId }: ConnectPermissionsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { t } = useTranslation('dashboard')

  const permissions = PERMISSIONS[platform]

  const handleConnect = async () => {
    setIsLoading(true)
    window.location.href = `/api/channels/connect?platform=${platform}&botId=${botId}`
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/30">
              <Shield className="h-6 w-6 text-secondary" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">
            Connect {platform === 'INSTAGRAM' ? 'Instagram' : 'Facebook'} to Wakil
          </h1>
          <p className="text-sm text-muted-foreground">
            We need these permissions to help you manage customer messages
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
                className="w-full px-4 py-3 flex items-start justify-between hover:bg-muted/30 transition-colors text-left"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-0.5">
                    <div className="h-5 w-5 rounded-full bg-secondary/20 border border-secondary flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-secondary" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {permission.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {permission.description}
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
                  <p>
                    {permission.id === 'read_messages' &&
                      'Wakil reads incoming messages to understand customer queries and provide contextual responses.'}
                    {permission.id === 'send_messages' &&
                      'Wakil sends automated replies to customers based on rules or AI. Your account always retains full control.'}
                    {permission.id === 'manage_metadata' &&
                      'We track delivery status, read receipts, and conversation metadata for analytics and debugging.'}
                  </p>
                  <p className="text-secondary font-medium">
                    {permission.id === 'read_messages' &&
                      '🔒 Messages are processed server-side only. Never stored permanently.'}
                    {permission.id === 'send_messages' &&
                      '🔒 Replies are sent under your business account. You can revoke access anytime.'}
                    {permission.id === 'manage_metadata' &&
                      '🔒 Metadata is used for your analytics dashboard only.'}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="flex gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-sm text-blue-200">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <p>
            You'll be redirected to{' '}
            {platform === 'INSTAGRAM' ? 'Instagram' : 'Facebook'} to approve these permissions.
            You can revoke access anytime.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConnect}
            className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            disabled={isLoading}
          >
            {isLoading ? 'Redirecting...' : 'Continue to ' + platform}
          </Button>
        </div>
      </div>
    </div>
  )
}