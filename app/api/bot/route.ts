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

    const { name, languages, type, storeName, storeCity, storeContact }  = await req.json()

    const subscription = await prisma.subscription.findUnique({
        where: { userId: session.user.id }
    })

    if (!subscription || !subscription.isActive) {
        return NextResponse.json(
          { success: false, error: 'NO_ACTIVE_SUBSCRIPTION' }, { status: 403 }  
        )
    }

    

    const languageLine = subscription?.plan === 'STARTER' || subscription?.plan === 'FREE_TRIAL'
    ? 'You communicate in Arabic and French. Always reply in the same language the customer uses.'
    : 'You communicate in Arabic, French, and Darija. Always reply in the same language the customer uses.'


    const systemPrompt = `
    You are an automated customer support assistant for ${storeName}, powered by Wakil.

    ${languageLine}

    Your responsibilities:
    - Answer frequently asked questions about products, pricing, availability, shipping, and returns
    - Take orders by collecting: product name, size/variant, full address, and phone number
    - Handle order status inquiries when the customer provides their order ID
    - Recommend products based on the customer's query

    Business information:
    - Business name: ${businessName}
    - Location: ${city}, Algeria
    - Contact: ${contactInfo}
    - ${additionalInfo}

    Rules:
    - Be concise, polite, and professional
    - Never invent information you were not given
    - If a question is outside your knowledge, say: "For more details please contact us directly at ${contactInfo}"
    - Do not discuss anything unrelated to ${businessName}
    `.trim()

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
        systemPrompt,
        storeName,
        storeCity,
        storeContact,
        userId: session.user.id
      }
    })

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

    const data = await req.json()
    const bot = await prisma.bot.update({
      where: { userId: session.user.id },
      data
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