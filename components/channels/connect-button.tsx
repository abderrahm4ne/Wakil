"use client"

import { Link2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type Props = {
    platform: 'INSTAGRAM' | 'FACEBOOK'
    botId: string
}

export function ConnectButton({ platform, botId }: Props) {
    const { t } = useTranslation('dashboard')
    const handleConnect = () => {
        window.location.href = `/dashboard/channels/connect-info?platform=${platform}&botId=${botId}`
    }

    return (
        <button
            onClick={handleConnect}
            className="flex items-center gap-1.5 rounded-lg bg-white hover:bg-white/85 text-black/70 px-3 py-1.5 text-md font-medium transition-colors hover:cursor-pointer w-25 justify-center"
        >
            <Link2 className="h-3.5 w-3.5" />
            {t('channels.card.connect')}
        </button>
    )
}
