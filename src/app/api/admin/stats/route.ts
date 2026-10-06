import { NextResponse } from 'next/server';
import { getAdminStats } from '@/lib/db';

export async function GET() {
  try {
    const stats = getAdminStats();
    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
