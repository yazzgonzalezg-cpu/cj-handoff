'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditSession } from './EditSessionProvider';

// ============================================================
// EditableField
// ============================================================
// Componente genérico: muestra texto. Si edit mode está activo,
// al hacer clic se convierte en input editable. Al blur guarda.
// Usa el endpoint /api/save con el token de sesión.

type Props = {
  value: string;
  productId: string;
  table: string;
  entityType: string;
  entityId: string;
  field: string;              // nombre de la columna en Supabase
  multiline?: boolean;
  placeholder?: string;
  className?: string;
  renderMode?: (value: string) => React.ReactNode;  // custom render en modo lectura
};

export function EditableField({
  value,
  productId,
  table,
  entityType,
  entityId,
  field,
  multiline = false,
  placeholder = '—',
  className = '',
  renderMode,
}: Props) {
  const { unlocked, token } = useEditSession();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => setLocalValue(value), [value]);
  useEffect(() => setDraft(localValue), [localValue]);
  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      ref.current.select?.();
    }
  }, [editing]);

  async function save() {
    if (draft === localValue) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          productId,
          table,
          entityType,
          entityId,
          data: { [field]: draft },
          changeSummary: `Actualizó ${field}`,
        }),
      });
      const body = await res.json();
      if (body.ok) {
        setLocalValue(draft);
      } else {
        // Revertir en caso de error
        setDraft(localValue);
        console.error('save failed:', body.error);
      }
    } catch (err) {
      setDraft(localValue);
      console.error('save error:', err);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  }

  if (!unlocked || !editing) {
    const content = renderMode ? renderMode(localValue) : (localValue || placeholder);
    return (
      <span
        className={`${className} ${unlocked ? 'cursor-text hover:bg-amber-50 hover:outline hover:outline-1 hover:outline-amber-200 rounded px-0.5' : ''}`}
        onClick={() => unlocked && setEditing(true)}
        title={unlocked ? 'Clic para editar' : undefined}
      >
        {content}
      </span>
    );
  }

  const commonProps = {
    value: draft,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
    onBlur: save,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDraft(localValue);
        setEditing(false);
      }
      if (e.key === 'Enter' && !multiline) save();
    },
    disabled: saving,
    className: `${className} bg-white border border-violet-400 rounded px-1 py-0.5 outline-none focus:border-violet-600`,
  };

  return multiline ? (
    <textarea {...commonProps} ref={ref as any} rows={4} style={{ width: '100%', minHeight: 80 }} />
  ) : (
    <input {...commonProps} ref={ref as any} type="text" />
  );
}
