import { MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export function ConversationEmptyState() {
    const { t } = useTranslation('dashboard')

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8"
        >
            <div className="p-4 rounded-2xl bg-muted/20 border border-border/50">
                <MessageSquare className="h-8 w-8 text-muted-foreground/40" />
            </div>

            <p className="text-sm text-muted-foreground font-medium">
                {t('conversations.select')}
            </p>
        </motion.div>
    )
}