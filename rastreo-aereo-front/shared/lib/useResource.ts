"use client";

import { useCallback, useEffect, useState } from "react";

type State<T> = { key: string; data?: T; error?: string };

export function useResource<T>(load: () => Promise<T>) {
  const [version, setVersion] = useState(0);
  const [state, setState] = useState<State<T>>({ key: "" });
  const key = `${version}`;

  useEffect(() => {
    let active = true;
    load().then(
      (data) => active && setState({ key, data }),
      (error: unknown) =>
        active && setState({ key, error: error instanceof Error ? error.message : "Error inesperado" }),
    );
    return () => {
      active = false;
    };
  }, [load, key]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  return {
    data: state.data,
    error: state.key === key ? state.error : undefined,
    isLoading: state.data === undefined && !(state.key === key && state.error),
    reload,
  };
}
