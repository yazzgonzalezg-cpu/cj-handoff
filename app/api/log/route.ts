import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET /api/log?productId=A&limit=50
// Devuelve los cambios más recientes, ordenados por fecha desc.

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const limit = Number(searchParams.get('limit') || 50);

    let query = supabaseAdmin
      .from('change_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(Math.min(limit, 200));

    if (productId) query = query.eq('product_id', productId);

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, entries: data });
  } catch (err) {
    console.error('[log] error:', err);
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }
}
