import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const connectionId = req.nextUrl.searchParams.get('connection')

  if (!connectionId) {
    return NextResponse.json({ error: 'MISSING_PARAMS' })
  }

  const connection = await prisma.pendingChannelConnection.findUnique({
    where: { id: connectionId }
  })

  if (!connection) {
    return NextResponse.json({ error: 'NOT_FOUND' })
  }

  if (new Date() > connection.expiresAt) {
    return NextResponse.json({ error: 'CONNECTION_EXPIRED' })
  }

  const pages = Array.isArray(connection.pages) ? connection.pages : []
  const hasError = pages.some((p: any) => p.error)

  if (hasError) {
    return NextResponse.json({ error: 'NO_PAGES_FOUND' })
  }

  if (pages.length > 0) {
    return NextResponse.json({ ready: true })
  }

  return NextResponse.json({ ready: false })
}