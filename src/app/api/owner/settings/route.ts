import { NextResponse } from 'next/server';
import { isOwnerAuthenticated } from '@/lib/owner-auth';
import { getSiteSettings, updateSiteSettings, updateOwnerPasskey } from '@/lib/db';

export async function GET() {
  const isAuth = await isOwnerAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized. Owner master passkey required.' }, { status: 401 });
  }

  const settings = getSiteSettings();
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  const isAuth = await isOwnerAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized. Public users cannot modify site branding or owner settings.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      website_name,
      church_display_name,
      website_title,
      website_description,
      logo_url,
      custom_domain,
      new_passkey
    } = body;

    updateSiteSettings({
      website_name,
      church_display_name,
      website_title,
      website_description,
      logo_url,
      custom_domain
    });

    if (new_passkey && typeof new_passkey === 'string' && new_passkey.trim().length >= 6) {
      updateOwnerPasskey(new_passkey.trim());
    }

    const updated = getSiteSettings();
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
