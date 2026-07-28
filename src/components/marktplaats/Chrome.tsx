import { Search, Home, MessagesSquare, Camera, Bell, CircleUser, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { NAV_MODE } from "@/lib/layout-settings";
import { useChat } from "@/lib/chat-store";

type Completion = {
  completion: string;
  categoryName?: string;
  parentName?: string;
};

function buildSearchUrl(term: string) {
  const slug = term.trim().replace(/\s+/g, "+");
  return `https://www.marktplaats.nl/q/${encodeURIComponent(slug).replace(/%2B/g, "+")}/#postcode:1053HE|view:gallery-view`;
}

export function MpHeader() {
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
        <div className="flex items-center gap-2">
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
    { key: "home", icon: Home, label: "Home", active: true },
    { key: "berichten", icon: MessagesSquare, label: "Berichten" },
    { key: "plaatsen", icon: Camera, label: "Plaatsen" },
    { key: "meldingen", icon: Bell, label: "Meldingen" },
    { key: "mijn", icon: CircleUser, label: "Mijn Marktplaats", small: true },
  ];
  return (
    <nav className="border-t border-border bg-white shadow-[0_-6px_18px_rgba(0,0,0,0.06)]">
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
          return (
            <li key={it.key} className="flex flex-col items-center justify-center py-2">
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
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
