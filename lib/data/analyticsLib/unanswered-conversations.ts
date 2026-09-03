export default async function unAnsweredConversationsCalculator(messages: { createdAt: Date; conversationId: string; fromCustomer: boolean; }[]): Promise<number>{
const lastMessageByConversation = new Map<string, { fromCustomer: boolean }>()

  for ( const message of messages) {
    lastMessageByConversation.set(message.conversationId, { fromCustomer: message.fromCustomer })
  }

  const unAnsweredConversations = Array.from(lastMessageByConversation.values()).filter(
    msg => msg.fromCustomer
  ).length
  return unAnsweredConversations
}