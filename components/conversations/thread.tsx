import { motion } from 'framer-motion'

import type { ConversationDetail } from '@/types/conversation'

import { ConversationThreadHeader } from './thread-header'
import { ConversationMessages } from './messages'

type ConversationThreadProps = {
    conversation: ConversationDetail
    loading: boolean

    editingLabel: boolean
    labelDraft: string

    onLabelDraftChange: (value: string) => void

    onStartEditing: () => void
    onCancelEditing: () => void
    onSaveLabel: () => void
}

export function ConversationThread({
    conversation,
    loading,
    editingLabel,
    labelDraft,
    onLabelDraftChange,
    onStartEditing,
    onCancelEditing,
    onSaveLabel,
}: ConversationThreadProps) {
    return (
        <motion.div
            key={conversation.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full"
        >
            <ConversationThreadHeader
                conversation={conversation}
                editingLabel={editingLabel}
                labelDraft={labelDraft}
                onLabelDraftChange={onLabelDraftChange}
                onStartEditing={onStartEditing}
                onCancelEditing={onCancelEditing}
                onSave={onSaveLabel}
            />

            <ConversationMessages
                conversation={conversation}
                loading={loading}
            />
        </motion.div>
    )
}