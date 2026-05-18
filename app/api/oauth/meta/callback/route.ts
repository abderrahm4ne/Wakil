import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/encrypt'

export async function GET(req: NextRequest){
    try {
        const params = req.nextUrl.searchParams
        const code = params.get('code')
        const state = params.get('state')
        const error = params.get('error')

        if (error) {
            return NextResponse.redirect(
                new URL('/dashboard/channels?error=PERMISSION_DENIED', req.url)
            )
        }

        const tokenRes = await fetch(
        `https://graph.facebook.com/v21.0/oauth/access_token?` +
        new URLSearchParams({
            client_id: process.env.META_APP_ID!,
            client_secret: process.env.META_APP_SECRET!,
            redirect_uri: `${process.env.NEXTAUTH_URL}/api/oauth/meta/callback`,
            code: code!
        })
        )

        const tokenData = await tokenRes.json()

        if (!tokenData.access_token) {
            return NextResponse.redirect(
                new URL('/dashboard/channels?error=TOKEN_EXCHANGE_FAILED', req.url)
            )
        } 

        const userAccessToken = tokenData.access_token

        const pagesRes = await fetch(
            `https://graph.facebook.com/v21.0/me/accounts?access_token=${userAccessToken}`
        )
        const pagesData = await pagesRes.json()

        if (!pagesData.data?.length) {
            return NextResponse.redirect(
                new URL('/dashboard/channels?error=NO_PAGES_FOUND', req.url)
            )
        }

        const bot = await prisma.bot.findUnique({
            where: { userId: state }
        })

        if (!bot) {
            return NextResponse.redirect(
                new URL('/dashboard/channels?error=BOT_NOT_FOUND', req.url)
            )
        }

        for (const page of pagesData.data) {
            const pageAccessToken = page.access_token
            const pageId = page.id

            await prisma.channel.upsert({
                where: { botId_type: { botId: bot.id, type: 'FACEBOOK' } },
                update: {
                    pageId,
                    accessToken: encrypt(pageAccessToken),
                    isActive: true
                },
                create: {
                    type: 'FACEBOOK',
                    pageId,
                    accessToken: encrypt(pageAccessToken),
                    botId: bot.id
                }
            })
        }

    return NextResponse.redirect(
        new URL('/dashboard/channels?success=true', req.url)
    )

    } catch (err) {
    console.error('error in callback route',err)
    return NextResponse.redirect(
        new URL('/dashboard/channels?error=SERVER_ERROR', req.url)
    )
    }
}