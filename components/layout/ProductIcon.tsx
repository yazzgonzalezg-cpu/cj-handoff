import { ProductIconKey } from '@/content/schema/types';

// ============================================================
// ProductIcon
// ============================================================
// Renderiza el icono correspondiente a cada producto.
// 'custom' es el placeholder hasta que el equipo mande los
// iconos específicos para Producto B y C.

export function ProductIcon({ iconKey, size = 16 }: { iconKey: ProductIconKey; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  if (iconKey === 'house') {
    return (
      <svg {...common}>
        <path d="M3 21V9l9-6 9 6v12" />
        <path d="M9 21v-6h6v6" />
        <path d="M9 12h.01" />
        <path d="M15 12h.01" />
      </svg>
    );
  }

  if (iconKey === 'grid') {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    );
  }

  if (iconKey === 'phone') {
    return (
      <svg {...common}>
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    );
  }

  // custom: placeholder neutral hasta que se reemplace
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
