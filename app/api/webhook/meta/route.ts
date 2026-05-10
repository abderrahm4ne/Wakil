import { NextRequest, NextResponse } from 'next/server'
import { verifyMetaSignature } from '@/lib/webhook/verify'
import { handleMetaMessage } from '@/lib/webhook/handler'

export async function GET(req: NextRequest) {
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
    const message = messaging.message?.text

    if (message) {
      handleMetaMessage(pageId, senderId, message).catch(console.error)
    }
  }

  return response
}