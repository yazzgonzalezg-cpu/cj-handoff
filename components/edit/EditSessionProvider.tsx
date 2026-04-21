'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

// ============================================================
// Edit Session Context
// ============================================================
// Maneja el estado del modo edición en el cliente.
// El token se guarda en sessionStorage (se pierde al cerrar pestaña).
// No en localStorage porque es más seguro que el token no persista
// entre sesiones en la misma máquina compartida.

type EditSessionState = {
  unlocked: boolean;
  editorName: string;
  token: string;
  expiresAt: number;
};

type EditSessionContextValue = EditSessionState & {
  unlock: (password: string, editorName: string) => Promise<{ ok: boolean; error?: string }>;
  lock: () => void;
};

const STORAGE_KEY = 'handoff-edit-session';

const defaultState: EditSessionState = {
  unlocked: false,
  editorName: '',
  token: '',
  expiresAt: 0,
};

const EditSessionContext = createContext<EditSessionContextValue | null>(null);

export function EditSessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EditSessionState>(defaultState);

  // Hidratar desde sessionStorage al montar
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const parsed: EditSessionState = JSON.parse(stored);
      if (parsed.expiresAt > Date.now()) {
        setState({ ...parsed, unlocked: true });
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Persistir cambios
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (state.unlocked) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [state]);

  // Auto-lock cuando expira el token
  useEffect(() => {
    if (!state.unlocked) return;
    const msLeft = state.expiresAt - Date.now();
    if (msLeft <= 0) {
      setState(defaultState);
      return;
    }
    const timeout = setTimeout(() => setState(defaultState), msLeft);
    return () => clearTimeout(timeout);
  }, [state.unlocked, state.expiresAt]);

  const unlock = useCallback(
    async (password: string, editorName: string) => {
      try {
        const res = await fetch('/api/unlock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password, editorName }),
        });
        const body = await res.json();
        if (!res.ok || !body.ok) {
          return { ok: false, error: body.error || 'error' };
        }
        setState({
          unlocked: true,
          editorName: body.editorName,
          token: body.token,
          expiresAt: body.expiresAt,
        });
        return { ok: true };
      } catch (err) {
        return { ok: false, error: 'network error' };
      }
    },
    []
  );

  const lock = useCallback(() => setState(defaultState), []);

  return (
    <EditSessionContext.Provider value={{ ...state, unlock, lock }}>
      {children}
    </EditSessionContext.Provider>
  );
}

export function useEditSession() {
  const ctx = useContext(EditSessionContext);
  if (!ctx) throw new Error('useEditSession must be used inside EditSessionProvider');
  return ctx;
}
