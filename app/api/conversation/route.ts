import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
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

        const conversations = await prisma.conversation.findMany({
            where: { botId: bot.id },
            orderBy: { updatedAt: 'desc' },
            select: {
                id: true,
                customerId: true,
                createdAt: true,
                updatedAt: true,
                messages: {
                orderBy: { createdAt: 'desc' },
                take: 1,
                select: {
                    content: true,
                    fromCustomer: true,
                    createdAt: true
                }
                }
            }
        })

        return NextResponse.json({ success: true, data: conversations })

    } catch (err) {
        console.error('error in conversation GET route' ,err)
        return NextResponse.json(
        { success: false, error: 'SERVER_ERROR' }, { status: 500 }
        )
    }
}