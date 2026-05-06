import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session) return NextResponse.json(
      { success: false, error: 'UNAUTHORIZED' }, { status: 401 }
    )

    const bot = await prisma.bot.findUnique({
      where: { userId: session.user.id },
      include: { channels: true, rules: true }
    })

    return NextResponse.json({ success: true, data: bot })

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

    const { name, languages, type } = await req.json()

    if (!name || !languages?.length) return NextResponse.json(
      { success: false, error: 'MISSING_FIELDS' }, { status: 400 }
    )

    // Check if Merchant already has a bot already exists
    const existing = await prisma.bot.findUnique({
      where: { userId: session.user.id }
    })
    if (existing) return NextResponse.json(
      { success: false, error: 'BOT_ALREADY_EXISTS' }, { status: 409 }
    )

    const bot = await prisma.bot.create({
      data: {
        name,
        languages,
        type,
        userId: session.user.id
      }
    })

    return NextResponse.json({ success: true, data: bot }, { status: 201 })

  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR' }, { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json(
      { success: false, error: 'UNAUTHORIZED' }, { status: 401 }
    )

    const data = await req.json()
    const bot = await prisma.bot.update({
      where: { userId: session.user.id },
      data
    })

    return NextResponse.json({ success: true, data: bot })

  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR' }, { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const session = await auth()
    if (!session) return NextResponse.json(
      { success: false, error: 'UNAUTHORIZED' }, { status: 401 }
    )

    await prisma.bot.delete({
      where: { userId: session.user.id }
    })

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR' }, { status: 500 }
    )
  }
}