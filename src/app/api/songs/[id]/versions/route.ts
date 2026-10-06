import { NextResponse } from 'next/server';
import { getSongVersions, restoreSongVersion, undoLastSongChange } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const versions = getSongVersions(Number(id));
    return NextResponse.json(versions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const songId = Number(id);
    const body = await request.json().catch(() => ({}));
    const { action, versionId } = body;

    if (action === 'undo') {
      const success = undoLastSongChange(songId);
      return NextResponse.json({ success });
    }

    if (action === 'restore' && versionId) {
      const success = restoreSongVersion(songId, Number(versionId));
      return NextResponse.json({ success });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
