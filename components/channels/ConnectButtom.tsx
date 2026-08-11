"use client"

import { Link2 } from 'lucide-react'

type Props = {
    platform: 'INSTAGRAM' | 'FACEBOOK'
    botId: string
}

export function ConnectButton({ platform, botId }: Props) {
    const handleConnect = () => {
        // Redirects into the Meta OAuth flow; backend route builds the
        // platform-specific authorize URL and handles the callback.
        window.location.href = `/api/channels/connect?platform=${platform}&botId=${botId}`
    }

    return (
        <button
            onClick={handleConnect}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors hover:cursor-pointer"
        >
            <Link2 className="h-3.5 w-3.5" />
            Connect
        </button>
    )
}