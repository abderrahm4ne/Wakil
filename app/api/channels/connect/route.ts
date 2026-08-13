import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { signState } from '@/lib/oauthstate'

export async function GET(req: NextRequest) {
    const session = await auth()
    if (!session) return NextResponse.redirect(new URL('/login', req.url))

    const requestedPlatform = req.nextUrl.searchParams.get('platform')
    const botId = req.nextUrl.searchParams.get('botId')
    const platform = requestedPlatform?.toUpperCase()

    if (!platform || !botId) {
        return NextResponse.json({ error: 'MISSING_PARAMS' }, { status: 400 })
    }
    if (platform !== 'FACEBOOK' && platform !== 'INSTAGRAM') {
        return NextResponse.json({ error: 'INVALID_PLATFORM' }, { status: 400 })
    }

    // ownership check
    const bot = await prisma.bot.findUnique({ where: { id: botId } })
    if (!bot || bot.userId !== session.user.id) {
        return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 })
    }
    
    const state = signState({ botId, platform, userId: session.user.id })

    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/channels/connect/callback`
    const scopes = 'pages_show_list,pages_messaging,instagram_basic,instagram_manage_messages'
    const authUrl = new URL('https://www.facebook.com/v21.0/dialog/oauth')
    authUrl.searchParams.set('client_id', process.env.META_APP_ID!)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('state', state)
    authUrl.searchParams.set('scope', scopes)
    authUrl.searchParams.set('response_type', 'code')

    return NextResponse.redirect(authUrl.toString())
}
