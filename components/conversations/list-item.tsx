import { useTranslation } from 'react-i18next'

import type { ConversationListItem } from '@/types/conversation'

import {
    displayName,
    timeAgo,
} from '@/lib/conversation-utils'

type ConversationListItemProps = {
    conversation: ConversationListItem
    isSelected: boolean
    onSelect: () => void
}

export function ConversationListItem({
    conversation,
    isSelected,
    onSelect,
}: ConversationListItemProps) {
    const { t } = useTranslation('dashboard')

    const last = conversation.messages[0]

    const unread = last?.fromCustomer

    return (
        <button
            onClick={onSelect}
            className={`w-full text-left px-3 py-3 rounded-xl border transition-all hover:cursor-pointer ${
                isSelected
                    ? 'bg-secondary/10 border-secondary/30'
                    : 'border-transparent hover:bg-muted/20 hover:border-border/50'
            }`}
        >
            <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                    {unread && (
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                    )}

                    <span
                        className={`text-sm truncate ${
                            unread
                                ? 'font-semibold text-foreground'
                                : 'font-medium text-foreground/80'
                        }`}
                    >
                        {displayName(conversation, t)}
                    </span>
                </div>

                {last && (
                    <span className="text-[10px] text-muted-foreground shrink-0">
                        {timeAgo(last.createdAt, t)}
                    </span>
                )}
            </div>

            <p
                className={`text-xs truncate ${
                    unread
                        ? 'text-foreground/70'
                        : 'text-muted-foreground'
                }`}
            >
                {last
                    ? (last.fromCustomer ? '' : '↩ ') +
                      last.content.slice(0, 45)
                    : t('conversations.noMessages')}
            </p>
        </button>
    )
}