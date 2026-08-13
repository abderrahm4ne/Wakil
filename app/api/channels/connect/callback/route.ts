import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { verifyState } from '@/lib/oauthstate'
import { encrypt } from '@/lib/encrypt'

export async function GET(req: NextRequest) {
    const session = await auth()
    if (!session) return NextResponse.redirect(new URL('/login', req.url))

    const code = req.nextUrl.searchParams.get('code')
    const state = req.nextUrl.searchParams.get('state')
    const errorParam = req.nextUrl.searchParams.get('error')

    if (errorParam) {
        return NextResponse.redirect(
            new URL(`/dashboard/channels?error=ACCESS_DENIED`, req.url)
        )
    }

    if (!code || !state) {
        return NextResponse.redirect(new URL('/dashboard/channels?error=MISSING_PARAMS', req.url))
    }

    const payload = verifyState(state)
    if (!payload) {
        return NextResponse.redirect(new URL('/dashboard/channels?error=INVALID_STATE', req.url))
    }

    if (payload.userId !== session.user.id) {
        return NextResponse.redirect(new URL('/dashboard/channels?error=FORBIDDEN', req.url))
    }

    const { botId, platform } = payload

    // re-verify bot ownership (state could be old/stale)
    const bot = await prisma.bot.findUnique({ where: { id: botId } })
    if (!bot || bot.userId !== session.user.id) {
        return NextResponse.redirect(new URL('/dashboard/channels?error=FORBIDDEN', req.url))
    }

    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/channels/connect/callback`

    try {
        // Step 1: exchange code -> short-lived user access token
        const tokenUrl = new URL('https://graph.facebook.com/v21.0/oauth/access_token')
        tokenUrl.searchParams.set('client_id', process.env.META_APP_ID!)
        tokenUrl.searchParams.set('client_secret', process.env.META_APP_SECRET!)
        tokenUrl.searchParams.set('redirect_uri', redirectUri)
        tokenUrl.searchParams.set('code', code)

        const tokenRes = await fetch(tokenUrl.toString())
        const tokenData = await tokenRes.json()

        if (!tokenRes.ok || !tokenData.access_token) {
            console.error('Meta token exchange failed', tokenData)
            return NextResponse.redirect(new URL('/dashboard/channels?error=TOKEN_EXCHANGE_FAILED', req.url))
        }

        const shortLivedToken: string = tokenData.access_token

        // Step 2: exchange short-lived user token -> long-lived user token (60 days)
        const longLivedUrl = new URL('https://graph.facebook.com/v21.0/oauth/access_token')
        longLivedUrl.searchParams.set('grant_type', 'fb_exchange_token')
        longLivedUrl.searchParams.set('client_id', process.env.META_APP_ID!)
        longLivedUrl.searchParams.set('client_secret', process.env.META_APP_SECRET!)
        longLivedUrl.searchParams.set('fb_exchange_token', shortLivedToken)

        const longLivedRes = await fetch(longLivedUrl.toString())
        const longLivedData = await longLivedRes.json()

        if (!longLivedRes.ok || !longLivedData.access_token) {
            console.error('Meta long-lived token exchange failed', longLivedData)
            return NextResponse.redirect(new URL('/dashboard/channels?error=TOKEN_EXCHANGE_FAILED', req.url))
        }

        const longLivedUserToken: string = longLivedData.access_token

        // Step 3: get the Pages this user manages, each Page has its own
        // never-expiring Page access token (as long as the user token is valid)
        const pagesRes = await fetch(
            `https://graph.facebook.com/v21.0/me/accounts?access_token=${longLivedUserToken}`
        )
        const pagesData = await pagesRes.json()

        if (!pagesRes.ok || !pagesData.data || pagesData.data.length === 0) {
            console.error('No pages found for user', pagesData)
            return NextResponse.redirect(new URL('/dashboard/channels?error=NO_PAGES_FOUND', req.url))
        }

        const candidates = await Promise.all(pagesData.data.map(async (page: {
            id: string
            name?: string
            access_token: string
        }) => {
            let channelPageId = page.id
            if (platform === 'INSTAGRAM') {
                const igRes = await fetch(
                    `https://graph.facebook.com/v21.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`
                )
                const igData = await igRes.json()
                if (!igRes.ok || !igData.instagram_business_account?.id) return null
                channelPageId = igData.instagram_business_account.id
            }

            return {
                id: page.id,
                name: page.name ?? `Page ${page.id}`,
                channelPageId,
                encryptedToken: encrypt(page.access_token)
            }
        }))
        const pages = candidates.filter((page): page is NonNullable<typeof page> => page !== null)

        if (pages.length === 0) {
            const error = platform === 'INSTAGRAM' ? 'NO_INSTAGRAM_ACCOUNT_LINKED' : 'NO_PAGES_FOUND'
            return NextResponse.redirect(new URL(`/dashboard/channels?error=${error}`, req.url))
        }

        const connection = await prisma.pendingChannelConnection.create({
            data: {
                platform: platform as 'INSTAGRAM' | 'FACEBOOK',
                pages,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                userId: session.user.id,
                botId
            }
        })

        return NextResponse.redirect(
            new URL(`/dashboard/channels/select?connection=${connection.id}`, req.url)
        )
    } catch (err) {
        console.error('Meta OAuth callback error', err)
        return NextResponse.redirect(new URL('/dashboard/channels?error=SERVER_ERROR', req.url))
    }
}
