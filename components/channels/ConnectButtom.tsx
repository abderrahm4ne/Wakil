"use client"

import { Link2 } from 'lucide-react'

type Props = {
    platform: 'INSTAGRAM' | 'FACEBOOK'
    botId: string
}

export function ConnectButton({ platform, botId }: Props) {
    const handleConnect = () => {
        window.location.href = `/api/channels/connect?platform=${platform.toLowerCase()}&botId=${botId}`
    }

    return (
        <button
            onClick={handleConnect}
            className="flex items-center gap-1.5 rounded-lg bg-white hover:bg-white/85 text-black/70 px-3 py-1.5 text-sm font-medium transition-colors hover:cursor-pointer"
        >
            <Link2 className="h-3.5 w-3.5" />
            Connect
        </button>
    )
}