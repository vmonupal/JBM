import { NextRequest, NextResponse } from 'next/server';

function splitIntoNaturalChunks(text: string, maxLength = 140): string[] {
  if (!text || !text.trim()) return [];
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return [clean];

  // Split on clause/sentence boundaries: . ; , : ! ? ।
  const parts = clean.match(/[^.!?;,:|।]+[.!?;,:|।]*|.+$/g) || [clean];
  const chunks: string[] = [];
  let buffer = '';

  for (const part of parts) {
    if ((buffer + ' ' + part).trim().length <= maxLength) {
      buffer = buffer ? `${buffer} ${part}` : part;
    } else {
      if (buffer.trim()) chunks.push(buffer.trim());
      if (part.trim().length <= maxLength) {
        buffer = part.trim();
      } else {
        // Break long segment by words
        const words = part.trim().split(' ');
        buffer = '';
        for (const w of words) {
          if ((buffer + ' ' + w).trim().length <= maxLength) {
            buffer = buffer ? `${buffer} ${w}` : w;
          } else {
            if (buffer.trim()) chunks.push(buffer.trim());
            buffer = w;
          }
        }
      }
    }
  }

  if (buffer.trim()) chunks.push(buffer.trim());
  return chunks.filter(c => c.length > 0);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawText = searchParams.get('text');
    const langParam = searchParams.get('lang') || 'te';

    if (!rawText || !rawText.trim()) {
      return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 });
    }

    const lang = langParam.toLowerCase().startsWith('en') ? 'en' : 'te';
    const chunks = splitIntoNaturalChunks(rawText, 130);

    if (chunks.length === 0) {
      return NextResponse.json({ error: 'Empty text content' }, { status: 400 });
    }

    // Fetch chunks in parallel for fast, low-latency synthesis
    const fetchPromises = chunks.map(async (chunk) => {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${lang}&client=tw-ob`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://translate.google.com/',
        },
      });

      if (!res.ok) {
        console.warn(`TTS fetch failed for chunk "${chunk.substring(0, 30)}..." [${res.status}]`);
        return null;
      }

      const buf = await res.arrayBuffer();
      return buf.byteLength > 0 ? Buffer.from(buf) : null;
    });

    const results = await Promise.all(fetchPromises);
    const validBuffers: Uint8Array[] = [];
    for (const item of results) {
      if (item !== null) {
        validBuffers.push(item);
      }
    }

    if (validBuffers.length === 0) {
      return NextResponse.json({ error: 'Failed to synthesize audio stream' }, { status: 502 });
    }

    const combinedBuffer = Buffer.concat(validBuffers);

    return new NextResponse(combinedBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(combinedBuffer.byteLength),
        'Cache-Control': 'public, max-age=604800, immutable',
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (error) {
    console.error('TTS API error:', error);
    return NextResponse.json({ error: 'Internal speech synthesis error' }, { status: 500 });
  }
}
