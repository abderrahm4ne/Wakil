import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const AI_PLANS = ['PRO', 'BUSINESS']

function buildSystemPrompt(storeName: string, storeCity: string, storeContact: string, plan: string) {
  const languageLine = AI_PLANS.includes(plan)
        ? 'You communicate in Arabic, French, and Darija. Always reply in the same language the customer uses.'
        : 'You communicate in Arabic and French. Always reply in the same language the customer uses.'

  return `
  You are an automated customer support assistant for ${storeName}, powered by Wakil.

  ${languageLine}

  Your responsibilities:
      - Answer frequently asked questions about products, pricing, availability, shipping, and returns
      - Take orders by collecting: product name, size/variant, full address, and phone number
      - Handle order status inquiries when the customer provides their order ID
      - Recommend products based on the customer's query

  Business information:
      - Business name: ${storeName}
      - Location: ${storeCity}, Algeria
      - Contact: ${storeContact}

  Rules:
      - Be concise, polite, and professional
      - Never invent information you were not given
      - If a question is outside your knowledge, say: "For more details please contact us directly at ${storeContact}"
      - Do not discuss anything unrelated to ${storeName}
      `.trim()
}

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

    const { name, languages, type, storeName, storeCity, storeContact } = await req.json()

    if (!name || !languages?.length || !type || !storeName || !storeCity || !storeContact) {
      return NextResponse.json(
        { success: false, error: 'MISSING_FIELDS' }, { status: 400 }
      )
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

    const existing = await prisma.bot.findUnique({
      where: { userId: session.user.id }
    })
    if (existing) return NextResponse.json(
      { success: false, error: 'BOT_ALREADY_EXISTS' }, { status: 409 }
    )

    const systemPrompt = buildSystemPrompt(storeName, storeCity, storeContact, subscription.plan)

    const [bot] = await prisma.$transaction([
      prisma.bot.create({
        data: { name, languages, type, systemPrompt, storeName, storeCity, storeContact, userId: session.user.id }
      }),
      prisma.subscription.update({
        where: { userId: session.user.id },
        data: { isActive: true }
      })
    ])

    return NextResponse.json({ success: true, data: bot }, { status: 201 })

  } catch (err) {
    console.error('error in bot POST route:', err)
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

    const { name, languages, type, storeName, storeCity, storeContact } = await req.json()

    const allowedUpdate: Record<string, any> = {}
    if (name) allowedUpdate.name = name
    if (languages?.length) allowedUpdate.languages = languages
    if (storeName) allowedUpdate.storeName = storeName
    if (storeCity) allowedUpdate.storeCity = storeCity
    if (storeContact) allowedUpdate.storeContact = storeContact

    if (type) {
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

      allowedUpdate.type = type

      const current = await prisma.bot.findUnique({ where: { userId: session.user.id } })
      if (current) {
        allowedUpdate.systemPrompt = buildSystemPrompt(
          storeName ?? current.storeName ?? '',
          storeCity ?? current.storeCity ?? '',
          storeContact ?? current.storeContact ?? '',
          subscription.plan
        )
      }
    }

    const resolvedType = type ?? (await prisma.bot.findUnique({ where: { userId: session.user.id } }))?.type
    if (languages?.includes('DARIJA') && resolvedType === 'RULE_BASED') {
      return NextResponse.json(
        { success: false, error: 'DARIJA_REQUIRES_AI_POWERED' }, { status: 403 }
      )
    }

    const bot = await prisma.bot.update({
      where: { userId: session.user.id },
      data: allowedUpdate
    })

    return NextResponse.json({ success: true, data: bot })

  } catch (err) {
    console.error('error in bot PATCH route:', err)
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
    console.error('error in bot DELETE route:', err)
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR' }, { status: 500 }
    )
  }
}