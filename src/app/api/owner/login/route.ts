import { NextResponse } from 'next/server';
import { verifyOwnerPasskey } from '@/lib/db';
import { createOwnerToken } from '@/lib/owner-auth';

export async function POST(request: Request) {
  try {
    const { passkey } = await request.json();
    if (!passkey) {
      return NextResponse.json({ error: 'Passkey is required' }, { status: 400 });
    }

    const isValid = verifyOwnerPasskey(passkey);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid owner master passkey' }, { status: 401 });
    }

    const token = createOwnerToken();
    const response = NextResponse.json({ success: true, message: 'Owner authenticated successfully' });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: 'rci_owner_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
