import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/auth'
import  { prisma } from '@/lib/prisma'

export async function GET(){
    const session = await auth()
    if (!session) return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })

    const bot = await prisma.bot.findUnique({ where: { userId: session.user.id } })
    if (!bot) return NextResponse.json({ success: false, error: 'BOT_NOT_FOUND' }, { status: 404 })

    const nodes = await prisma.menuNode.findMany({
        where: { botId: bot.id },
        orderBy: { order: 'asc' }
    })

    return NextResponse.json({ success: true, data: nodes })
}

export async function POST(req: NextRequest) {
    const session = await auth()
    if (!session) return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })

    const bot = await prisma.bot.findUnique({ where: { userId: session.user.id } })
    if (!bot) return NextResponse.json({ success: false, error: 'BOT_NOT_FOUND' }, { status: 404 })

    const { label, language, responseText, nodeType, order, parentId } = await req.json()
    if (!label || !language || !nodeType) {
        return NextResponse.json({ success: false, error: 'MISSING_FIELDS' }, { status: 400 })
    }

    if (parentId) {
        const parent = await prisma.menuNode.findFirst({ where: { id: parentId, botId: bot.id } })
        if (!parent) return NextResponse.json({ success: false, error: 'PARENT_NOT_FOUND' }, { status: 404 })
    }

    const node = await prisma.menuNode.create({
        data: { label, language, responseText, nodeType, order: order ?? 0, parentId: parentId ?? null, botId: bot.id }
    })

    return NextResponse.json({ success: true, data: node }, { status: 201 })
}