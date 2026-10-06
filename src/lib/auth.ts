import jwt from 'jsonwebtoken';
import { User } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'revival-chapel-divine-secret-key-2026';

export interface AuthPayload {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'member';
}

export function createToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch (err) {
    return null;
  }
}

export function getSessionUser(request: Request): AuthPayload | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/rci_token=([^;]+)/);
  if (!match) return null;
  return verifyToken(match[1]);
}
