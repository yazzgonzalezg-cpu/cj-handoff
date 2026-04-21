import { createClient } from '@supabase/supabase-js';

// Cliente público (se usa en el browser).
// La anon key tiene permisos limitados: puede leer pero no escribir
// (bloqueado por RLS). Las escrituras pasan por API routes del server.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
