import {
  Search,
  Home,
  MessagesSquare,
  Camera,
  Bell,
  CircleUser,
  Sparkles,
  Plus,
  ArrowUp,
  Menu,
  Tag,
  Heart,
  Gavel,
  Bookmark,
  Store,
  History,
  LogOut,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { NAV_MODE } from "@/lib/layout-settings";
import { useChat } from "@/lib/chat-store";
import { useDemoMode } from "@/lib/demo-mode";
import { useAccountMenu } from "@/lib/account-menu";
import { usePuurMarktplaats } from "@/lib/puur-marktplaats";

// Same blue as the item-page action buttons (--primary), given the ChatGPT-style
// glossy pill treatment below — a Marktplaats-toned take on that look.
const plusButtonClass =
  "bg-gradient-to-b from-[oklch(0.6_0.13_250)] to-[oklch(0.46_0.13_250)] text-white shadow-[0_2px_4px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.35)] active:scale-95";

type Completion = {
  completion: string;
  categoryName?: string;
  parentName?: string;
};

function buildSearchUrl(term: string) {
  const slug = term.trim().replace(/\s+/g, "+");
  return `https://www.marktplaats.nl/q/${encodeURIComponent(slug).replace(/%2B/g, "+")}/#postcode:1053HE|view:gallery-view`;
}

export function IntegratedSearchBar() {
  const { open } = useChat();
  return (
    <button
      type="button"
      onClick={open}
      className="flex w-full items-center gap-2 rounded-md bg-white px-2 py-2 text-left shadow-[0_1px_2px_rgba(0,0,0,0.06)] active:scale-[0.99]"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-500 text-white">
        <Plus className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1 truncate text-[14px] leading-[18px] text-muted-foreground">
        Chat met je Marktplaatsassistent
      </span>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
        <ArrowUp className="h-4 w-4" strokeWidth={2.75} />
      </span>
    </button>
  );
}

export function MpHeader() {
  const { mode } = useDemoMode();
  const { toggle: toggleAccountMenu } = useAccountMenu();
  const { show: showPuurMarktplaats } = usePuurMarktplaats();
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState<Completion[]>([]);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const term = q.trim();
    if (!term) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const controller = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/public/suggestions?prefix=${encodeURIComponent(term)}`,
          { signal: controller.signal },
        );
        if (!res.ok) return;
        const data = (await res.json()) as { completions?: Completion[] };
        setSuggestions(data.completions ?? []);
        setOpen(true);
      } catch {
        /* ignore */
      }
    }, 120);
    return () => {
      controller.abort();
      clearTimeout(t);
    };
  }, [q]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    window.location.href = buildSearchUrl(q);
  };

  const pick = (term: string) => {
    window.location.href = buildSearchUrl(term);
  };

  const showDropdown = open && focused && suggestions.length > 0;

  return (
    <header className="sticky top-0 z-30 bg-[#f5b48a]">
      <div ref={wrapRef} className="relative px-3 py-3">
        <div className={`flex items-center gap-2 ${mode === "integrated-search" ? "justify-between" : ""}`}>
          {mode === "integrated-search" && (
            <div className="flex min-w-0 shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={toggleAccountMenu}
                aria-label="Menu"
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${plusButtonClass}`}
              >
                <Menu className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={showPuurMarktplaats}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-semibold ${plusButtonClass}`}
              >
                <Sparkles className="h-3.5 w-3.5" fill="currentColor" />
                Puur Marktplaats
              </button>
            </div>
          )}
          {mode === "chat-menu" && (
            <form onSubmit={submit} className="min-w-0 flex-1">
              <div className="flex items-center gap-2 rounded-md bg-white px-3 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onFocus={() => {
                    setFocused(true);
                    if (suggestions.length) setOpen(true);
                  }}
                  onBlur={() => setTimeout(() => setFocused(false), 150)}
                  type="search"
                  enterKeyHint="search"
                  className="w-full bg-transparent text-[14px] leading-[18px] outline-none placeholder:text-muted-foreground"
                  placeholder="Zoek in Marktplaats"
                />
              </div>
            </form>
          )}
          {NAV_MODE === "assistant" && (
            <button
              type="button"
              aria-label="Meldingen"
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground/85 active:scale-95"
            >
              <Bell className="h-[22px] w-[22px]" strokeWidth={1.9} />
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
                3
              </span>
            </button>
          )}
        </div>

        {showDropdown && (
          <ul className="absolute inset-x-3 top-full mt-1 max-h-[60vh] overflow-y-auto rounded-md border border-border bg-white py-1 shadow-lg">
            {suggestions.map((s, i) => (
              <li key={`${s.completion}-${i}`}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pick(s.completion);
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-muted"
                >
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate text-[14px] leading-[18px] text-foreground">
                    {s.completion}
                  </span>
                  {s.categoryName && (
                    <span className="shrink-0 text-[12px] leading-[16px] text-muted-foreground">
                      in {s.categoryName}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}

export function MpBottomNav() {
  const { open } = useChat();
  const items = [
    { key: "home", icon: Home, label: "Home", active: true, to: "/" },
    { key: "berichten", icon: MessagesSquare, label: "Berichten" },
    { key: "plaatsen", icon: Camera, label: "Plaatsen" },
    { key: "meldingen", icon: Bell, label: "Meldingen" },
    { key: "mijn", icon: CircleUser, label: "Mijn Marktplaats", small: true },
  ];
  return (
    <nav className="border-t border-border bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_18px_rgba(0,0,0,0.06)]">
      <ul className="grid grid-cols-5">
        {items.map((it) => {
          if (it.key === "meldingen" && NAV_MODE === "assistant") {
            return (
              <li key="assistant" className="flex items-center justify-center py-1.5">
                <button
                  type="button"
                  onClick={open}
                  aria-label="Open Marktplaats Assistent"
                  className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#f5b48a] text-white shadow-md active:scale-95"
                >
                  <Sparkles
                    className="absolute right-1 top-1 h-3 w-3 text-white drop-shadow"
                    strokeWidth={2.5}
                    fill="currentColor"
                  />
                  <span className="font-serif text-[20px] leading-none font-bold">M</span>
                </button>
              </li>
            );
          }
          const content = (
            <>
              <it.icon
                className={`h-6 w-6 ${it.active ? "text-primary" : "text-foreground/80"}`}
                strokeWidth={it.active ? 2.25 : 1.75}
              />
              <span
                className={`mt-0.5 whitespace-nowrap leading-[12px] ${
                  it.small ? "text-[9px]" : "text-[10px]"
                } ${it.active ? "font-medium text-primary" : "text-foreground/80"}`}
              >
                {it.label}
              </span>
            </>
          );
          return (
            <li key={it.key} className="flex flex-col items-center justify-center py-2">
              {it.to ? (
                <Link
                  to={it.to}
                  className="flex flex-col items-center justify-center active:scale-95"
                >
                  {content}
                </Link>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const accountMenuItems = [
  { icon: Tag, label: "Advertenties" },
  { icon: Heart, label: "Favorieten" },
  { icon: Gavel, label: "Biedingen" },
  { icon: Bookmark, label: "Bewaarde zoekopdrachten" },
  { icon: Store, label: "Favoriete verkopers" },
  { icon: History, label: "Recent bekeken" },
  { icon: CircleUser, label: "Profiel & ervaringen" },
];

/** Side drawer opened from the AI-search header's hamburger icon. Slides in
 * from the left, overlaying the whole app (header/content/bottom nav) since
 * it's mounted at the root alongside AssistantFab/ChatWindow. */
export function AccountMenuDrawer() {
  const { open, close } = useAccountMenu();
  if (!open) return null;
  return (
    <>
      <div className="animate-fade-in absolute inset-0 z-40 bg-black/30" onClick={close} />
      <div className="animate-slide-in-left absolute inset-y-0 left-0 z-50 flex w-[78%] max-w-[300px] flex-col bg-white shadow-2xl">
        <div className="flex items-center px-3 py-3">
          <button
            type="button"
            onClick={close}
            aria-label="Menu sluiten"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${plusButtonClass}`}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center gap-3 border-b px-4 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-[15px] font-bold text-primary-foreground">
            S
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">Stefano</p>
            <p className="text-[12px] text-muted-foreground">Mijn Marktplaats</p>
          </div>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto py-2">
          {accountMenuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-muted"
            >
              <item.icon className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
              <span className="text-[14px] font-medium text-foreground">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="border-t px-2 py-2">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-destructive active:bg-destructive/10"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            <span className="text-[14px] font-medium">Uitloggen</span>
          </button>
        </div>
      </div>
    </>
  );
}
