import { NextResponse } from 'next/server';
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/lib/db';

export async function GET() {
  try {
    const categories = getCategories();
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, icon } = body;
    if (!name) return NextResponse.json({ error: 'Category name is required' }, { status: 400 });

    const id = addCategory(name, description || '', icon || 'Music');
    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description } = body;
    if (!id || !name) return NextResponse.json({ error: 'ID and name required' }, { status: 400 });

    const success = updateCategory(Number(id), name, description || '');
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const success = deleteCategory(Number(id));
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
