import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

type CandidatePage = {
    id: string
    name: string
    channelPageId: string
    encryptedToken: string
}

export async function POST(req: NextRequest) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

    const { connectionId, pageId } = await req.json()
    if (typeof connectionId !== 'string' || typeof pageId !== 'string') {
        return NextResponse.json({ error: 'INVALID_REQUEST' }, { status: 400 })
    }

    const connection = await prisma.pendingChannelConnection.findUnique({ where: { id: connectionId } })
    if (!connection || connection.userId !== session.user.id || connection.expiresAt < new Date()) {
        return NextResponse.json({ error: 'CONNECTION_EXPIRED' }, { status: 400 })
    }

    const page = (connection.pages as CandidatePage[]).find((candidate) => candidate.id === pageId)
    if (!page) return NextResponse.json({ error: 'PAGE_NOT_FOUND' }, { status: 404 })

    await prisma.channel.upsert({
        where: { botId_type: { botId: connection.botId, type: connection.platform } },
        update: { pageId: page.channelPageId, accessToken: page.encryptedToken, isActive: true },
        create: {
            botId: connection.botId,
            type: connection.platform,
            pageId: page.channelPageId,
            accessToken: page.encryptedToken,
            isActive: true
        }
    })
    await prisma.pendingChannelConnection.delete({ where: { id: connection.id } })

    return NextResponse.json({ success: true })
}
