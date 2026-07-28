import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * "chat-menu"        — Demo 1: huidige situatie. Gewone zoekbalk bovenaan;
 *                       de assistent is bereikbaar via het bolletje-menu.
 * "integrated-search" — Demo 2: de zoekbalk zelf is een chat-input geworden.
 */
export type DemoMode = "chat-menu" | "integrated-search";

// Single source of truth for the demo picker — add an entry here to add a demo.
export const DEMO_MODE_OPTIONS: { value: DemoMode; label: string }[] = [
  { value: "chat-menu", label: "Demo 1 · Chatmenu" },
  { value: "integrated-search", label: "Demo 2 · AI Search" },
];

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

/**
 * Floating dropdown to switch demos. Positioned fixed at the top-left of the
 * viewport — outside the phone-frame mockup — so it never takes up space on
 * the app's own screen.
 */
export function DemoModeSwitcher() {
  const { mode, setMode } = useDemoMode();
  return (
    <div className="fixed left-3 top-3 z-50">
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value as DemoMode)}
        className="rounded-full border border-white/10 bg-slate-900/90 py-1.5 pl-3 pr-7 text-[11px] font-medium text-white shadow-lg backdrop-blur outline-none"
      >
        {DEMO_MODE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
