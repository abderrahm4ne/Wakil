import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/encrypt'

async function getBot(userId: string) {
  return prisma.bot.findUnique({ where: { userId } })
}

export async function GET() {
  try {
    const session = await auth()
    if (!session) return NextResponse.json(
      { success: false, error: 'UNAUTHORIZED' }, { status: 401 }
    )

    const bot = await getBot(session.user.id)
    if (!bot) return NextResponse.json(
      { success: false, error: 'BOT_NOT_FOUND' }, { status: 404 }
    )

    const channels = await prisma.channel.findMany({
      where: { botId: bot.id }
    })

    return NextResponse.json({ success: true, data: channels })

  } catch (err) {
    console.error('error in channel GET route',err)
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

    const bot = await getBot(session.user.id)
    if (!bot) return NextResponse.json(
      { success: false, error: 'BOT_NOT_FOUND' }, { status: 404 }
    )

    const { type, pageId, accessToken } = await req.json()

    if (!type || !pageId || !accessToken) return NextResponse.json(
      { success: false, error: 'MISSING_FIELDS' }, { status: 400 }
    )

    const channel = await prisma.channel.create({
      data: {
        type,
        pageId,
        accessToken: encrypt(accessToken),
        botId: bot.id
      }
    })

    return NextResponse.json({ success: true, data: channel }, { status: 201 })

  } catch (err) {
    console.error('error in channel POST route',err)
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR' }, { status: 500 }
    )
  }
}