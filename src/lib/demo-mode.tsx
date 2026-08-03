import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";

/**
 * "chat-menu"        — Demo 1: huidige situatie. Gewone zoekbalk bovenaan;
 *                       de assistent is bereikbaar via het bolletje-menu.
 * "integrated-search" — Demo 2: de zoekbalk zelf is een chat-input geworden.
 */
export type DemoMode = "chat-menu" | "integrated-search";

// Single source of truth for the demo picker — add an entry here to add a demo.
// `path` is the shareable, bookmarkable URL that forces this demo on load.
export const DEMO_MODE_OPTIONS: {
  value: DemoMode;
  label: string;
  path: string;
}[] = [
  { value: "chat-menu", label: "Demo 1 · Chatmenu", path: "/demo-1" },
  { value: "integrated-search", label: "Demo 2 · AI Search", path: "/demo-2" },
];

const STORAGE_KEY = "mp-demo-mode";

// Reverse lookup: visiting one of these paths forces that demo's mode,
// regardless of what was previously stored in localStorage.
const PATH_TO_MODE: Record<string, DemoMode> = Object.fromEntries(
  DEMO_MODE_OPTIONS.map((o) => [o.path, o.value]),
) as Record<string, DemoMode>;

type DemoModeCtx = {
  mode: DemoMode;
  setMode: (mode: DemoMode) => void;
};

const Ctx = createContext<DemoModeCtx | null>(null);

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  // A forced path (/demo-1, /demo-2) resolves identically on server and
  // client, so it's safe to use as the initial state directly. Everywhere
  // else we still start from the default on both server and first client
  // render to avoid an SSR/client hydration mismatch, and sync the stored
  // preference in afterward via effect (client-only).
  const [mode, setModeState] = useState<DemoMode>(
    PATH_TO_MODE[pathname] ?? "chat-menu",
  );

  useEffect(() => {
    const forced = PATH_TO_MODE[pathname];
    if (forced) {
      setModeState(forced);
      window.localStorage.setItem(STORAGE_KEY, forced);
      return;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "integrated-search" || stored === "chat-menu")
      setModeState(stored);
  }, [pathname]);

  const setMode = (next: DemoMode) => {
    setModeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);

    // Keep the address bar in sync so it stays a shareable link — but only
    // when already on a "home" route; don't yank the user off an item page
    // just because they flipped the demo switcher.
    const onHomeRoute = pathname === "/" || Boolean(PATH_TO_MODE[pathname]);
    const target = DEMO_MODE_OPTIONS.find((o) => o.value === next)?.path;
    if (onHomeRoute && target && target !== pathname) {
      navigate({ to: target });
    }
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
 * the app's own screen. That only holds at the `md:` breakpoint where the
 * phone-frame mockup has a gray margin around it; below that, the frame
 * fills the whole viewport and this would sit on top of real header
 * controls (e.g. the AI-search hamburger), so it's desktop-only.
 */
export function DemoModeSwitcher() {
  const { mode, setMode } = useDemoMode();
  return (
    <div className="fixed left-3 top-3 z-50 hidden md:block">
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
