import crypto from 'crypto';

export function verifyMetaSignature(
    payload: string,
    signature: string
) : boolean {
    const expected = crypto.createHash('sha256').update(payload).digest('hex');

    return `sha256=${expected}` === signature;
}