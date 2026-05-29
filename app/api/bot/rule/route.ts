import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const session = await auth()
        if (!session) return NextResponse.json(
            { success: false, error: 'UNAUTHORIZED' }, { status: 401 }
        )

        const bot = await prisma.bot.findUnique({ where: { userId: session.user.id } })
        if (!bot) return NextResponse.json(
            { success: false, error: 'BOT_NOT_FOUND' }, { status: 404 }
        )

        if (bot.type === 'AI_POWERED') return NextResponse.json(
            { success: false, error: 'AI_BOTS_HAVE_NO_RULES' }, { status: 403 }
        )

        const rules = await prisma.rule.findMany({
            where: { botId: bot.id },
            orderBy: { order: 'asc' }
        })

        return NextResponse.json({ success: true, data: rules })

    } catch (err) {
        console.error('error in rule bulk GET route', err)
        return NextResponse.json(
            { success: false, error: 'SERVER_ERROR' }, { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session) return NextResponse.json(
            { success: false, error: 'UNAUTHORIZED' }, { status: 401 }
        )

        const bot = await prisma.bot.findUnique({ where: { userId: session.user.id } })
        if (!bot) return NextResponse.json(
            { success: false, error: 'BOT_NOT_FOUND' }, { status: 404 }
        )

        if (bot.type === 'AI_POWERED') return NextResponse.json(
            { success: false, error: 'AI_BOTS_HAVE_NO_RULES' }, { status: 403 }
        )

        const { rules } = await req.json()

        if (!Array.isArray(rules)) return NextResponse.json(
            { success: false, error: 'INVALID_PAYLOAD' }, { status: 400 }
        )

        if (rules.some((r: any) => !r.trigger || !r.response || !r.language)) return NextResponse.json(
            { success: false, error: 'MISSING_FIELDS' }, { status: 400 }
        )

        // Delete all existing rules and replace with new set
        await prisma.$transaction([
            prisma.rule.deleteMany({ where: { botId: bot.id } }),
            prisma.rule.createMany({
                data: rules.map((r: any, i: number) => ({
                    trigger: r.trigger,
                    response: r.response,
                    language: r.language,
                    order: i,
                    botId: bot.id
                }))
            })
        ])

        const saved = await prisma.rule.findMany({
            where: { botId: bot.id },
            orderBy: { order: 'asc' }
        })

        return NextResponse.json({ success: true, data: saved })

    } catch (err) {
        console.error('error in rule bulk POST route', err)
        return NextResponse.json(
            { success: false, error: 'SERVER_ERROR' }, { status: 500 }
        )
    }
}