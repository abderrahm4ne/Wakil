"use server"

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function disconnectChannel(channelId: string) {
    const session = await auth()
    if (!session) return { error: 'UNAUTHORIZED' }

    const channel = await prisma.channel.findUnique({
        where: { id: channelId },
        include: { bot: true }
    })

    if (!channel || channel.bot.userId !== session.user.id) {
        return { error: 'NOT_FOUND' }
    }

    await prisma.channel.delete({ where: { id: channelId } })

    revalidatePath('/dashboard/channels')
    return { success: true }
}