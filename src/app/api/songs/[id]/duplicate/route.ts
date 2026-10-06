import { NextResponse } from 'next/server';
import { duplicateSong } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const newId = duplicateSong(Number(id));
    if (!newId) {
      return NextResponse.json({ error: 'Song not found or duplicate failed' }, { status: 404 });
    }
    return NextResponse.json({ success: true, id: newId }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
