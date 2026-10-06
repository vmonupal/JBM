import { NextResponse } from 'next/server';
import { isOwnerAuthenticated } from '@/lib/owner-auth';

export async function GET() {
  const isAuth = await isOwnerAuthenticated();
  return NextResponse.json({ authenticated: isAuth });
}
