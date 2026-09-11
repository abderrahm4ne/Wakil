export type ConversationListItem = {
    id: string
    customerId: string
    label: string | null
    createdAt: string
    updatedAt: string
    messages: {
        content: string
        fromCustomer: boolean
        createdAt: string
    }[]
}

export type MessageItem = {
    id: string
    content: string
    fromCustomer: boolean
    createdAt: string
}

export type ConversationDetail = {
    id: string
    customerId: string
    label: string | null
    messages: MessageItem[]
}