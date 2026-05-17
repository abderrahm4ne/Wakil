import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Bot } from '@prisma/client'

async function getBot(userId: string) {
    return prisma.bot.findUnique({ where: { userId } })
}

function getBotType(bot: Bot){
    if(bot?.type === 'AI_POWERED') return NextResponse.json(
      { success: false, error: 'AI_BOTS_HAVE_NO_RULES'}, { status: 400 }
    )
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
      getBotType(bot)

      const rules = await prisma.rule.findMany({
          where: { botId: bot.id },
          orderBy: { order: 'asc' }
      })

      return NextResponse.json({ success: true, data: rules })

    } catch (err) {
        console.error('error in rule GET route', err)
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
      getBotType(bot)

      const subscription = await prisma.subscription.findUnique({
        where: { userId: session.user.id }
      })

      const RULE_LIMITS: Record<string, number | null> = {
        FREE_TRIAL: 10,
        STARTER: 20,
        PRO: null,
        BUSINESS: null
      }

      const limit = RULE_LIMITS[subscription?.plan ?? 'FREE_TRIAL']
      if (limit !== null) {
        const count = await prisma.rule.count({ where: { botId: bot.id } })
        if (count >= limit) return NextResponse.json(
          { success: false, error: 'RULE_LIMIT_REACHED' }, { status: 403 }
        )
      } else {
        return NextResponse.json(
          { success: false, error: 'CANT_ADD_RULE_TO_AI_BOT'}, { status: 403 }
        )
      }

      const { trigger, response, language, order } = await req.json()

      if (!trigger || !response || !language) return NextResponse.json(
        { success: false, error: 'MISSING_FIELDS' }, { status: 400 }
      )

      const rule = await prisma.rule.create({
        data: { trigger, response, language, order: order ?? 0, botId: bot.id }
      })

      return NextResponse.json({ success: true, data: rule }, { status: 201 })

  } catch (err) {
      console.error('error in rule POST route', err)
      return NextResponse.json(
        { success: false, error: 'SERVER_ERROR' }, { status: 500 }
      )
    }
}