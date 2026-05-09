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

    const data = await req.json()

    const bot = await prisma.bot.findUnique({
      where: { userId: session.user.id }
    })

    if (!bot) return NextResponse.json(
      { success: false, error: 'BOT_NOT_FOUND' }, { status: 404 }
    )

    const existing = await prisma.rule.findFirst({
      where: { id: params.id, botId: bot.id }
    })

    if (!existing) return NextResponse.json(
      { success: false, error: 'RULE_NOT_FOUND' }, { status: 404 }
    )

    const rule = await prisma.rule.update({
      where: { id: params.id },
      data
    })

    return NextResponse.json({ success: true, data: rule })

  } catch (err) {
    console.error('error in rules PATCH route:', err)
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

    const existing = await prisma.rule.findFirst({
      where: { id: params.id, botId: bot.id }
    })

    if (!existing) return NextResponse.json(
      { success: false, error: 'RULE_NOT_FOUND' }, { status: 404 }
    )

    await prisma.rule.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('error in rules PATCH route:', err)
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR' }, { status: 500 }
    )
  }
}