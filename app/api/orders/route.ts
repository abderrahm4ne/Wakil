import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    try {
        const session = await auth()
        if (!session) return NextResponse.json(
            { success: false, error: 'UNAUTHORIZED' }, { status: 401 }
        )

        const bot = await prisma.bot.findUnique({ where: { userId: session.user.id } })
        if (!bot) return NextResponse.json(
            { success: false, error: 'BOT_NOT_FOUND' }, { status: 404 }
        )

        const orders = await prisma.order.findMany({
            where: {
                botId: bot.id,
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ success: true, data: orders })

    } catch (err) {
        console.error('error in orders GET route', err)
        return NextResponse.json(
            { success: false, error: 'SERVER_ERROR' }, { status: 500 }
        )
    }
}