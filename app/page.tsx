'use client';

import { useEffect, useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { SearchBar } from '@/components/search/SearchBar';
import { EditLockBanner } from '@/components/edit/EditLockBanner';
import {
  ContextoSectionView, UsuariosSectionView, InvestigacionSectionView,
  EntornosSectionView, AcuerdosSectionView, WritingSectionView, EquipoSectionView,
} from '@/components/sections/AllSections';
import { loadAllProducts, loadProductData, type FullProductData } from '@/lib/load-data';
import type { Product } from '@/content/schema/types';

export default function HandoffPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeId, setActiveId] = useState<string>('A');
  const [data, setData] = useState<FullProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [allProductsData, setAllProductsData] = useState<Record<string, FullProductData | null>>({});

  // Cargar lista de productos al inicio
  useEffect(() => {
    loadAllProducts().then((list) => {
      setProducts(list);
      if (list.length > 0) setActiveId(list[0].id);
    });
  }, []);

  // Cargar data del producto activo
  useEffect(() => {
    if (!activeId) return;
    setLoading(true);
    loadProductData(activeId).then((d) => {
      setData(d);
      setAllProductsData((prev) => ({ ...prev, [activeId]: d }));
      setLoading(false);
    });
  }, [activeId]);

  // Construir índice de búsqueda transversal
  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return undefined;

    const results: Array<{
      productId: string; productName: string;
      sectionLabel: string; sectionKey: string; snippet: string;
    }> = [];

    Object.entries(allProductsData).forEach(([pid, pdata]) => {
      if (!pdata) return;

      const addIfMatch = (label: string, key: string, text: string) => {
        if (text.toLowerCase().includes(q)) {
          results.push({
            productId: pid,
            productName: pdata.product.name,
            sectionLabel: label,
            sectionKey: key,
            snippet: text.slice(0, 160),
          });
        }
      };

      if (pdata.contexto) {
        addIfMatch('Contexto de negocio', 'contexto',
          `${pdata.contexto.problema} ${pdata.contexto.segmento} ${pdata.contexto.respaldoYCanal}`);
      }
      pdata.arquetipos.forEach((a) =>
        addIfMatch('Usuarios y JTBD', 'usuarios',
          `${a.name} ${a.nickname} ${a.jtbd} ${a.dolor}`));
      pdata.environmentsList.forEach((e) =>
        addIfMatch('Entornos del producto', 'entornos',
          `${e.name} ${e.purpose} ${e.whenToUse}`));
      pdata.acuerdosList.forEach((ac) =>
        addIfMatch('Acuerdos', 'acuerdos', `${ac.title} ${ac.context}`));
      pdata.tonos.forEach((t) =>
        addIfMatch('Voz y UX writing', 'writing', `${t.label} ${t.description}`));
      pdata.glosario.forEach((g) =>
        addIfMatch('Voz y UX writing', 'writing',
          `${g.usar} ${g.evitar} ${g.nota}`));
      pdata.responsables.forEach((r) =>
        addIfMatch('Equipo y responsables', 'equipo',
          `${r.name} ${r.role} ${r.decisionArea} ${r.email}`));
    });

    return results;
  }, [search, allProductsData]);

  // Precargar productos no visitados cuando se empieza a buscar
  useEffect(() => {
    if (!search.trim()) return;
    products.forEach((p) => {
      if (!(p.id in allProductsData)) {
        loadProductData(p.id).then((d) =>
          setAllProductsData((prev) => ({ ...prev, [p.id]: d })));
      }
    });
  }, [search, products, allProductsData]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '100vh' }}>
      <Sidebar
        products={products}
        activeProductId={activeId}
        onSelectProduct={setActiveId}
      />

      <main style={{ padding: '20px 24px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#14142B' }}>
            {data?.product.name || '—'}
            <span style={{ color: '#C7C7D1', margin: '0 8px' }}>/</span>
            <span style={{ color: '#5A5A72', fontWeight: 500 }}>Overview</span>
          </div>
          <span style={{ fontSize: 12, color: '#8E8EA0', fontStyle: 'italic' }}>
            Revisado {data?.product.lastRevision} · {data?.product.owner}
          </span>
        </div>

        <EditLockBanner />

        <SearchBar
          value={search}
          onChange={setSearch}
          activeProductId={activeId}
          results={searchResults}
          onSelectResult={(r) => {
            setActiveId(r.productId);
            setSearch('');
          }}
        />

        {/* Vista del producto activo - se oculta durante búsqueda */}
        {!search.trim() && (
          <>
            {loading && <EmptyState title="Cargando…" />}

            {!loading && !data && <EmptyState title="Producto no encontrado" />}

            {!loading && data && (
              <>
                {data.contexto && (
                 <ContextoSectionView data={data.contexto} stats={data.contextoStats} environments={data.environmentsList} />
                )}
                {data.usuarios && (
                  <UsuariosSectionView data={data.usuarios} arquetipos={data.arquetipos} />
                )}
                {data.investigacion && (
                  <InvestigacionSectionView data={data.investigacion} />
                )}
                {data.environments && (
                  <EntornosSectionView data={data.environments} environments={data.environmentsList} />
                )}
                {data.acuerdos && (
                  <AcuerdosSectionView data={data.acuerdos} acuerdos={data.acuerdosList} />
                )}
                {data.writing && (
                  <WritingSectionView
                    data={data.writing}
                    tonos={data.tonos}
                    glosario={data.glosario}
                    examples={data.examples}
                  />
                )}
                {data.equipo && (
                  <EquipoSectionView data={data.equipo} responsables={data.responsables} />
                )}

                {/* Si no hay contenido, mostrar empty state para productos B/C */}
                {!data.contexto && !data.usuarios && (
                  <EmptyState
                    title={`${data.product.name} · Pendiente de documentar`}
                    text="Cuando tengas el contenido listo, se carga con la misma estructura de 7 secciones del Producto A."
                  />
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function EmptyState({ title, text }: { title: string; text?: string }) {
  return (
    <div
      style={{
        background: 'white',
        border: '1px dashed #E8E8ED',
        borderRadius: 14,
        padding: '40px 20px',
        textAlign: 'center',
      }}
    >
      <p style={{ fontSize: 14, fontWeight: 700, color: '#14142B', margin: '0 0 6px' }}>{title}</p>
      {text && <p style={{ fontSize: 12, color: '#8E8EA0', margin: 0, lineHeight: 1.6 }}>{text}</p>}
    </div>
  );
}
