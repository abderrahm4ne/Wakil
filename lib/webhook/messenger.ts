import { decrypt } from "../encrypt";

export async function sendMetaReply( recipientId: string, message: string, encryptedToken: string ): Promise<void> {
    const token = decrypt(encryptedToken);

    await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${token}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            recipient: { id: recipientId },
            message: { text: message }
        })
    })
}