import { decrypt } from "../encrypt";

export async function sendMetaReply(
    recipientId: string,
    message: string,
    encryptedToken: string
): Promise<{ success: boolean; error?: string; tokenExpired?: boolean }> {
    const token = decrypt(encryptedToken)

    const res = await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            recipient: { id: recipientId },
            message: { text: message }
        })
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