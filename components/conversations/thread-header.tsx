import {
    Check,
    Pencil,
    X as XIcon,
} from 'lucide-react'

import { useTranslation } from 'react-i18next'

import type { ConversationDetail } from '@/types/conversation'

import { displayName } from '@/lib/conversation-utils'

type ConversationThreadHeaderProps = {
    conversation: ConversationDetail

    editingLabel: boolean
    labelDraft: string

    onLabelDraftChange: (value: string) => void

    onStartEditing: () => void
    onCancelEditing: () => void
    onSave: () => void
}

export function ConversationThreadHeader({
    conversation,
    editingLabel,
    labelDraft,
    onLabelDraftChange,
    onStartEditing,
    onCancelEditing,
    onSave,
}: ConversationThreadHeaderProps) {
    const { t } = useTranslation('dashboard')

    if (editingLabel) {
        return (
            <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 flex-1">
                    <input
                        autoFocus
                        value={labelDraft}
                        onChange={(e) =>
                            onLabelDraftChange(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onSave()
                            }

                            if (e.key === 'Escape') {
                                onCancelEditing()
                            }
                        }}
                        placeholder={t('conversations.addName')}
                        className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-secondary/50"
                    />

                    <button
                        onClick={onSave}
                        className="p-1.5 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 hover:cursor-pointer transition"
                    >
                        <Check className="h-3.5 w-3.5" />
                    </button>

                    <button
                        onClick={onCancelEditing}
                        className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 hover:cursor-pointer transition"
                    >
                        <XIcon className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary/15 border border-secondary/25 flex items-center justify-center text-xs font-semibold text-secondary shrink-0">
                    {displayName(conversation, t)
                        .slice(0, 2)
                        .toUpperCase()}
                </div>

                <span className="font-semibold text-foreground text-sm">
                    {displayName(conversation, t)}
                </span>

                <button
                    onClick={onStartEditing}
                    className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/30 hover:cursor-pointer transition"
                >
                    <Pencil className="h-3 w-3" />
                </button>
            </div>
        </div>
    )
}