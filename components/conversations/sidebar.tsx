import { useTranslation } from 'react-i18next'

import type { ConversationListItem } from '@/types/conversation'

import { ConversationSearch } from './search'
import { ConversationList } from './list'

type ConversationSidebarProps = {
    conversations: ConversationListItem[]
    filteredConversations: ConversationListItem[]
    loading: boolean

    searchQuery: string
    onSearchChange: (value: string) => void

    selectedId: string | null
    onSelect: (id: string) => void
}

export function ConversationSidebar({
    conversations,
    filteredConversations,
    loading,
    searchQuery,
    onSearchChange,
    selectedId,
    onSelect,
}: ConversationSidebarProps) {
    const { t } = useTranslation('dashboard')

    return (
        <div className="w-full md:w-[30%] flex flex-col overflow-hidden bg-linear-to-tr from-black to-black/5 border border-border rounded-2xl">
            <ConversationSearch
                value={searchQuery}
                onChange={onSearchChange}
                placeholder={t('conversations.search')}
            />

            {!loading && conversations.length > 0 && (
                <div className="px-4 py-2 border-b border-border/40">
                    <span className="text-xs text-muted-foreground">
                        {filteredConversations.length}{' '}
                        {t('conversations.title', {
                            defaultValue: 'conversations',
                        }).toLowerCase()}
                    </span>
                </div>
            )}

            <div className="flex-1 overflow-y-auto">
                <ConversationList
                    conversations={filteredConversations}
                    loading={loading}
                    selectedId={selectedId}
                    totalConversations={conversations.length}
                    onSelect={onSelect}
                />
            </div>
        </div>
    )
}