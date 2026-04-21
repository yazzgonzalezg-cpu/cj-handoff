import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyToken } from '@/lib/auth';

// POST /api/save
// Body: {
//   token: string,
//   productId: string,
//   table: string,          // nombre de la tabla (whitelist más abajo)
//   entityType: string,     // 'contexto' | 'acuerdo' | etc
//   entityId: string,       // UUID de la fila, o 'new' si es insert
//   data: Record<string, any>,
//   changeSummary?: string
// }

// Whitelist de tablas editables. Nunca permitir escritura a edit_config.
const EDITABLE_TABLES = new Set([
  'products',
  'contexto_sections',
  'contexto_stats',
  'usuarios_sections',
  'arquetipos',
  'investigacion_sections',
  'environments_sections',
  'environments',
  'acuerdos_sections',
  'acuerdos',
  'writing_sections',
  'tonos_contexto',
  'glosario',
  'copy_examples',
  'equipo_sections',
  'responsables',
]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, productId, table, entityType, entityId, data, changeSummary } = body;

    // 1. Validar token
    const session = verifyToken(token);
    if (!session) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }

    // 2. Validar tabla
    if (!EDITABLE_TABLES.has(table)) {
      return NextResponse.json({ ok: false, error: 'table not editable' }, { status: 400 });
    }

    // 3. Leer el valor anterior para el audit log
    let previousValue: unknown = null;
    if (entityId !== 'new') {
      const { data: prev } = await supabaseAdmin
        .from(table)
        .select('*')
        .eq('id', entityId)
        .single();
      previousValue = prev;
    }

    // 4. Aplicar el cambio
    const payload = { ...data, updated_at: new Date().toISOString() };
    let result;
    if (entityId === 'new') {
      result = await supabaseAdmin.from(table).insert(payload).select().single();
    } else {
      result = await supabaseAdmin.from(table).update(payload).eq('id', entityId).select().single();
    }

    if (result.error) {
      console.error('[save] db error:', result.error);
      return NextResponse.json({ ok: false, error: result.error.message }, { status: 500 });
    }

    // 5. Registrar en change_log
    await supabaseAdmin.from('change_log').insert({
      product_id: productId,
      entity_type: entityType,
      entity_id: entityId === 'new' ? result.data.id : entityId,
      editor_name: session.editorName,
      change_summary: changeSummary || null,
      previous_value: previousValue,
      new_value: result.data,
    });

    return NextResponse.json({ ok: true, data: result.data });
  } catch (err) {
    console.error('[save] error:', err);
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }
}
