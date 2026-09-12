'use client'

import { useTranslation } from 'react-i18next'
import { STATUS_TABS, StatusTab } from '@/types/orders'

interface Props {
    activeTab: StatusTab
    counts: Record<string, number>
    onChange: (tab: StatusTab) => void
}

export function OrdersTabs({ activeTab, counts, onChange }: Props) {
    const { t } = useTranslation('dashboard')

    return (
        <div className="flex gap-1 border-b border-border">
            {STATUS_TABS.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onChange(tab)}
                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors hover:cursor-pointer ${
                        activeTab === tab
                            ? 'border-secondary text-foreground'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                    {t(`orders.status.${tab.toLowerCase()}`, { defaultValue: tab.replace(/_/g, ' ') })}
                    {counts[tab] ? (
                        <span className={`ms-2 px-1.5 py-0.5 rounded-full text-xs ${
                            activeTab === tab ? 'bg-secondary/15 text-secondary' : 'bg-muted text-muted-foreground'
                        }`}>
                            {counts[tab]}
                        </span>
                    ) : null}
                </button>
            ))}
        </div>
    )
}