'use client';

import { Product } from '@/content/schema/types';
import { ProductIcon } from './ProductIcon';

type Props = {
  products: Product[];
  activeProductId: string;
  onSelectProduct: (id: string) => void;
};

const iconColors: Record<string, { bg: string; fg: string }> = {
  house: { bg: '#EEEDFE', fg: '#7C3AED' },
  grid: { bg: '#DBEAFE', fg: '#2563EB' },
  phone: { bg: '#D1FAE5', fg: '#059669' },
  custom: { bg: '#F0F0F3', fg: '#5A5A72' },
};

export function Sidebar({ products, activeProductId, onSelectProduct }: Props) {
  return (
    <aside className="bg-white border-r border-gray-200 p-3 flex flex-col gap-2" style={{ width: 220 }}>

      {/* Brand */}
      <div className="flex items-center gap-2.5 px-2 pb-4 border-b border-gray-100 mb-1">
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center"
          style={{ backgroundColor: '#EEEDFE' }}
        >
          <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: '#7C3AED' }} />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 m-0 leading-tight">Design Handoff</p>
          <p className="text-[11px] text-gray-500 mt-0.5 m-0">Suite v2.3</p>
        </div>
      </div>

      {/* Status */}
      <div
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-full text-[11px] font-medium mx-1 mb-2"
        style={{ backgroundColor: '#ECFDF5', color: '#065F46' }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#10B981' }} />
        <span>Conectado a Supabase</span>
      </div>

      {/* Productos */}
      <div className="text-[10px] uppercase tracking-wider text-gray-500 px-2.5 pt-2 pb-1 font-medium">
        Productos
      </div>

      {products.map((product) => {
        const colors = iconColors[product.iconKey] || iconColors.custom;
        const isActive = product.id === activeProductId;
        return (
          <button
            key={product.id}
            onClick={() => onSelectProduct(product.id)}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm w-full text-left ${
              isActive
                ? 'font-medium text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            style={isActive ? { backgroundColor: '#F0EEFE' } : {}}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: colors.bg, color: colors.fg }}
            >
              <ProductIcon iconKey={product.iconKey} size={16} />
            </div>
            <span className="flex-1 min-w-0 truncate">{product.name}</span>
            <span className="text-[10px] text-gray-500">{product.id}</span>
          </button>
        );
      })}
    </aside>
  );
}
