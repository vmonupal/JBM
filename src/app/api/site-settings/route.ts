import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/db';

export async function GET() {
  try {
    const settings = getSiteSettings();
    return NextResponse.json(settings);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
