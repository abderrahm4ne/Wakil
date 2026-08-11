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

    // re-verify bot ownership (state could theoretically be old/stale)
    const bot = await prisma.bot.findUnique({ where: { id: botId } })
    if (!bot || bot.userId !== session.user.id) {
        return NextResponse.redirect(new URL('/dashboard/channels?error=FORBIDDEN', req.url))
    }

    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/channels/connect/callback`

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

        // Step 2: exchange short-lived user token -> long-lived user token (~60 days)
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

        // NOTE: if a merchant manages multiple Pages, this takes the first one.
        // For a real page-picker UI, list pagesData.data and let them choose
        // before completing the connect flow.
        const page = pagesData.data[0]
        const pageAccessToken: string = page.access_token
        const pageId: string = page.id

        let finalPageId = pageId

        // Instagram: the Page must have a linked Instagram Business Account
        if (platform === 'INSTAGRAM') {
            const igRes = await fetch(
                `https://graph.facebook.com/v21.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`
            )
            const igData = await igRes.json()

            if (!igData.instagram_business_account?.id) {
                return NextResponse.redirect(
                    new URL('/dashboard/channels?error=NO_INSTAGRAM_ACCOUNT_LINKED', req.url)
                )
            }

            finalPageId = igData.instagram_business_account.id
        }

        // Step 4: encrypt and persist
        const encryptedToken = encrypt(pageAccessToken)

        await prisma.channel.upsert({
            where: { botId_type: { botId, type: platform as 'INSTAGRAM' | 'FACEBOOK' } },
            update: {
                pageId: finalPageId,
                accessToken: encryptedToken,
                isActive: true
            },
            create: {
                botId,
                type: platform as 'INSTAGRAM' | 'FACEBOOK',
                pageId: finalPageId,
                accessToken: encryptedToken,
                isActive: true
            }
        })

        return NextResponse.redirect(new URL('/dashboard/channels?connected=true', req.url))
    } catch (err) {
        console.error('Meta OAuth callback error', err)
        return NextResponse.redirect(new URL('/dashboard/channels?error=SERVER_ERROR', req.url))
    }
}