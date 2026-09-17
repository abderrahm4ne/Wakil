import { useTranslation } from 'react-i18next'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

import type { ConversationListItem } from '@/types/conversation'
import { displayName, timeAgo } from '@/lib/conversation-utils'

type ConversationListItemProps = {
    conversation: ConversationListItem
    isSelected: boolean
    onSelect: () => void
    onDelete: (id: string) => void
}

export function ConversationListItem({
    conversation,
    isSelected,
    onSelect,
    onDelete,
}: ConversationListItemProps) {
    const { t } = useTranslation('dashboard')
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation()
        
        if (!confirm(t('conversations.confirmDelete') || 'Delete this conversation?')) {
            return
        }

        setIsDeleting(true)
        try {
            const res = await fetch(`/api/conversation/${conversation.id}`, {
                method: 'DELETE'
            })

            if (!res.ok) {
                const error = await res.json()
                console.error('Delete error:', res.status, error)
                throw new Error(error.error || 'Failed to delete')
            }

            onDelete(conversation.id)
        } catch (err) {
            console.error('Delete failed:', err)
        } finally {
            setIsDeleting(false)
        }
    }

    const last = conversation.messages[0]
    const unread = last?.fromCustomer

    return (
        <button
            onClick={onSelect}
            className={`w-full flex items-center justify-between text-left px-3 py-3 rounded-xl border transition-all hover:cursor-pointer group ${
                isSelected
                    ? 'bg-secondary/10 border-secondary/30'
                    : 'border-transparent hover:bg-muted/20 hover:border-border/50'
            }`}
        >
            <div className="flex items-center gap-2 min-w-0 flex-1">
                {unread && (
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                )}

                <div className="min-w-0 flex-1">
                    <p
                        className={`text-sm truncate ${
                            unread ? 'font-semibold' : 'font-medium text-foreground/80'
                        }`}
                    >
                        {displayName(conversation, t)}
                    </p>
                    <p className="text-xs truncate text-muted-foreground">
                        {last?.content.slice(0, 45) || t('conversations.noMessages')}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 ml-2 shrink-0">
                <span className="text-xs text-muted-foreground">
                    {last && timeAgo(last.createdAt, t)}
                </span>
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-1.5 hover:bg-destructive/10 rounded-lg disabled:opacity-50"
                    >
                        <Trash2 size={16} className="text-destructive" />
                    </button>
                </div>
            </div>
        </button>
    )
}