import { NextResponse } from 'next/server';
import { isOwnerAuthenticated } from '@/lib/owner-auth';
import { resetSiteSettings } from '@/lib/db';

export async function POST() {
  const isAuth = await isOwnerAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized. Owner master passkey required.' }, { status: 401 });
  }

  try {
    const defaultSettings = resetSiteSettings();
    return NextResponse.json({ success: true, settings: defaultSettings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
