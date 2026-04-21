import { createClient } from '@supabase/supabase-js';

// Cliente admin. SOLO se usa en API routes del server.
// La service_role key bypassa RLS, por eso NUNCA se expone al cliente.
// Verificar en env.local que SUPABASE_SERVICE_ROLE_KEY exista y no esté
// en NEXT_PUBLIC_* (sino se filtra al bundle del browser).
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  }
);
