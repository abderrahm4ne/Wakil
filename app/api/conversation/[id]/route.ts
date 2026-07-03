import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth()
        if (!session) return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED' }, { status: 401 }
        )

        const bot = await prisma.bot.findUnique({
        where: { userId: session.user.id }
        })
        if (!bot) return NextResponse.json(
        { success: false, error: 'BOT_NOT_FOUND' }, { status: 404 }
        )

        const conversation = await prisma.conversation.findFirst({
        where: { id: id, botId: bot.id },
        include: {
            messages: {
            orderBy: { createdAt: 'asc' }
            }
        }
        })

        if (!conversation) return NextResponse.json(
        { success: false, error: 'CONVERSATION_NOT_FOUND' }, { status: 404 }
        )

        return NextResponse.json({ success: true, data: conversation })

    } catch (err) {
        console.error(err)
        return NextResponse.json(
        { success: false, error: 'SERVER_ERROR' }, { status: 500 }
        )
    }
}