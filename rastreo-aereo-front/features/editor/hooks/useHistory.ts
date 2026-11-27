"use client";

import { useCallback, useState } from "react";

type History<T> = { past: T[]; present: T; future: T[] };

export function useHistory<T>(initial: T) {
  const [state, setState] = useState<History<T>>({ past: [], present: initial, future: [] });

  const commit = useCallback((next: (current: T) => T) => {
    setState((s) => ({ past: [...s.past, s.present].slice(-50), present: next(s.present), future: [] }));
  }, []);

  const undo = () =>
    setState((s) => (s.past.length ? { past: s.past.slice(0, -1), present: s.past[s.past.length - 1], future: [s.present, ...s.future] } : s));

  const redo = () =>
    setState((s) => (s.future.length ? { past: [...s.past, s.present], present: s.future[0], future: s.future.slice(1) } : s));

  return { value: state.present, commit, undo, redo, canUndo: state.past.length > 0, canRedo: state.future.length > 0 };
}
