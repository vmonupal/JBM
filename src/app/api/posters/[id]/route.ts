import { NextResponse } from 'next/server';
import { getPoster, updatePoster, deletePoster } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const poster = getPoster(Number(id));
    if (!poster) {
      return NextResponse.json({ error: 'Poster not found' }, { status: 404 });
    }
    return NextResponse.json(poster);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const success = updatePoster(Number(id), body);
    if (!success) {
      return NextResponse.json({ error: 'Poster not found or failed to update' }, { status: 404 });
    }
    const updated = getPoster(Number(id));
    return NextResponse.json({ success: true, poster: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = deletePoster(Number(id));
    if (!success) {
      return NextResponse.json({ error: 'Poster not found or failed to delete' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
