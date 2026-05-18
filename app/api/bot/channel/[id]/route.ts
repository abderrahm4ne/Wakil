import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
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

      const channel = await prisma.channel.findFirst({
          where: { id: params.id, botId: bot.id }
      })
      if (!channel) return NextResponse.json(
          { success: false, error: 'CHANNEL_NOT_FOUND' }, { status: 404 }
      )

      const { isActive } = await req.json()

      const updated = await prisma.channel.update({
        where: { id: params.id },
        data: { isActive }
      })

      return NextResponse.json({ success: true, data: updated })

    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { success: false, error: 'SERVER_ERROR' }, { status: 500 }
        )
    }
}

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

      // belong to user
      const channel = await prisma.channel.findFirst({
          where: { id: params.id, botId: bot.id }
      })
      if (!channel) return NextResponse.json(
          { success: false, error: 'CHANNEL_NOT_FOUND' }, { status: 404 }
      )

      await prisma.channel.delete({ where: { id: params.id } })

      return NextResponse.json({ success: true })

    } catch (err) {
        console.error('error in DELETE channel by id route', err)
        return NextResponse.json(
            { success: false, error: 'SERVER_ERROR' }, { status: 500 }
        )
    }
}