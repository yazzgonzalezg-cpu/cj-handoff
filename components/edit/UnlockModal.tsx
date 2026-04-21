'use client';

import { useState, useEffect } from 'react';
import { useEditSession } from './EditSessionProvider';

// ============================================================
// UnlockModal
// ============================================================
// Pide contraseña + nombre del editor.
// El nombre se recuerda en localStorage para futuras sesiones
// en el mismo navegador (solo el nombre, no la contraseña).

const NAME_STORAGE_KEY = 'handoff-last-editor-name';

export function UnlockModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { unlock } = useEditSession();
  const [password, setPassword] = useState('');
  const [editorName, setEditorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    // Precargar el último nombre usado
    try {
      const last = localStorage.getItem(NAME_STORAGE_KEY);
      if (last) setEditorName(last);
    } catch { /* ignore */ }
    setPassword('');
    setError('');
  }, [open]);

  if (!open) return null;

  async function handleSubmit() {
    if (!password || editorName.trim().length < 2) {
      setError('Completa ambos campos');
      return;
    }
    setLoading(true);
    setError('');
    const res = await unlock(password, editorName.trim());
    setLoading(false);
    if (res.ok) {
      try { localStorage.setItem(NAME_STORAGE_KEY, editorName.trim()); } catch { /* ignore */ }
      onClose();
    } else {
      setError(res.error === 'invalid credentials' ? 'Contraseña incorrecta' : 'Error al desbloquear');
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-1">Desbloquear edición</h2>
        <p className="text-xs text-gray-500 mb-5">
          Ingresa la contraseña del equipo y tu nombre para firmar los cambios.
        </p>

        <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-1.5">
          Tu nombre
        </label>
        <input
          type="text"
          value={editorName}
          onChange={(e) => setEditorName(e.target.value)}
          placeholder="Ej. Laura Méndez"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 mb-4"
          autoFocus
        />

        <label className="block text-xs uppercase tracking-wide text-gray-500 font-medium mb-1.5">
          Contraseña del equipo
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="••••••••"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500"
        />

        {error && (
          <p className="text-xs text-red-600 mt-2">{error}</p>
        )}

        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50"
            style={{ backgroundColor: '#7C3AED' }}
          >
            {loading ? 'Desbloqueando…' : 'Desbloquear'}
          </button>
        </div>

        <p className="text-[11px] text-gray-400 mt-4 leading-relaxed">
          La sesión dura 2 horas. Los cambios se registran con tu nombre y fecha.
        </p>
      </div>
    </div>
  );
}
