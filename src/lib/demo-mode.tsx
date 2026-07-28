import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * "chat-menu"        — Demo 1: huidige situatie. Gewone zoekbalk bovenaan;
 *                       de assistent is bereikbaar via het bolletje-menu.
 * "integrated-search" — Demo 2: de zoekbalk zelf is een chat-input geworden.
 */
export type DemoMode = "chat-menu" | "integrated-search";

const STORAGE_KEY = "mp-demo-mode";

type DemoModeCtx = {
  mode: DemoMode;
  setMode: (mode: DemoMode) => void;
};

const Ctx = createContext<DemoModeCtx | null>(null);

export function DemoModeProvider({ children }: { children: ReactNode }) {
  // Always start from the default on both server and first client render to
  // avoid an SSR/client hydration mismatch; sync the stored preference in
  // afterward via effect (client-only).
  const [mode, setModeState] = useState<DemoMode>("chat-menu");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "integrated-search" || stored === "chat-menu") setModeState(stored);
  }, []);

  const setMode = (next: DemoMode) => {
    setModeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  return <Ctx.Provider value={{ mode, setMode }}>{children}</Ctx.Provider>;
}

export function useDemoMode() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDemoMode must be used within DemoModeProvider");
  return ctx;
}
