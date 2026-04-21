'use client';

type SearchResult = {
  productId: string;
  productName: string;
  sectionLabel: string;
  sectionKey: string;
  snippet: string;
};

type Props = {
  value: string;
  onChange: (v: string) => void;
  activeProductId: string;
  results?: SearchResult[];
  onSelectResult?: (r: SearchResult) => void;
};

export function SearchBar({ value, onChange, activeProductId, results, onSelectResult }: Props) {
  const hasQuery = value.trim().length > 0;
  const current = results?.filter((r) => r.productId === activeProductId) || [];
  const other = results?.filter((r) => r.productId !== activeProductId) || [];
  const total = (results?.length) || 0;

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 mb-3">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8E8EA0" strokeWidth={2}>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar en los 3 productos — flujos, personas, secciones…"
          className="flex-1 border-none outline-none bg-transparent text-sm text-gray-900"
        />
        <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
          Búsqueda general
        </span>
      </div>

      {hasQuery && results && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-3">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium m-0 mb-2">
            {total} resultado{total !== 1 ? 's' : ''}
          </p>

          {current.length > 0 && (
            <ResultsGroup
              label="En producto activo"
              items={current}
              query={value}
              onSelect={onSelectResult}
            />
          )}
          {other.length > 0 && (
            <ResultsGroup
              label="En otros productos"
              items={other}
              query={value}
              onSelect={onSelectResult}
            />
          )}
          {total === 0 && (
            <p className="text-sm text-gray-500 m-0">Sin resultados. Prueba con otros términos.</p>
          )}
        </div>
      )}
    </div>
  );
}

function ResultsGroup({
  label,
  items,
  query,
  onSelect,
}: {
  label: string;
  items: SearchResult[];
  query: string;
  onSelect?: (r: SearchResult) => void;
}) {
  return (
    <>
      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mt-3 mb-1.5">
        {label}
      </p>
      {items.map((r, i) => (
        <button
          key={`${r.productId}-${r.sectionKey}-${i}`}
          onClick={() => onSelect?.(r)}
          className="w-full text-left px-3 py-2.5 rounded-lg bg-gray-50 hover:bg-violet-50 mb-1.5 block"
        >
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <p className="text-sm font-bold text-gray-900 m-0" dangerouslySetInnerHTML={{ __html: highlight(r.sectionLabel, query) }} />
            <span className="text-[11px] text-gray-500">{r.productName}</span>
          </div>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed m-0" dangerouslySetInnerHTML={{ __html: '…' + highlight(r.snippet, query) + '…' }} />
        </button>
      ))}
    </>
  );
}

function highlight(text: string, query: string) {
  if (!query) return escapeHtml(text);
  const escaped = escapeHtml(text);
  const q = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return escaped.replace(
    new RegExp(`(${q})`, 'gi'),
    '<mark style="background:#FEF3C7;color:#78350F;padding:0 2px;border-radius:3px">$1</mark>'
  );
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
