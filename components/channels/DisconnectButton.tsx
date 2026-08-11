"use client"

import { Unlink } from 'lucide-react'
import { useState, useTransition } from 'react'
import { disconnectChannel } from '@/lib/actions/disconnectChannel'

type Props = {
    channelId: string
}

export function DisconnectButton({ channelId }: Props) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    const handleDisconnect = () => {
        setError(null)
        startTransition(async () => {
            const res = await disconnectChannel(channelId)
            if (res.error) setError(res.error)
        })
    }

    return (
        <div className="flex flex-col items-end gap-1">
            <button
                type="button"
                onClick={handleDisconnect}
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-red-500 hover:border-red-500/50 transition-colors disabled:opacity-50 hover:cursor-pointer"
            >
                <Unlink className="h-3.5 w-3.5" />
                {isPending ? 'Disconnecting...' : 'Disconnect'}
            </button>
            {error && <span className="text-xs text-red-500">Failed to disconnect</span>}
        </div>
    )
}