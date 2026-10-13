import { NextResponse } from 'next/server';
import { isOwnerAuthenticated } from '@/lib/owner-auth';
import { updateSiteSettings } from '@/lib/db';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  const isAuth = await isOwnerAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized. Owner access required.' }, { status: 401 });
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    
    // Multipart form upload
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('logo') as File | null;
      if (!file || file.size === 0) {
        return NextResponse.json({ error: 'No logo file provided' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(file.name || 'logo.png') || '.png';
      const filename = `logo-${Date.now()}${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, buffer);

      const logoUrl = `/uploads/${filename}`;
      updateSiteSettings({
        logo_url: logoUrl,
        use_text_logo: false
      });

      return NextResponse.json({ success: true, logo_url: logoUrl });
    }

    // JSON base64 upload
    const body = await request.json();
    const { image_data } = body;
    if (!image_data) {
      return NextResponse.json({ error: 'Logo image data required' }, { status: 400 });
    }

    let logoUrl = image_data;
    const matches = image_data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const mime = matches[1];
      const ext = mime.includes('png') ? '.png' : mime.includes('svg') ? '.svg' : mime.includes('webp') ? '.webp' : '.jpg';
      const filename = `logo-${Date.now()}${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const buffer = Buffer.from(matches[2], 'base64');
      fs.writeFileSync(path.join(uploadDir, filename), buffer);
      logoUrl = `/uploads/${filename}`;
    }

    updateSiteSettings({
      logo_url: logoUrl,
      use_text_logo: false
    });

    return NextResponse.json({ success: true, logo_url: logoUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
