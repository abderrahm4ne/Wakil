import { Bot } from 'lucide-react'
import { motion } from 'framer-motion'

import type {
    ConversationDetail,
    MessageItem,
} from '@/types/conversation'

type ConversationMessageProps = {
    message: MessageItem
    customerId: ConversationDetail['customerId']
    index: number
}

export function ConversationMessage({
    message,
    customerId,
    index,
}: ConversationMessageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.2,
                delay: index * 0.02,
            }}
            className={`flex items-end gap-2 ${
                message.fromCustomer
                    ? 'justify-start'
                    : 'justify-end'
            }`}
        >
            {message.fromCustomer && (
                <div className="w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 mb-1">
                    <span className="text-[9px] text-muted-foreground font-medium">
                        {customerId.slice(0, 2).toUpperCase()}
                    </span>
                </div>
            )}

            <div
                className={`max-w-[65%] ${
                    message.fromCustomer
                        ? ''
                        : 'items-end flex flex-col'
                }`}
            >
                <div
                    className={`rounded-2xl px-4 py-2.5 text-sm ${
                        message.fromCustomer
                            ? 'bg-muted text-foreground rounded-bl-sm'
                            : 'bg-secondary/15 border border-secondary/20 text-foreground rounded-br-sm'
                    }`}
                >
                    <p className="leading-relaxed">
                        {message.content}
                    </p>
                </div>

                <p className="mt-1 text-[10px] text-muted-foreground px-1">
                    {new Date(
                        message.createdAt
                    ).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
            </div>

            {!message.fromCustomer && (
                <div className="w-6 h-6 rounded-full bg-secondary/15 border border-secondary/25 flex items-center justify-center shrink-0 mb-4">
                    <Bot className="h-3 w-3 text-secondary" />
                </div>
            )}
        </motion.div>
    )
}