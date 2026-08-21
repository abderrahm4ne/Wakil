import { decrypt } from "../encrypt";

export async function sendMetaReply(
    recipientId: string,
    message: string,
    encryptedToken: string,
    options?: { quickReplies?: { title: string; payload: string }[] }
): Promise<{ success: boolean; error?: string; tokenExpired?: boolean }> {
    const token = decrypt(encryptedToken)
    console.log(recipientId, message)
    const body: any = {
        recipient: { id: recipientId },
        message: { text: message }
    }

    if (options?.quickReplies?.length) {
        body.message.quick_replies = options.quickReplies.map(qr => ({
            content_type: 'text',
            title: qr.title.slice(0, 20),
            payload: qr.payload
        }))
    }

    const res = await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })

    if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        const code = errBody?.error?.code
        return {
            success: false,
            error: errBody?.error?.message ?? `HTTP ${res.status}`,
            tokenExpired: code === 190
        }
    }

    return { success: true }
}