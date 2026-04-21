// ============================================================
// Design Handoff · Tipos TypeScript
// ============================================================
// Refleja el esquema de Supabase.
// ============================================================

export type SectionKey =
  | 'contexto'
  | 'usuarios'
  | 'investigacion'
  | 'entornos'
  | 'acuerdos'
  | 'writing'
  | 'equipo';

export type SectionStatus = 'vigente' | 'por-revisar' | 'obsoleta';

// ------------------------------------------------------------
// Producto
// ------------------------------------------------------------
export type ProductIconKey = 'house' | 'grid' | 'phone' | 'custom';

export type Product = {
  id: string;
  name: string;
  tag: string;
  owner: string;
  version: string;
  lastRevision: string;
  color: string;           // '#7C3AED' para el highlight del tab activo
  iconKey: ProductIconKey;
  sortOrder: number;
};

// ------------------------------------------------------------
// 01 · Contexto de negocio
// ------------------------------------------------------------
export type ContextoStat = {
  label: string;
  value: string;
  sub?: string;
};

export type ContextoSection = {
  productId: string;
  lastRevision: string;
  status: SectionStatus;
  problema: string;
  segmento: string;
  stats: ContextoStat[];
  respaldoYCanal: string;
};

// ------------------------------------------------------------
// 02 · Usuarios
// ------------------------------------------------------------
export type Arquetipo = {
  id: string;
  name: string;
  nickname: string;
  ageRange: string;
  perfil: string;
  jtbd: string;
  dolor: string;
  expectativa: string;
  estilo: string;
  isPending?: boolean;     // true para los 2 placeholders pendientes
  sortOrder: number;
};

export type UsuariosSection = {
  productId: string;
  lastRevision: string;
  status: SectionStatus;
  descripcion: string;
  arquetipos: Arquetipo[];
  jtbdTransversales: string[];
  doloresCompartidos: string[];
};

// ------------------------------------------------------------
// 03 · Investigación
// ------------------------------------------------------------
export type InvestigacionSection = {
  productId: string;
  lastRevision: string;
  status: SectionStatus;
  hallazgosUsuario: string[];
  hallazgosProducto: string[];
  hipotesisValidadas: string[];
  hipotesisPorValidar: string[];
  repositorio: string;     // markdown libre con links
};

// ------------------------------------------------------------
// 04 · Entornos
// ------------------------------------------------------------
export type EnvironmentType = 'production' | 'staging' | 'research' | 'showcase';

export type Environment = {
  id: string;
  productId: string;
  type: EnvironmentType;
  name: string;
  purpose: string;
  whenToUse: string;
  link: string;
  access?: string;
  maintainerId?: string;
  lastUpdate: string;
  sortOrder: number;
};

export type EnvironmentsSection = {
  productId: string;
  lastRevision: string;
  status: SectionStatus;
  environments: Environment[];
};

// ------------------------------------------------------------
// 05 · Acuerdos
// ------------------------------------------------------------
export type AcuerdoStatus = 'acordado' | 'pendiente';

export type Acuerdo = {
  id: string;
  productId: string;
  title: string;
  status: AcuerdoStatus;
  context: string;
  sortOrder: number;
};

export type AcuerdosSection = {
  productId: string;
  lastRevision: string;
  status: SectionStatus;
  intro: string;
  acuerdos: Acuerdo[];
};

// ------------------------------------------------------------
// 06 · Voz y UX writing (nueva estructura)
// ------------------------------------------------------------
export type TonoContexto = {
  id: string;
  label: string;           // 'Landing / CTA'
  description: string;     // 'Aspiracional y directo...'
  sortOrder: number;
};

export type GlosarioEntry = {
  id: string;
  usar: string;
  evitar: string;
  nota: string;
  sortOrder: number;
};

export type CopyExample = {
  id: string;
  context: string;
  copy: string;
  sortOrder: number;
};

export type WritingSection = {
  productId: string;
  lastRevision: string;
  status: SectionStatus;
  tonosPorContexto: TonoContexto[];
  glosario: GlosarioEntry[];
  examples: CopyExample[];
  consideraciones: string;
};

// ------------------------------------------------------------
// 07 · Equipo
// ------------------------------------------------------------
export type AvatarColor = 'blue' | 'teal' | 'coral' | 'purple' | 'amber' | 'pink';

export type Responsable = {
  id: string;
  productId: string;
  name: string;
  initials: string;
  role: string;
  decisionArea: string;
  email: string;
  avatarColor: AvatarColor;
  sortOrder: number;
};

export type EquipoSection = {
  productId: string;
  lastRevision: string;
  status: SectionStatus;
  responsables: Responsable[];
};

// ------------------------------------------------------------
// Audit log
// ------------------------------------------------------------
export type EntityType =
  | 'product' | 'contexto' | 'arquetipo' | 'investigacion'
  | 'environment' | 'acuerdo' | 'writing' | 'tono'
  | 'glosario' | 'example' | 'responsable';

export type ChangeLogEntry = {
  id: string;
  productId: string;
  entityType: EntityType;
  entityId: string;
  editorName: string;
  changeSummary?: string;
  previousValue?: unknown;
  newValue?: unknown;
  createdAt: string;
};

// ------------------------------------------------------------
// Sesión de edición
// ------------------------------------------------------------
export type EditSession = {
  unlocked: boolean;
  editorName: string;
  token: string;           // JWT firmado del server
  expiresAt: number;
};

// ------------------------------------------------------------
// Catálogo de secciones
// ------------------------------------------------------------
export const SECTION_CATALOG: Record<SectionKey, {
  order: number;
  label: string;
  question: string;
}> = {
  contexto: { order: 1, label: 'Contexto de negocio', question: '¿Por qué existe este producto?' },
  usuarios: { order: 2, label: 'Usuarios y jobs to be done', question: '¿A quién le sirve y qué problema resuelve?' },
  investigacion: { order: 3, label: 'Investigación y aprendizajes', question: '¿Qué sabemos y cómo lo validamos?' },
  entornos: { order: 4, label: 'Entornos del producto', question: '¿Dónde está cada versión y para qué sirve?' },
  acuerdos: { order: 5, label: 'Acuerdos', question: '¿Qué pactó el equipo que debe sobrevivir cambios?' },
  writing: { order: 6, label: 'Voz y UX writing', question: '¿Cómo le habla este producto al usuario?' },
  equipo: { order: 7, label: 'Equipo y responsables', question: '¿Con quién hablo para qué?' },
};
