'use client'

import {
    useEffect,
    useMemo,
    useState,
} from 'react'

import { useTranslation } from 'react-i18next'
import {
    AnimatePresence,
    motion,
} from 'framer-motion'

import Welcoming from '@/components/dashboard/page-title'

import type {
    ConversationDetail,
    ConversationListItem,
} from '@/types/conversation'

import { ConversationSidebar } from '@/components/conversations/sidebar'
import { ConversationThread } from '@/components/conversations/thread'
import { ConversationEmptyState } from '@/components/conversations/empty-state'

export default function ConversationsPage() {
    const { t, i18n } = useTranslation('dashboard')

    const [conversations, setConversations] =
        useState<ConversationListItem[]>([])

    const [loading, setLoading] = useState(true)

    const [searchQuery, setSearchQuery] =
        useState('')

    const [selectedId, setSelectedId] =
        useState<string | null>(null)

    const [detail, setDetail] =
        useState<ConversationDetail | null>(null)

    const [detailLoading, setDetailLoading] =
        useState(false)

    const [editingLabel, setEditingLabel] =
        useState(false)

    const [labelDraft, setLabelDraft] =
        useState('')

    // fetch conversations
    useEffect(() => {
        async function fetchConversations() {
            try {
                const response = await fetch('/api/conversation')
                const result = await response.json()
                if (result.success) {
                    setConversations(result.data)
                }
            } finally {
                setLoading(false)
            }
        }
        fetchConversations()
    }, [])

    // fetch selected conversation
    useEffect(() => {
        if (!selectedId) return

        async function fetchConversationDetail() {
            setDetailLoading(true)

            try {
                const response = await fetch(`/api/conversation/${selectedId}`)
                const result = await response.json()
                if (result.success) {
                    setDetail(result.data)
                }
            } finally {
                setDetailLoading(false)
            }
        }

        fetchConversationDetail()
    }, [selectedId])

    // filter conversations
    const filteredConversations = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()

        if (!query) {
            return conversations
        }

        return conversations.filter(
            (conversation) => {
                const label = conversation.label?.toLowerCase() ?? ''
                const lastMessage = conversation.messages[0]?.content.toLowerCase() ?? ''
                return (
                    conversation.customerId
                        .toLowerCase()
                        .includes(query) ||
                    label.includes(query) ||
                    lastMessage.includes(query)
                )
            }
        )
    }, [conversations, searchQuery])

    // Select conversation
    function handleSelectConversation(id: string) {
        setSelectedId(id)
        setEditingLabel(false)
        setDetail(null)
    }

    // Start editing label
    function handleStartEditing() {
        setLabelDraft(detail?.label ?? '')
        setEditingLabel(true)
    }

    // Save label
    async function handleSaveLabel() {
        if (!detail) return

        const newLabel =
            labelDraft.trim() || null
        const response = await fetch(`/api/conversation/${detail.id}`,
            {
                method: 'PATCH',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify({ label: newLabel }),
            }
        )

        const result = await response.json()
        if (!result.success) {
            return
        }
        // Update detail
        setDetail((previous) =>
            previous ? { ...previous, label: newLabel } : previous
        )

        // update conversations
        setConversations((previous) =>
            previous.map((conversation) =>
                conversation.id === detail.id
                    ? {
                          ...conversation,
                          label: newLabel,
                      }
                    : conversation
            )
        )

        setEditingLabel(false)
    }

    return (
        <div className={`flex flex-col ${i18n.language === 'ar' ? 'font-arabic' : 'font-display'} h-[calc(100vh-4rem)] gap-6 overflow-hidden`}>
            <Welcoming
                title="conversations.title"
                subTitle="conversations.subtitle"
            />

            <motion.div
                initial={{ opacity: 0,y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="flex flex-1 gap-4 min-h-0"
            >
                <ConversationSidebar
                    conversations={conversations}
                    filteredConversations={
                        filteredConversations
                    }
                    loading={loading}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedId={selectedId}
                    onSelect={
                        handleSelectConversation
                    }
                />

                <div className="flex-1 flex flex-col overflow-hidden bg-card border border-border rounded-2xl min-w-0">
                    <AnimatePresence mode="wait">
                        {!selectedId ? (
                            <ConversationEmptyState />
                        ) : detail ? (
                            <ConversationThread
                                conversation={detail}
                                loading={detailLoading}
                                editingLabel={editingLabel}
                                labelDraft={labelDraft}
                                onLabelDraftChange={setLabelDraft}
                                onStartEditing={handleStartEditing}
                                onCancelEditing={() =>setEditingLabel(false)}
                                onSaveLabel={handleSaveLabel}
                            />
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="animate-pulse rounded-xl bg-muted/30 h-10 w-48" />
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    )
}