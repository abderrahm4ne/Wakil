import { NextRequest, NextResponse } from "next/server"
import { auth } from '@/auth'
import { prisma } from "@/lib/prisma"

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const session = await auth()
    if (!session) return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED' }, { status: 401 }
    )

    const bot = await prisma.bot.findUnique({ where: { userId: session.user.id } })
    if (!bot) return NextResponse.json(
        { success: false, error: 'BOT_NOT_FOUND' }, { status: 404 }
    )

    const result = await prisma.order.updateMany({
        where: { id, botId: bot.id, status: 'PENDING_REVIEW' },
        data: { status: 'CONFIRMED' }
    })

    if (result.count === 0) return NextResponse.json(
        { success: false, error: 'ORDER_NOT_FOUND_OR_ALREADY_HANDLED' }, { status: 404 }
    )

    return NextResponse.json({ success: true })
}