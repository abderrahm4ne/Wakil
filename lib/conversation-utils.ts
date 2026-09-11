type TranslationFunction = (
    key: string,
    options?: {
        count?: number
        id?: string
    }
) => string

export function timeAgo(
    dateStr: string,
    t: TranslationFunction
): string {
    const diffMs = Date.now() - new Date(dateStr).getTime()

    const mins = Math.floor(diffMs / 60000)

    if (mins < 1) {
        return t('conversations.now')
    }

    if (mins < 60) {
        return t('conversations.minutesAgo', {
            count: mins,
        })
    }

    const hours = Math.floor(mins / 60)

    if (hours < 24) {
        return t('conversations.hoursAgo', {
            count: hours,
        })
    }

    const days = Math.floor(hours / 24)

    return t('conversations.daysAgo', {
        count: days,
    })
}

export function displayName(
    conversation: {
        customerId: string
        label: string | null
    },
    t: TranslationFunction
): string {
    if (conversation.label) {
        return conversation.label
    }

    return t('conversations.name', {
        id: conversation.customerId.slice(0, 8),
    })
}