import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/encrypt'

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

    const channels = await prisma.channel.findMany({
      where: { botId: bot.id }
    })

    return NextResponse.json({ success: true, data: channels })

  } catch (err) {
    console.error(err)
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

    const { type, pageId, accessToken } = await req.json()

    if (!type || !pageId || !accessToken) return NextResponse.json(
      { success: false, error: 'MISSING_FIELDS' }, { status: 400 }
    )

    const bot = await prisma.bot.findUnique({
      where: { userId: session.user.id }
    })

    if (!bot) return NextResponse.json(
      { success: false, error: 'BOT_NOT_FOUND' }, { status: 404 }
    )

    // Encrypt accessToken before storing
    const encrypted = encrypt(accessToken)

    const channel = await prisma.channel.create({
      data: {
        type,
        pageId,
        accessToken: encrypted,
        botId: bot.id
      }
    })

    return NextResponse.json({ success: true, data: channel }, { status: 201 })

  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR' }, { status: 500 }
    )
  }
}