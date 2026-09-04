export default async function conversationsPerDayCalculator(
    conversations: { createdAt: Date }[], 
    monthStart: Date, 
    now: Date): Promise<{ date: string; count: number }[]> {
    const dailyConversations = new Map<string, number>()

  for( let date = new Date(monthStart); date <= now; date.setDate(date.getDate() + 1)) {
    const key = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Algiers' }).format(date)
    dailyConversations.set(key, 0)
  }

  for (const conversation of conversations) {
    const key = conversation.createdAt.toISOString().split('T')[0]
    dailyConversations.set(key, (dailyConversations.get(key) ?? 0) + 1)
  }

  const conversationTrend = [...dailyConversations.entries()].map(
    ([date, count]) => ({
      count,
      date,
    })
  )

  return conversationTrend
}