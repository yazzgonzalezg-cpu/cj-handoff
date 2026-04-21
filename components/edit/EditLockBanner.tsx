'use client';

import { useState } from 'react';
import { useEditSession } from './EditSessionProvider';
import { UnlockModal } from './UnlockModal';

export function EditLockBanner() {
  const { unlocked, editorName, lock } = useEditSession();
  const [modalOpen, setModalOpen] = useState(false);

  if (unlocked) {
    return (
      <div className="rounded-[10px] border border-green-200 bg-green-50 text-green-900 px-3.5 py-2.5 flex items-center justify-between gap-3 flex-wrap mb-3.5">
        <p className="text-xs flex items-center gap-2 m-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          Modo edición activo · firmando como <strong>{editorName}</strong>
        </p>
        <button
          onClick={lock}
          className="bg-green-700 hover:bg-green-800 text-white border-none px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
        >
          Cerrar edición
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-[10px] border border-amber-200 bg-amber-50 px-3.5 py-2.5 flex items-center justify-between gap-3 flex-wrap mb-3.5">
        <p className="text-xs text-amber-900 flex items-center gap-2 m-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Modo lectura · para editar necesitas ingresar con contraseña
        </p>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white border-none px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
        >
          Desbloquear edición
        </button>
      </div>
      <UnlockModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
