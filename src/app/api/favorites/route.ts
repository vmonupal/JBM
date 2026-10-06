import { NextResponse } from 'next/server';
import { getFavorites, addFavorite, removeFavorite } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const userId = 1;

    const { searchParams } = new URL(request.url);
    const itemType = searchParams.get('type') || undefined;

    const favorites = getFavorites(userId, itemType);
    return NextResponse.json(favorites);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = 1;

    const body = await request.json();
    const { item_type, item_id, details } = body;

    if (!item_type || !item_id) {
      return NextResponse.json({ error: 'item_type and item_id are required' }, { status: 400 });
    }

    const success = addFavorite(userId, item_type, String(item_id), JSON.stringify(details || {}));
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = 1;

    const { searchParams } = new URL(request.url);
    const itemType = searchParams.get('type');
    const itemId = searchParams.get('id');

    if (!itemType || !itemId) {
      return NextResponse.json({ error: 'type and id are required' }, { status: 400 });
    }

    const success = removeFavorite(userId, itemType, itemId);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
