import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getSystemPrompt } from '@/lib/bot'

const AI_PLANS = ['PRO', 'BUSINESS']

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
    console.error('error in bot GET route:', err)
    return NextResponse.json({ success: false, error: 'SERVER_ERROR' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json(
      { success: false, error: 'UNAUTHORIZED' }, { status: 401 }
    )

    const { name, languages, type, storeName, storeCity, storeContact, storeInfo } = await req.json()

    if (!name || !languages?.length || !type || !storeName || !storeCity || !storeContact) {
      return NextResponse.json({ success: false, error: 'MISSING_FIELDS' }, { status: 400 })
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id }
    })

    if (!subscription) return NextResponse.json(
      { success: false, error: 'NO_SUBSCRIPTION_FOUND' }, { status: 403 }
    )

    if (type === 'AI_POWERED' && !AI_PLANS.includes(subscription.plan)) {
      return NextResponse.json(
        { success: false, error: 'AI_POWERED_REQUIRES_PRO_OR_BUSINESS' }, { status: 403 }
      )
    }

    if (languages.includes('DARIJA') && type === 'RULE_BASED') {
      return NextResponse.json(
        { success: false, error: 'DARIJA_REQUIRES_AI_POWERED' }, { status: 403 }
      )
    }

    const existing = await prisma.bot.findUnique({ where: { userId: session.user.id } })
    if (existing) return NextResponse.json(
      { success: false, error: 'BOT_ALREADY_EXISTS' }, { status: 409 }
    )

    const systemPrompt = getSystemPrompt(storeName, storeCity, storeContact, subscription.plan, type, storeInfo)

    const bot = await prisma.bot.create({
      data: { name, languages, type, systemPrompt, storeName, storeCity, storeContact, storeInfo, userId: session.user.id }
    })

    return NextResponse.json({ success: true, data: bot }, { status: 201 })

  } catch (err) {
    console.error('error in bot POST route:', err)
    return NextResponse.json({ success: false, error: 'SERVER_ERROR' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json(
      { success: false, error: 'UNAUTHORIZED' }, { status: 401 }
    )

    const { name, languages, type, storeName, storeCity, storeContact, storeInfo } = await req.json()

    const [current, subscription] = await Promise.all([
      prisma.bot.findUnique({ where: { userId: session.user.id } }),
      prisma.subscription.findUnique({ where: { userId: session.user.id } })
    ])

    if (!current) return NextResponse.json(
      { success: false, error: 'BOT_NOT_FOUND' }, { status: 404 }
    )

    if (!subscription) return NextResponse.json(
      { success: false, error: 'NO_SUBSCRIPTION_FOUND' }, { status: 403 }
    )

    const resolvedType = type ?? current.type

    if (type && type !== current.type) {
      if (type === 'AI_POWERED' && !AI_PLANS.includes(subscription.plan)) {
        return NextResponse.json(
          { success: false, error: 'AI_POWERED_REQUIRES_PRO_OR_BUSINESS' }, { status: 403 }
        )
      }
    }

    const resolvedLanguages = languages ?? current.languages
    if (resolvedLanguages.includes('DARIJA') && resolvedType === 'RULE_BASED') {
      return NextResponse.json(
        { success: false, error: 'DARIJA_REQUIRES_AI_POWERED' }, { status: 403 }
      )
    }

    const resolvedStoreName    = storeName    ?? current.storeName    ?? ''
    const resolvedStoreCity    = storeCity    ?? current.storeCity    ?? ''
    const resolvedStoreContact = storeContact ?? current.storeContact ?? ''
    const resolvedStoreInfo    = storeInfo    !== undefined ? storeInfo : current.storeInfo

    const promptAffected = storeName || storeCity || storeContact || storeInfo !== undefined || type
    const systemPrompt = promptAffected
      ? getSystemPrompt(resolvedStoreName, resolvedStoreCity, resolvedStoreContact, subscription.plan, resolvedType, resolvedStoreInfo)
      : undefined

    const allowedUpdate: Record<string, any> = {
      ...(name          && { name }),
      ...(languages     && { languages: resolvedLanguages }),
      ...(type          && { type }),
      ...(storeName     && { storeName }),
      ...(storeCity     && { storeCity }),
      ...(storeContact  && { storeContact }),
      ...(storeInfo !== undefined && { storeInfo }),
      ...(systemPrompt  && { systemPrompt }),
    }

    if (Object.keys(allowedUpdate).length === 0) {
      return NextResponse.json({ success: false, error: 'NO_FIELDS_TO_UPDATE' }, { status: 400 })
    }

    const bot = await prisma.bot.update({
      where: { userId: session.user.id },
      data: allowedUpdate
    })

    return NextResponse.json({ success: true, data: bot })

  } catch (err) {
    console.error('error in bot PATCH route:', err)
    return NextResponse.json({ success: false, error: 'SERVER_ERROR' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const session = await auth()
    if (!session) return NextResponse.json(
      { success: false, error: 'UNAUTHORIZED' }, { status: 401 }
    )

    await prisma.bot.delete({ where: { userId: session.user.id } })

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('error in bot DELETE route:', err)
    return NextResponse.json({ success: false, error: 'SERVER_ERROR' }, { status: 500 })
  }
}