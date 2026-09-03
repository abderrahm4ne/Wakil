export default async function averageMessagesPerConversationCalculator(messages: { createdAt: Date; conversationId: string; fromCustomer: boolean; }[], totalConversations: number): Promise<number> {
  const messageCountByConversation = new Map<string, number>()
  for (const message of messages) {
    messageCountByConversation.set(message.conversationId, (messageCountByConversation.get(message.conversationId) ?? 0) + 1)
  }

  const totalMessages = [...messageCountByConversation.values()]
    .reduce((acc, count) => acc + count, 0)

    const averageMessagesPerConversation = totalConversations > 0 ? totalMessages / totalConversations : 0

return averageMessagesPerConversation
}