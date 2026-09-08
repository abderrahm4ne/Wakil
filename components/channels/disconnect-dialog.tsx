'use client'

import { Unlink, Loader2, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { disconnectChannel } from '@/lib/actions/disconnectChannel'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

interface DisconnectChannelDialogProps {
  channelId: string
  platformLabel: string
}

export function DisconnectChannelDialog({
  channelId,
  platformLabel
}: DisconnectChannelDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation('dashboard')

  const handleDisconnect = async () => {
    setIsLoading(true)
    try {
      const result = await disconnectChannel(channelId)
      if (result.error) {
        toast.error(t('channels.disconnect.error'))
        return
      }
      
      setOpen(false)
      toast.success(t('channels.disconnect.success', { platform: platformLabel }))
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-red-500 hover:border-red-500/50 transition-colors disabled:opacity-50 hover:cursor-pointer"
      >
        <Unlink className="h-3.5 w-3.5" />
        Disconnect
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg p-6 max-w-sm space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Disconnect {platformLabel}?</h2>
            <p className="text-sm text-muted-foreground mt-1">
              You won't receive customer messages from {platformLabel} until you reconnect.
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 rounded-lg bg-muted/30 border border-border/50 text-xs text-muted-foreground">
          You can reconnect your {platformLabel} page anytime. No data will be deleted.
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={() => setOpen(false)}
            variant="outline"
            className="flex-1"
            disabled={isLoading}
          >
            Keep Connected
          </Button>
          <Button
            onClick={handleDisconnect}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white border-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Disconnecting...
              </>
            ) : (
              'Disconnect'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}