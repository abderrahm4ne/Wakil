export default async function ResponseTimeCalculator(messages: { createdAt: Date; conversationId: string; fromCustomer: boolean; }[]): Promise<[number | null, number[]]> {
    const responseTimes: number[] = []
    const hourCounts = new Array(24).fill(0)
    let lastCustomerMsgTime: Date | null = null
    let lastConvId: string | null = null

    for (const m of messages) {
        const hour = Number(
        new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Africa/Algiers',
            hour: '2-digit',
            hour12: false,
        }).format(m.createdAt)
        )

    hourCounts[hour]++

    if (m.conversationId !== lastConvId) {
      lastCustomerMsgTime = null
      lastConvId = m.conversationId
    }

    if (m.fromCustomer) {
      lastCustomerMsgTime = m.createdAt
    } else if (lastCustomerMsgTime) {
      const diffMs = m.createdAt.getTime() - lastCustomerMsgTime.getTime()
      if (diffMs > 0 && diffMs < 1000 * 60 * 30) responseTimes.push(diffMs) // ignore >30min gaps
      lastCustomerMsgTime = null
    }
  }

  const avgResponseMs = responseTimes.length
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    : null

    return [avgResponseMs, hourCounts]
}