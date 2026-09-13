import { NextRequest, NextResponse } from 'next/server'
import { verifyMetaSignature } from '@/lib/webhook/verify'
import { prisma } from '@/lib/prisma'
import { Client } from '@upstash/qstash'

const qstash = new Client({
    baseUrl: process.env.QSTASH_URL,
    token: process.env.QSTASH_TOKEN!,
})

export async function GET(req: NextRequest) {
    console.log('get webhook facebook')
    const params = req.nextUrl.searchParams
    const mode = params.get('hub.mode')
    const token = params.get('hub.verify_token')
    const challenge = params.get('hub.challenge')

    if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
        return new NextResponse(challenge, { status: 200 })
    }

    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 })
}

export async function POST(req: NextRequest) {
    console.log("facebook webhook hit")
    const signature = req.headers.get('x-hub-signature-256') ?? ''
    const rawBody = await req.text()

    if (!verifyMetaSignature(rawBody, signature)) {
        return NextResponse.json({ error: 'INVALID_SIGNATURE' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true }, { status: 200 })

    const body = JSON.parse(rawBody)
    const entry = body.entry?.[0]
    const messaging = entry?.messaging?.[0]

    if (messaging) {
        const pageId = entry.id
        const senderId = messaging.sender.id
        const text = messaging.message?.text
        const mid = messaging.message?.mid

        if (text && mid) {
            const existing = await prisma.messageQueue.findUnique({
                where: { metaMessageId: mid }
            })
            
            if (!existing) {
                const channel = await prisma.channel.findFirst({
                    where: { pageId },
                    include: { bot: true }
                })

                if (!channel?.bot) return response

                await prisma.messageQueue.create({
                    data: {
                        metaMessageId: mid,
                        botId: channel.bot.id,
                        pageId,
                        senderId,
                        text,
                        status: 'PENDING'
                    }
                })
                
                await qstash.publish({
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/jobs/process-queue`,
                    delay: 0
                })
            }
        }
    }

    return response
}