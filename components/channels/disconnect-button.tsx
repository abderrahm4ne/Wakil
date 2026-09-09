"use client"

import { Unlink } from 'lucide-react'
import { useState, useTransition } from 'react'
import { disconnectChannel } from '@/lib/actions/disconnectChannel'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { resolveErrorMessage } from '@/lib/errorMessages'

type Props = {
    platform: string
    channelId: string
}

export function DisconnectButton({ platform, channelId }: Props) {
    const { t } = useTranslation('dashboard')
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    const handleDisconnect = () => {
        setError(null)
        startTransition(async () => {
            const res = await disconnectChannel(channelId)
            if (res.error) {
                toast.error(resolveErrorMessage(res.error, t))
                return
            }
            toast.success(t('channels.disconnect.success', { platform }))
        })
    }

    return (
        <div className="flex flex-col items-end gap-1">
            <button
                type="button"
                onClick={handleDisconnect}
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-md font-medium text-muted-foreground hover:text-red-500 hover:border-red-500/50 transition-colors disabled:opacity-50 hover:cursor-pointer min-w-25"
            >
                <Unlink className="h-3.5 w-3.5" />
                {isPending ? t('channels.disconnect.disconnecting') : t('channels.card.disconnect')}
            </button>
            {error && <span className="text-xs text-red-500">{t('channels.disconnect.error')}</span>}
        </div>
    )
}