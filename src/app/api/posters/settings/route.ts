import { NextResponse } from 'next/server';
import { getPosterDisplaySettings, updatePosterDisplaySettings } from '@/lib/db';

export async function GET() {
  try {
    const settings = getPosterDisplaySettings();
    return NextResponse.json({ success: true, settings, ...settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const success = updatePosterDisplaySettings(body);
    if (!success) {
      return NextResponse.json({ error: 'Failed to update poster display settings' }, { status: 500 });
    }
    const updated = getPosterDisplaySettings();
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
