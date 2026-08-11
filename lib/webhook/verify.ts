import crypto from 'crypto';

export function verifyMetaSignature(
    payload: string,
    signature: string
) : boolean {
    const expected = crypto.createHmac('sha256', process.env.META_APP_SECRET!).update(payload).digest('hex');

    return `sha256=${expected}` === signature;
}