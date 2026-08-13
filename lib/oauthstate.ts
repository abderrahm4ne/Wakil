import crypto from 'crypto'

const SECRET = process.env.ENCRYPTION_KEY!

type StatePayload = {
    botId: string
    platform: 'FACEBOOK' | 'INSTAGRAM'
    userId: string
    exp: number
}

export function signState(payload: Omit<StatePayload, 'exp'>): string {
    const full: StatePayload = { ...payload, exp: Date.now() + 10 * 60 * 1000 } // 10 min TTL
    const data = Buffer.from(JSON.stringify(full)).toString('base64url')
    const sig = crypto.createHmac('sha256', SECRET).update(data).digest('base64url')
    return `${data}.${sig}`
}

export function verifyState(token: string): StatePayload | null {
    const [data, sig] = token.split('.')
    if (!data || !sig) return null

    const expectedSig = crypto.createHmac('sha256', SECRET).update(data).digest('base64url')
    if (sig !== expectedSig) return null

    const payload: StatePayload = JSON.parse(Buffer.from(data, 'base64url').toString())
    if (payload.platform !== 'FACEBOOK' && payload.platform !== 'INSTAGRAM') return null
    if (Date.now() > payload.exp) return null

    return payload
}
