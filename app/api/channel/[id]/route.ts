import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// Disconnect channel
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Make sure channel belongs to this merchant's bot
    const channel = await prisma.channel.findFirst({
      where: { id: params.id, botId: bot.id }
    })

    if (!channel) return NextResponse.json(
      { success: false, error: 'CHANNEL_NOT_FOUND' }, { status: 404 }
    )

    await prisma.channel.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR' }, { status: 500 }
    )
  }
}