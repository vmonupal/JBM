import { cookies } from 'next/headers';
import crypto from 'crypto';

const OWNER_SECRET = process.env.OWNER_SESSION_SECRET || 'revival-chapel-owner-super-secure-2026-key';

export function createOwnerToken(): string {
  const payload = `owner:${Date.now()}`;
  const hmac = crypto.createHmac('sha256', OWNER_SECRET).update(payload).digest('hex');
  return `${Buffer.from(payload).toString('base64')}.${hmac}`;
}

export function verifyOwnerToken(token: string): boolean {
  try {
    const [payloadB64, hmac] = token.split('.');
    if (!payloadB64 || !hmac) return false;
    const payload = Buffer.from(payloadB64, 'base64').toString('utf8');
    const expectedHmac = crypto.createHmac('sha256', OWNER_SECRET).update(payload).digest('hex');
    if (crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac))) {
      const parts = payload.split(':');
      if (parts[0] === 'owner') {
        const time = Number(parts[1]);
        // 7 days expiration
        return Date.now() - time < 7 * 24 * 60 * 60 * 1000;
      }
    }
    return false;
  } catch (e) {
    return false;
  }
}

export async function isOwnerAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('rci_owner_session')?.value;
  if (!token) return false;
  return verifyOwnerToken(token);
}
