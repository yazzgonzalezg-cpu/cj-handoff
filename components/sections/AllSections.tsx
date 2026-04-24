'use client';

import { SectionCard } from './SectionCard';
import { EditableField } from '../edit/EditableField';
import { useEditSession } from '../edit/EditSessionProvider';
import type {
  ContextoSection, ContextoStat,
  UsuariosSection, Arquetipo,
  InvestigacionSection,
  EnvironmentsSection, Environment,
  AcuerdosSection, Acuerdo,
  WritingSection, TonoContexto, GlosarioEntry, CopyExample,
  EquipoSection, Responsable,
} from '@/content/schema/types';

// ============================================================
// 01 · Contexto de negocio
// ============================================================
export function ContextoSectionView({ data, stats }: { data: ContextoSection; stats: ContextoStat[] }) {
  return (
    <SectionCard number="01" title="Contexto de negocio" question="¿Por qué existe este producto?" lastRevision={data.lastRevision}>
      <div className="grid gap-2.5 mb-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div className="bg-gray-50 rounded-[10px] px-4 py-3.5">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium m-0 mb-2">Problema que resuelve</p>
          <EditableField
            value={data.problema}
            productId={data.productId}
            table="contexto_sections"
            entityType="contexto"
            entityId={data.productId}
            field="problema"
            multiline
            className="text-sm text-gray-900 leading-relaxed"
          />
        </div>
        <div className="bg-gray-50 rounded-[10px] px-4 py-3.5">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium m-0 mb-2">Segmento primario</p>
          <EditableField
            value={data.segmento}
            productId={data.productId}
            table="contexto_sections"
            entityType="contexto"
            entityId={data.productId}
            field="segmento"
            multiline
            className="text-sm text-gray-900 leading-relaxed"
          />
        </div>
      </div>

      <div className="grid gap-2 mb-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
      {stats.map((s, i) => (
  <div key={`${s.label}-${i}`} className="bg-gray-50 rounded-[10px] px-3.5 py-3">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium m-0 mb-1">{s.label}</p>
            <p className="text-lg font-bold text-gray-900 m-0">
              {s.value}
              {s.sub && <span className="text-[10px] text-gray-500 font-normal ml-1">{s.sub}</span>}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-[10px] px-4 py-3.5">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium m-0 mb-2">Respaldo y canal</p>
        <EditableField
          value={data.respaldoYCanal}
          productId={data.productId}
          table="contexto_sections"
          entityType="contexto"
          entityId={data.productId}
          field="respaldo_y_canal"
          multiline
          className="text-sm text-gray-900 leading-relaxed"
        />
      </div>
    </SectionCard>
  );
}

// ============================================================
// 02 · Usuarios
// ============================================================
export function UsuariosSectionView({ data, arquetipos }: { data: UsuariosSection; arquetipos: Arquetipo[] }) {
  return (
    <SectionCard number="02" title="Usuarios y jobs to be done" question="¿A quién le sirve y qué problema resuelve?" lastRevision={data.lastRevision}>
      <p className="text-sm text-gray-600 leading-relaxed m-0 mb-3">{data.descripcion}</p>

      <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {arquetipos.map((a) => (
          <div
            key={a.id}
            className={`rounded-[10px] p-3.5 ${a.isPending ? 'border border-dashed border-amber-400 bg-amber-50' : 'bg-gray-50'}`}
          >
            <p className="text-[13px] font-bold text-gray-900 m-0">{a.name}</p>
            <p className={`text-[10px] uppercase tracking-wider mt-0.5 m-0 mb-2 font-medium ${a.isPending ? 'text-amber-700' : 'text-violet-600'}`}>
              {a.nickname} {a.ageRange && !a.isPending && `· ${a.ageRange}`}
            </p>
            {a.isPending ? (
              <p className="text-xs text-gray-500 m-0">TODO: agregar perfil</p>
            ) : (
              <>
                {a.perfil && (
                  <p className="text-xs text-gray-600 leading-relaxed m-0 mb-1.5">
                    <strong className="text-gray-900 font-medium">Perfil:</strong> {a.perfil}
                  </p>
                )}
                <p className="text-xs text-gray-600 leading-relaxed m-0 mb-1.5">
                  <strong className="text-gray-900 font-medium">JTBD:</strong> {a.jtbd}
                </p>
                <p className="text-xs text-gray-600 leading-relaxed m-0 mb-1.5">
                  <strong className="text-gray-900 font-medium">Dolor:</strong> {a.dolor}
                </p>
                {a.expectativa && (
                  <p className="text-xs text-gray-600 leading-relaxed m-0 mb-1.5">
                    <strong className="text-gray-900 font-medium">Expectativa:</strong> {a.expectativa}
                  </p>
                )}
                {a.estilo && (
                  <p className="text-xs text-gray-600 leading-relaxed m-0">
                    <strong className="text-gray-900 font-medium">Estilo:</strong> {a.estilo}
                  </p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ============================================================
// 03 · Investigación
// ============================================================
export function InvestigacionSectionView({ data }: { data: InvestigacionSection }) {
  return (
    <SectionCard number="03" title="Investigación y aprendizajes" question="¿Qué sabemos y cómo lo validamos?" lastRevision={data.lastRevision}>
      <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <BulletBlock label="Hallazgos sobre el usuario" items={data.hallazgosUsuario} />
        <BulletBlock label="Hipótesis validadas" items={data.hipotesisValidadas} />
      </div>
    </SectionCard>
  );
}

function BulletBlock({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="bg-gray-50 rounded-[10px] px-4 py-3.5">
      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium m-0 mb-2">{label}</p>
      <ul className="m-0 pl-4 text-xs text-gray-700 leading-relaxed space-y-1">
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}

// ============================================================
// 04 · Entornos
// ============================================================
const envTagColors: Record<string, string> = {
  production: '#059669',
  staging: '#D97706',
  research: '#2563EB',
  showcase: '#7C3AED',
};
const envLabels: Record<string, string> = {
  production: 'Producción',
  staging: 'Staging',
  research: 'Research',
  showcase: 'Showcase',
};

export function EntornosSectionView({ data, environments }: { data: EnvironmentsSection; environments: Environment[] }) {
  return (
    <SectionCard number="04" title="Entornos del producto" question="¿Dónde está cada versión y para qué sirve?" lastRevision={data.lastRevision}>
      <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        {environments.map((env) => (
          <div key={env.id} className="bg-gray-50 rounded-[10px] px-3.5 py-3">
            <p className="text-[10px] uppercase tracking-wider font-medium m-0" style={{ color: envTagColors[env.type] }}>
              ● {envLabels[env.type]}
            </p>
            <p className="text-[13px] font-bold text-gray-900 m-0 mt-1 mb-1.5">{env.name}</p>
            <p className="text-[11px] text-gray-600 leading-relaxed m-0 mb-2">{env.purpose}</p>
            {env.link ? (
              <a href={env.link} target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium" style={{ color: '#7C3AED' }}>
                Abrir ↗
              </a>
            ) : (
              <p className="text-[10px] text-amber-700 font-medium m-0">TODO: URL pendiente</p>
            )}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ============================================================
// 05 · Acuerdos
// ============================================================
export function AcuerdosSectionView({ data, acuerdos }: { data: AcuerdosSection; acuerdos: Acuerdo[] }) {
  return (
    <SectionCard number="05" title="Acuerdos" question="¿Qué pactó el equipo que debe sobrevivir cambios?" lastRevision={data.lastRevision}>
      <p className="text-xs text-gray-500 italic m-0 mb-3">{data.intro}</p>
      {acuerdos.map((ac) => (
        <div
          key={ac.id}
          className="border border-gray-200 rounded-xl px-3.5 py-3 mb-2"
          style={{ borderLeftWidth: 4, borderLeftColor: ac.status === 'acordado' ? '#10B981' : '#D97706' }}
        >
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="text-[13px] font-bold text-gray-900 m-0">{ac.title}</p>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: ac.status === 'acordado' ? '#ECFDF5' : '#FEF3C7',
                color: ac.status === 'acordado' ? '#065F46' : '#92400E',
              }}
            >
              {ac.status === 'acordado' ? 'Acordado' : 'Pendiente'}
            </span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed m-0">{ac.context}</p>
        </div>
      ))}
    </SectionCard>
  );
}

// ============================================================
// 06 · Voz y UX writing
// ============================================================
export function WritingSectionView({
  data, tonos, glosario, examples,
}: {
  data: WritingSection; tonos: TonoContexto[]; glosario: GlosarioEntry[]; examples: CopyExample[];
}) {
  return (
    <SectionCard number="06" title="Voz y UX writing" question="¿Cómo le habla este producto al usuario?" lastRevision={data.lastRevision}>
      {/* Tono por contexto */}
      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium m-0 mb-2.5">Tono por contexto</p>
      <div className="grid gap-2.5 mb-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {tonos.map((t) => (
          <div key={t.id} className="bg-gray-50 rounded-[10px] px-4 py-3.5">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium m-0 mb-2">{t.label}</p>
            <p className="text-[13px] text-gray-900 leading-relaxed m-0">{t.description}</p>
          </div>
        ))}
      </div>

      {/* Glosario */}
      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium m-0 mb-2.5">Glosario del producto</p>
      <div className="bg-white border border-gray-200 rounded-[10px] overflow-hidden mb-3">
        <div className="grid grid-cols-[22%_28%_1fr] text-[10px] uppercase tracking-wider text-gray-500 font-medium px-3.5 py-2.5 bg-gray-50 border-b border-gray-200">
          <div>Usar</div>
          <div>Evitar</div>
          <div>Nota</div>
        </div>
        {glosario.map((g) => (
          <div key={g.id} className="grid grid-cols-[22%_28%_1fr] text-[13px] px-3.5 py-3 border-b border-gray-100 last:border-b-0 items-center">
            <div className="font-bold" style={{ color: '#059669' }}>{g.usar}</div>
            <div className="text-red-600 line-through">{g.evitar}</div>
            <div className="text-gray-600 leading-relaxed">{g.nota}</div>
          </div>
        ))}
      </div>

      {/* Ejemplos */}
      {examples.length > 0 && (
        <>
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium m-0 mb-2.5 mt-3">Ejemplos de copy vigente</p>
          <div className="bg-gray-50 rounded-[10px] px-4 py-3 text-xs">
            {examples.map((ex) => (
              <div key={ex.id} className="grid grid-cols-[35%_1fr] py-1.5 border-b border-gray-200 last:border-b-0">
                <div className="text-gray-500 font-medium">{ex.context}</div>
                <div className="text-gray-900">{ex.copy}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </SectionCard>
  );
}

// ============================================================
// 07 · Equipo
// ============================================================
const avatarColorMap: Record<string, { bg: string; fg: string }> = {
  blue: { bg: '#DBEAFE', fg: '#1E40AF' },
  teal: { bg: '#D1FAE5', fg: '#065F46' },
  coral: { bg: '#FEE2E2', fg: '#991B1B' },
  purple: { bg: '#EEEDFE', fg: '#7C3AED' },
  amber: { bg: '#FEF3C7', fg: '#92400E' },
  pink: { bg: '#FCE7F3', fg: '#9F1239' },
};

export function EquipoSectionView({ data, responsables }: { data: EquipoSection; responsables: Responsable[] }) {
  return (
    <SectionCard number="07" title="Equipo y responsables" question="¿Con quién hablo para qué?" lastRevision={data.lastRevision}>
      <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {responsables.map((p) => {
          const colors = avatarColorMap[p.avatarColor] || avatarColorMap.blue;
          return (
            <div key={p.id} className="bg-gray-50 rounded-[10px] p-3 flex gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{ backgroundColor: colors.bg, color: colors.fg }}
              >
                {p.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 m-0">{p.name}</p>
                <p className="text-[11px] text-gray-600 mt-0.5 m-0 mb-1">{p.role || 'TODO: rol pendiente'}</p>
                {p.decisionArea && (
                  <p className="text-[10px] text-gray-500 leading-relaxed m-0 mb-1.5">{p.decisionArea}</p>
                )}
                <EmailRow email={p.email} />
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

function EmailRow({ email }: { email: string }) {
  const handleCopy = () => {
    if (email && navigator.clipboard) {
      navigator.clipboard.writeText(email);
    }
  };

  if (!email) {
    return <p className="text-[10px] text-amber-700 font-medium m-0">TODO: correo pendiente</p>;
  }

  return (
    <div className="flex items-center gap-1 text-[11px]">
      <span className="truncate flex-1 min-w-0" style={{ color: '#7C3AED' }}>{email}</span>
      <button
        onClick={handleCopy}
        className="text-[10px] px-1.5 py-0.5 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
      >
        Copiar
      </button>
    </div>
  );
}
