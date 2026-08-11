import { prisma } from '@/lib/prisma'
 
export async function getChannelsData(userId: string) {
    const bot = await prisma.bot.findUnique({
        where: { userId },
        include: { channels: true }
    })
 
    return {
        bot: bot ? { id: bot.id } : null,
        channels: bot?.channels ?? []
    }
}
 