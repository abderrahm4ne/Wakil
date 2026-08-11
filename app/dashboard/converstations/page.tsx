"use client"

import { Card } from '@/components/ui/card'
import { Search, MessageSquare, Pencil, Check, X as XIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type ConversationListItem = {
    id: string
    customerId: string
    label: string | null
    createdAt: string
    updatedAt: string
    messages: { content: string; fromCustomer: boolean; createdAt: string }[]
}

type MessageItem = {
    id: string
    content: string
    fromCustomer: boolean
    createdAt: string
}

type ConversationDetail = {
    id: string
    customerId: string
    label: string | null
    messages: MessageItem[]
}

function timeAgo(dateStr: string): string {
    const diffMs = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diffMs / 60000)
    if (mins < 1) return 'now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
}

function displayName(c: { customerId: string; label: string | null }): string {
    if (c.label) return c.label
    return `Customer ${c.customerId.slice(0, 8)}...`
}

export default function ConversationsPage() {
    const [conversations, setConversations] = useState<ConversationListItem[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [detail, setDetail] = useState<ConversationDetail | null>(null)
    const [detailLoading, setDetailLoading] = useState(false)
    const [editingLabel, setEditingLabel] = useState(false)
    const [labelDraft, setLabelDraft] = useState('')

    useEffect(() => {
        fetch('/api/conversations')
            .then((res) => res.json())
            .then((res) => {
                if (res.success) setConversations(res.data)
            })
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (!selectedId) return
        setDetailLoading(true)
        fetch(`/api/conversations/${selectedId}`)
            .then((res) => res.json())
            .then((res) => {
                if (res.success) setDetail(res.data)
            })
            .finally(() => setDetailLoading(false))
    }, [selectedId])

    const filtered = useMemo(() => {
        const q = searchQuery.trim().toLowerCase()
        if (!q) return conversations
        return conversations.filter((c) => {
            const label = c.label?.toLowerCase() ?? ''
            const lastMsg = c.messages[0]?.content.toLowerCase() ?? ''
            return (
                c.customerId.toLowerCase().includes(q) ||
                label.includes(q) ||
                lastMsg.includes(q)
            )
        })
    }, [conversations, searchQuery])

    const saveLabel = async () => {
        if (!detail) return
        const res = await fetch(`/api/conversations/${detail.id}/label`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ label: labelDraft.trim() || null }),
        })
        const data = await res.json()
        if (data.success) {
            const newLabel = labelDraft.trim() || null
            setDetail({ ...detail, label: newLabel })
            setConversations((prev) =>
                prev.map((c) => (c.id === detail.id ? { ...c, label: newLabel } : c))
            )
        }
        setEditingLabel(false)
    }

    return (
        <div className="flex flex-col h-[calc(100vh-3rem)] p-6 font-display gap-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Conversations</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Customer conversations across all channels.
                </p>
            </div>

            <div className="flex flex-1 gap-6 min-h-0">
                {/* Sidebar */}
                <Card className="w-full md:w-[32%] flex flex-col p-0 overflow-hidden">
                    <div className="p-4 border-b border-border">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name or message..."
                                className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <p className="p-4 text-sm text-muted-foreground italic">Loading...</p>
                        ) : filtered.length === 0 ? (
                            <p className="p-4 text-sm text-muted-foreground italic">
                                {conversations.length === 0 ? 'No conversations yet.' : 'No matches found.'}
                            </p>
                        ) : (
                            filtered.map((c) => {
                                const last = c.messages[0]
                                const isSelected = c.id === selectedId
                                const unread = last && last.fromCustomer
                                return (
                                    <button
                                        key={c.id}
                                        onClick={() => {
                                            setSelectedId(c.id)
                                            setEditingLabel(false)
                                        }}
                                        className={`w-full text-left px-4 py-3 border-b border-border last:border-0 transition-colors hover:bg-primary/5 ${
                                            isSelected ? 'bg-primary/10' : ''
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span
                                                className={`text-sm truncate ${
                                                    unread ? 'font-semibold text-foreground' : 'font-medium text-foreground'
                                                }`}
                                            >
                                                {displayName(c)}
                                            </span>
                                            {last && (
                                                <span className="text-xs text-muted-foreground shrink-0">
                                                    {timeAgo(last.createdAt)}
                                                </span>
                                            )}
                                        </div>
                                        <p
                                            className={`mt-1 text-xs truncate ${
                                                unread ? 'text-foreground/80' : 'text-muted-foreground'
                                            }`}
                                        >
                                            {last ? last.content.slice(0, 40) : 'No messages yet'}
                                        </p>
                                    </button>
                                )
                            })
                        )}
                    </div>
                </Card>

                {/* Thread panel */}
                <Card className="flex-1 flex flex-col p-0 overflow-hidden">
                    {!selectedId ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground/50" />
                                <p className="mt-3 text-sm text-muted-foreground">
                                    Select a conversation to view messages
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="p-4 border-b border-border flex items-center justify-between">
                                {editingLabel ? (
                                    <div className="flex items-center gap-2 flex-1">
                                        <input
                                            autoFocus
                                            value={labelDraft}
                                            onChange={(e) => setLabelDraft(e.target.value)}
                                            placeholder="Add a name for this customer"
                                            className="flex-1 rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                        <button onClick={saveLabel} className="text-emerald-400 hover:cursor-pointer">
                                            <Check className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setEditingLabel(false)}
                                            className="text-red-500 hover:cursor-pointer"
                                        >
                                            <XIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-foreground">
                                            {detail ? displayName(detail) : ''}
                                        </span>
                                        <button
                                            onClick={() => {
                                                setLabelDraft(detail?.label ?? '')
                                                setEditingLabel(true)
                                            }}
                                            className="text-muted-foreground hover:text-foreground hover:cursor-pointer"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {detailLoading ? (
                                    <p className="text-sm text-muted-foreground italic">Loading messages...</p>
                                ) : (
                                    detail?.messages.map((m) => (
                                        <div
                                            key={m.id}
                                            className={`flex ${m.fromCustomer ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div
                                                className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                                                    m.fromCustomer
                                                        ? 'bg-muted text-foreground'
                                                        : 'bg-primary text-primary-foreground'
                                                }`}
                                            >
                                                <p>{m.content}</p>
                                                <p
                                                    className={`mt-1 text-[10px] ${
                                                        m.fromCustomer ? 'text-muted-foreground' : 'text-primary-foreground/70'
                                                    }`}
                                                >
                                                    {new Date(m.createdAt).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </Card>
            </div>
        </div>
    )
}