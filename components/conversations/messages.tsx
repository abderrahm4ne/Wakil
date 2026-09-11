import type { ConversationDetail } from '@/types/conversation'

import { ConversationMessage } from './message'

type ConversationMessagesProps = {
    conversation: ConversationDetail | null
    loading: boolean
}

export function ConversationMessages({
    conversation,
    loading,
}: ConversationMessagesProps) {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
                <div className="flex flex-col gap-3">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className={`flex ${
                                i % 2 === 0
                                    ? 'justify-start'
                                    : 'justify-end'
                            }`}
                        >
                            <div className="animate-pulse rounded-2xl bg-muted/30 h-10 w-48" />
                        </div>
                    ))}
                </div>
            ) : (
                conversation?.messages.map((message, index) => (
                    <ConversationMessage
                        key={message.id}
                        message={message}
                        customerId={conversation.customerId}
                        index={index}
                    />
                ))
            )}
        </div>
    )
}