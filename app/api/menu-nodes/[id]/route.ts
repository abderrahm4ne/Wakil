import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth()
        if (!session) return NextResponse.json(
            { success: false, error: 'UNAUTHORIZED' }, { status: 401 }
        )

        const bot = await prisma.bot.findUnique({ where: { userId: session.user.id } })
        if (!bot) return NextResponse.json(
            { success: false, error: 'BOT_NOT_FOUND' }, { status: 404 }
        )

        // Make sure MenuNode belongs to this bot
        const menuNode = await prisma.menuNode.findFirst({
            where: { id: id, botId: bot.id }
        })
        if (!menuNode) return NextResponse.json(
            { success: false, error: 'NODE_NOT_FOUND' }, { status: 404 }
        )

        await prisma.menuNode.delete({ where: { id: id } })

        return NextResponse.json({ success: true })

    } catch (err) {
        console.error('error in rule DELETE route', err)
        return NextResponse.json(
            { success: false, error: 'SERVER_ERROR' }, { status: 500 }
        )
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth()
        if (!session) return NextResponse.json(
            { success: false, error: 'UNAUTHORIZED' }, { status: 401 }
        )

        const bot = await prisma.bot.findUnique({ where: { userId: session.user.id } })
        if (!bot) return NextResponse.json(
            { success: false, error: 'BOT_NOT_FOUND' }, { status: 404 }
        )

        const menuNode = await prisma.menuNode.findFirst({
            where: { id: id, botId: bot.id }
        })
        if (!menuNode) return NextResponse.json(
            { success: false, error: 'NODE_NOT_FOUND' }, { status: 404 }
        )

        const { trigger, response, language, order } = await req.json()

        const updated = await prisma.menuNode.update({
            where: { id: id },
            data: {
                ...(trigger && { trigger }),
                ...(response && { response }),
                ...(language && { language }),
                ...(order !== undefined && { order })
            }
        })

        return NextResponse.json({ success: true, data: updated })

    } catch (err) {
        console.error('error in rule PATCH route', err)
        return NextResponse.json(
            { success: false, error: 'SERVER_ERROR' }, { status: 500 }
        )
    }
}