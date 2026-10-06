import { NextResponse } from 'next/server';
import { getSong, updateSong, deleteSong } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const song = getSong(Number(id));
    if (!song) return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    return NextResponse.json(song);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { change_summary, ...rest } = body;
    const success = updateSong(Number(id), rest, change_summary || 'Updated song details');
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const success = deleteSong(Number(id));
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
