import { NextRequest, NextResponse } from 'next/server'
import { verifyMetaSignature } from '@/lib/webhook/verify'
import { prisma } from '@/lib/prisma'
import { Client } from '@upstash/qstash'
import { MediaType } from '@/generated/prisma/enums'

const qstash = new Client({
    baseUrl: process.env.QSTASH_URL,
    token: process.env.QSTASH_TOKEN!,
})


interface ParsedMessage {
    mid: string
    text: string | null
    mediaType: MediaType
    mediaUrl: string | null
}

function parseMessage(message: any): ParsedMessage | null {
    const mid = message?.mid

    if(!mid){
        return null
    }

    const text = message.text ?? null

    const voiceUrl = message.voice?.media.url ?? null
    const imageUrl = message.image?.media.url ?? null

    const hasVoice = Boolean(voiceUrl)
    const hasImage = Boolean(imageUrl)
    const hasText = Boolean(text)

    if (!hasText && !hasVoice && !hasImage) {
        return null
    }

    let mediaType: MediaType

    if (hasVoice && hasText) {
        mediaType = 'MIXED'
    } else if (hasImage && hasText) {
        mediaType = 'MIXED'
    } else if (hasVoice) {
        mediaType = 'VOICE'
    } else if (hasImage) {
        mediaType = 'IMAGE'
    } else {
        mediaType = 'TEXT'
    }

    return {
        mid,
        text,
        mediaType,
        mediaUrl: voiceUrl ?? imageUrl ?? null,
    }
}

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

    let body: any
    try {
        body = JSON.parse(rawBody)
    } catch {
        return NextResponse.json({ error: 'INVALID_JSON' }, { status: 400 })
    }

    const entry = body.entry?.[0]
    const messaging = entry?.messaging?.[0]

    if (!entry || !messaging) {
        return response
    }

    const pageId = entry.id
    const senderId = messaging.sender?.id

    if (!pageId || !senderId) {
        return response
    }

    const parsedMessage = parseMessage(messaging.message)

    if (!parsedMessage) {
        return response
    }

    const {
        mid,
        text,
        mediaType,
        mediaUrl,
    } = parsedMessage

    const existing = await prisma.messageQueue.findUnique({
        where: {
        metaMessageId: mid,
        },
    })

    if (existing) {
        return response
    }

    const channel = await prisma.channel.findFirst({
        where: { pageId },
        include: { bot: true }
    })

    if (!channel?.bot) {
        return response
    }

    await prisma.messageQueue.create({
        data: {
            metaMessageId: mid,
            botId: channel.bot.id,
            pageId,
            senderId,

            text,
            mediaType,
            mediaUrl,

            status: 'PENDING'
        },
    })

    await qstash.publish({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/jobs/process-queue`,
        delay: 0,
    })

    return response
}