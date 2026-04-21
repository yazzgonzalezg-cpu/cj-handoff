import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createToken } from '@/lib/auth';

// POST /api/unlock
// Body: { password: string, editorName: string }
// Response: { ok: true, token: string, editorName: string, expiresAt: number }

export async function POST(request: Request) {
  try {
    const { password, editorName } = await request.json();

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ ok: false, error: 'password required' }, { status: 400 });
    }
    if (!editorName || typeof editorName !== 'string' || editorName.trim().length < 2) {
      return NextResponse.json(
        { ok: false, error: 'editor name required (min 2 chars)' },
        { status: 400 }
      );
    }

    // Verificar la contraseña comparando hashes con pgcrypto.
    // Esto se hace server-side usando una RPC o función de Postgres.
    const { data, error } = await supabaseAdmin.rpc('verify_edit_password', {
      candidate: password,
    });

    if (error || !data) {
      // Mensaje genérico para no revelar cuál parte falló
      return NextResponse.json({ ok: false, error: 'invalid credentials' }, { status: 401 });
    }

    const token = createToken(editorName.trim());
    const expiresAt = Date.now() + 2 * 60 * 60 * 1000;

    return NextResponse.json({
      ok: true,
      token,
      editorName: editorName.trim(),
      expiresAt,
    });
  } catch (err) {
    console.error('[unlock] error:', err);
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }
}
