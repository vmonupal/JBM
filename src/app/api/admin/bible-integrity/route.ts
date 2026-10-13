import { NextResponse } from 'next/server';
import { checkBibleIntegrity, getBibleTranslations, getBibleChapters } from '@/lib/db';

export async function GET() {
  try {
    const report = checkBibleIntegrity();
    return NextResponse.json(report);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
