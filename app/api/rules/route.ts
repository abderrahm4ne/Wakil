import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth();
        if (!session) return NextResponse.json(
            { success: false, error: 'UNAUTHORIZED' }, { status: 401 }
        )

        const bot = await prisma.bot.findUnique({
            where: { userId: session.user.id }
        })
        if (!bot) return NextResponse.json(
            { success: false, error: 'BOT_NOT_FOUND' }, { status: 404 }
        )

        const rules = await prisma.rule.findMany({
            where: { botId: bot.id },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ success: true, rules })
    }
    catch (err) {
        console.error('error in rules GET route:', err)
        return NextResponse.json(
            { success: false, error: 'SERVER_ERROR' }, { status: 500})
    }

}


export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json(
      { success: false, error: 'UNAUTHORIZED' }, { status: 401 }
    )

    const { trigger, response, language, order } = await req.json()

    if (!trigger || !response || !language) return NextResponse.json(
      { success: false, error: 'MISSING_FIELDS' }, { status: 400 }
    )

    const bot = await prisma.bot.findUnique({
      where: { userId: session.user.id }
    })

    if (!bot) return NextResponse.json(
      { success: false, error: 'BOT_NOT_FOUND' }, { status: 404 }
    )

    const rule = await prisma.rule.create({
      data: {
        trigger,
        response,
        language,
        order: order ?? 0,
        botId: bot.id
      }
    })

    return NextResponse.json({ success: true, data: rule }, { status: 201 })

  } catch (err) {
    console.error('error in rules POST route: ', err)
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR' }, { status: 500 }
    )
  }
}