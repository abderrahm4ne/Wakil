import { MessageSquare } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { ConversationListItem } from '@/types/conversation'

import { ConversationListItem as ConversationItem } from './list-item'

type ConversationListProps = {
    conversations: ConversationListItem[]
    loading: boolean
    selectedId: string | null
    totalConversations: number
    onSelect: (id: string) => void
}

export function ConversationList({
    conversations,
    loading,
    selectedId,
    totalConversations,
    onSelect,
}: ConversationListProps) {
    const { t } = useTranslation('dashboard')

    if (loading) {
        return (
            <div className="flex flex-col gap-2 p-3">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="animate-pulse rounded-xl bg-muted/30 h-16"
                    />
                ))}
            </div>
        )
    }

    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-12 gap-2 text-center px-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground/30" />

                <p className="text-sm text-muted-foreground font-medium">
                    {totalConversations === 0
                        ? t('conversations.noConversations')
                        : t('conversations.noMatches')}
                </p>
            </div>
        )
    }

    return (
        <div className="p-2 space-y-1">
            {conversations.map((conversation) => (
                <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isSelected={conversation.id === selectedId}
                    onSelect={() => onSelect(conversation.id)}
                />
            ))}
        </div>
    )
}