import { supabase } from './supabase';
import type {
  Product, ContextoSection, ContextoStat,
  UsuariosSection, Arquetipo,
  InvestigacionSection,
  EnvironmentsSection, Environment,
  AcuerdosSection, Acuerdo,
  WritingSection, TonoContexto, GlosarioEntry, CopyExample,
  EquipoSection, Responsable,
} from '@/content/schema/types';

// ============================================================
// Load product data
// ============================================================
// Carga todo el contenido de un producto desde Supabase.
// Se puede llamar desde un Server Component o un useEffect.
// Devuelve null si el producto no existe.

export type FullProductData = {
  product: Product;
  contexto: ContextoSection | null;
  contextoStats: ContextoStat[];
  usuarios: UsuariosSection | null;
  arquetipos: Arquetipo[];
  investigacion: InvestigacionSection | null;
  environments: EnvironmentsSection | null;
  environmentsList: Environment[];
  acuerdos: AcuerdosSection | null;
  acuerdosList: Acuerdo[];
  writing: WritingSection | null;
  tonos: TonoContexto[];
  glosario: GlosarioEntry[];
  examples: CopyExample[];
  equipo: EquipoSection | null;
  responsables: Responsable[];
};

// Mapeo de snake_case (Supabase) a camelCase (TS)
function mapProduct(r: any): Product {
  return {
    id: r.id, name: r.name, tag: r.tag, owner: r.owner,
    version: r.version, lastRevision: r.last_revision,
    color: r.color, iconKey: r.icon_key, sortOrder: r.sort_order,
  };
}

function mapContexto(r: any): ContextoSection {
  return {
    productId: r.product_id, problema: r.problema, segmento: r.segmento,
    stats: [], respaldoYCanal: r.respaldo_y_canal,
    lastRevision: r.last_revision, status: r.status,
  };
}

function mapStat(r: any): ContextoStat {
  return { label: r.label, value: r.value, sub: r.sub };
}

function mapUsuarios(r: any): UsuariosSection {
  return {
    productId: r.product_id, descripcion: r.descripcion,
    arquetipos: [],
    jtbdTransversales: r.jtbd_transversales || [],
    doloresCompartidos: r.dolores_compartidos || [],
    lastRevision: r.last_revision, status: r.status,
  };
}

function mapArquetipo(r: any): Arquetipo {
  return {
    id: r.id, name: r.name, nickname: r.nickname, ageRange: r.age_range,
    perfil: r.perfil, jtbd: r.jtbd, dolor: r.dolor,
    expectativa: r.expectativa, estilo: r.estilo,
    isPending: r.is_pending, sortOrder: r.sort_order,
  };
}

function mapInvestigacion(r: any): InvestigacionSection {
  return {
    productId: r.product_id,
    hallazgosUsuario: r.hallazgos_usuario || [],
    hallazgosProducto: r.hallazgos_producto || [],
    hipotesisValidadas: r.hipotesis_validadas || [],
    hipotesisPorValidar: r.hipotesis_por_validar || [],
    repositorio: r.repositorio,
    lastRevision: r.last_revision, status: r.status,
  };
}

function mapEnvironment(r: any): Environment {
  return {
    id: r.id, productId: r.product_id, type: r.type, name: r.name,
    purpose: r.purpose, whenToUse: r.when_to_use, link: r.link,
    access: r.access, maintainerId: r.maintainer_id,
    lastUpdate: r.last_update, sortOrder: r.sort_order,
  };
}

function mapAcuerdo(r: any): Acuerdo {
  return {
    id: r.id, productId: r.product_id, title: r.title,
    status: r.status, context: r.context, sortOrder: r.sort_order,
  };
}

function mapResponsable(r: any): Responsable {
  return {
    id: r.id, productId: r.product_id, name: r.name, initials: r.initials,
    role: r.role, decisionArea: r.decision_area, email: r.email,
    avatarColor: r.avatar_color, sortOrder: r.sort_order,
  };
}

export async function loadAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error || !data) return [];
  return data.map(mapProduct);
}

export async function loadProductData(productId: string): Promise<FullProductData | null> {
  const [
    product, contexto, stats, usuarios, arquetipos, investigacion,
    envs, envList, acuerdosS, acuerdosL, writing, tonos, glosario,
    examples, equipo, responsables,
  ] = await Promise.all([
    supabase.from('products').select('*').eq('id', productId).single(),
    supabase.from('contexto_sections').select('*').eq('product_id', productId).maybeSingle(),
    supabase.from('contexto_stats').select('*').eq('product_id', productId).order('sort_order'),
    supabase.from('usuarios_sections').select('*').eq('product_id', productId).maybeSingle(),
    supabase.from('arquetipos').select('*').eq('product_id', productId).order('sort_order'),
    supabase.from('investigacion_sections').select('*').eq('product_id', productId).maybeSingle(),
    supabase.from('environments_sections').select('*').eq('product_id', productId).maybeSingle(),
    supabase.from('environments').select('*').eq('product_id', productId).order('sort_order'),
    supabase.from('acuerdos_sections').select('*').eq('product_id', productId).maybeSingle(),
    supabase.from('acuerdos').select('*').eq('product_id', productId).order('sort_order'),
    supabase.from('writing_sections').select('*').eq('product_id', productId).maybeSingle(),
    supabase.from('tonos_contexto').select('*').eq('product_id', productId).order('sort_order'),
    supabase.from('glosario').select('*').eq('product_id', productId).order('sort_order'),
    supabase.from('copy_examples').select('*').eq('product_id', productId).order('sort_order'),
    supabase.from('equipo_sections').select('*').eq('product_id', productId).maybeSingle(),
    supabase.from('responsables').select('*').eq('product_id', productId).order('sort_order'),
  ]);

  if (!product.data) return null;

  return {
    product: mapProduct(product.data),
    contexto: contexto.data ? mapContexto(contexto.data) : null,
    contextoStats: (stats.data || []).map(mapStat),
    usuarios: usuarios.data ? mapUsuarios(usuarios.data) : null,
    arquetipos: (arquetipos.data || []).map(mapArquetipo),
    investigacion: investigacion.data ? mapInvestigacion(investigacion.data) : null,
    environments: envs.data ? { productId: envs.data.product_id, lastRevision: envs.data.last_revision, status: envs.data.status, environments: [] } : null,
    environmentsList: (envList.data || []).map(mapEnvironment),
    acuerdos: acuerdosS.data ? { productId: acuerdosS.data.product_id, intro: acuerdosS.data.intro, lastRevision: acuerdosS.data.last_revision, status: acuerdosS.data.status, acuerdos: [] } : null,
    acuerdosList: (acuerdosL.data || []).map(mapAcuerdo),
    writing: writing.data ? { productId: writing.data.product_id, tonosPorContexto: [], glosario: [], examples: [], consideraciones: writing.data.consideraciones, lastRevision: writing.data.last_revision, status: writing.data.status } : null,
    tonos: (tonos.data || []).map((r: any) => ({ id: r.id, label: r.label, description: r.description, sortOrder: r.sort_order })),
    glosario: (glosario.data || []).map((r: any) => ({ id: r.id, usar: r.usar, evitar: r.evitar, nota: r.nota, sortOrder: r.sort_order })),
    examples: (examples.data || []).map((r: any) => ({ id: r.id, context: r.context, copy: r.copy, sortOrder: r.sort_order })),
    equipo: equipo.data ? { productId: equipo.data.product_id, lastRevision: equipo.data.last_revision, status: equipo.data.status, responsables: [] } : null,
    responsables: (responsables.data || []).map(mapResponsable),
  };
}
