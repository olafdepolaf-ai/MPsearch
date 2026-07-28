import { useChat } from "@/lib/chat-store";
import { NAV_MODE } from "@/lib/layout-settings";
import { X, ArrowUp, Plus, ChevronDown, Sparkles, Train, Snowflake, Armchair, Bike } from "lucide-react";
import assistantImg from "@/assets/assistant.png";
import koelkast1 from "@/assets/koelkast1.jpg";
import koelkast2 from "@/assets/koelkast2.jpg";
import plugImg from "@/assets/plug.jpg";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/chat-store";

function TypingBubble() {
  return (
    <div className="flex items-end gap-2 animate-fade-in">
      <img src={assistantImg} alt="" className="h-7 w-7 shrink-0 rounded-full bg-assistant/10 p-0.5" />
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-3.5 py-3">
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-typing-dot" style={{ animationDelay: "0ms" }} />
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-typing-dot" style={{ animationDelay: "150ms" }} />
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-typing-dot" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

/**
 * Reveal messages one-by-one, starting from `revealFrom` (earlier messages —
 * prior chat history plus the user's own new message — render instantly).
 * User messages appear near-instantly; assistant messages are preceded by
 * an animated typing bubble.
 */
function useMessageReveal(messages: ChatMessage[], revealFrom: number) {
  const [count, setCount] = useState(revealFrom);
  const [typing, setTyping] = useState(false);
  const prevRevealFromRef = useRef(revealFrom);

  // Snap when a new interaction sets a fresh revealFrom, or messages were reset/shrunk.
  useEffect(() => {
    if (revealFrom !== prevRevealFromRef.current || messages.length < prevRevealFromRef.current) {
      setCount(Math.min(revealFrom, messages.length));
      setTyping(false);
    }
    prevRevealFromRef.current = revealFrom;
  }, [messages.length, revealFrom]);

  useEffect(() => {
    if (count >= messages.length) {
      if (typing) setTyping(false);
      return;
    }
    const next = messages[count];
    if (next.role === "user") {
      const t = setTimeout(() => setCount((c) => c + 1), 120);
      return () => clearTimeout(t);
    }
    if (!typing) {
      const t = setTimeout(() => setTyping(true), 180);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setTyping(false);
      setCount((c) => c + 1);
    }, 750);
    return () => clearTimeout(t);
  }, [count, typing, messages]);

  return { visible: messages.slice(0, count), typing: typing && count < messages.length };
}

const KOELBOX_60_IMG =
  "https://admarkt-cdn.marktplaats.com/api/v1/icas-mp-pro-admarkt/images/10/10fdd7db-4e06-46e1-a100-36558ef94c19?rule=eps_85";



const koelkastProducts = [
  {
    id: "koelkast-1",
    title: "Compressor koelkast 12V/230V — 25L",
    price: "€ 189,00",
    loc: "Utrecht · 3 km",
    img: koelkast1,
    tag: "Perfect voor caravan",
  },
  {
    id: "koelkast-2",
    title: "Mobicool koelbox 25L — blauw",
    price: "€ 45,00",
    loc: "Amsterdam · 12 km",
    img: koelkast2,
    tag: "Ideaal voor de tent",
  },
];

const plugProducts = [
  {
    id: "plug-1",
    title: "12V auto-adapter met sigarettenaansteker",
    price: "€ 8,50",
    loc: "Eindhoven",
    img: plugImg,
    tag: "Handig onderweg",
  },
];

const koelbox20AltProducts = [
  {
    id: "koelbox-20",
    title: "Compressor koelbox 20L",
    price: "€ 150,00",
    loc: "📍 Amsterdam",
    img: koelkast1,
    tag: "📏 58 × 33 × 29 cm · Past ruim",
  },
];


export function AssistantFab() {
  const { view, open } = useChat();
  // In "assistant"-nav mode zit de trigger in de bottom-nav; verberg de zwevende FAB.
  if (NAV_MODE === "assistant") return null;
  if (view !== "closed") return null;
  return (
    <button
      onClick={open}
      className="animate-pulse-ring absolute bottom-24 right-3 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#f5b48a] text-white shadow-xl transition active:scale-90"
      aria-label="Open assistent"
    >
      <Sparkles
        className="absolute right-1.5 top-1.5 h-3.5 w-3.5 text-white drop-shadow"
        strokeWidth={2.5}
        fill="currentColor"
      />
      <span className="font-serif text-[26px] leading-none font-bold text-white">M</span>
    </button>
  );
}


export function ChatWindow() {
  const { view, close, flow, messages, revealFrom, askPlug, pickSuggestion, askKofferbak } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, view]);

  if (view === "closed") return null;

  const isPeek = view === "peek";

  return (
    <>
      {view === "open" && (
        <div
          className="animate-fade-in absolute inset-0 z-40 bg-black/30"
          onClick={close}
        />
      )}
      <div
        className={`animate-sheet-up absolute inset-x-0 bottom-0 z-50 flex flex-col rounded-t-3xl border-t bg-white shadow-2xl ${
          isPeek ? "h-[120px]" : "h-[85%]"
        }`}

      >
        {/* Handle + close */}
        <div className="flex items-center justify-end border-b px-4 py-2">
          <button
            onClick={close}
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          >
            {isPeek ? <ChevronDown className="h-4 w-4 rotate-180" /> : <X className="h-4 w-4" />}
          </button>
        </div>

        {isPeek ? (
          <PeekProductPrompt onAsk={askPlug} />
        ) : (
          <>
            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {flow === "intro" ? (
                <IntroHome onPick={pickSuggestion} />
              ) : flow === "on-koelbox-60" ? (
                <Koelbox60Intro onAskKofferbak={askKofferbak} />
              ) : (
                <MessageStream
                  messages={messages}
                  revealFrom={revealFrom}
                  flow={flow}
                  onPickKoelkast={(id) => navigate({ to: "/item/$id", params: { id } })}
                  onPickKoelbox20={(id) => navigate({ to: "/item/$id", params: { id } })}
                />
              )}
            </div>

            {/* Composer */}
            <Composer />
          </>
        )}

      </div>
    </>
  );
}

function MessageStream({
  messages,
  revealFrom,
  flow,
  onPickKoelkast,
  onPickKoelbox20,
}: {
  messages: ChatMessage[];
  revealFrom: number;
  flow: string;
  onPickKoelkast: (id: string) => void;
  onPickKoelbox20: (id: string) => void;
}) {
  const { visible, typing } = useMessageReveal(messages, revealFrom);
  const done = visible.length === messages.length && !typing;
  return (
    <>
      {visible.map((m) => (
        <div key={m.id} className="animate-fade-in">
          {m.role === "assistant" ? (
            <div className="flex items-end gap-2">
              <img src={assistantImg} alt="" className="h-7 w-7 shrink-0 rounded-full bg-assistant/10 p-0.5" />
              <div className="max-w-[78%] whitespace-pre-line rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5 text-sm text-foreground">
                {m.text}
              </div>
            </div>
          ) : (
            <div className="flex justify-end">
              <div className="max-w-[78%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2.5 text-sm text-primary-foreground">
                {m.text}
              </div>
            </div>
          )}
          {m.cards === "koelkasten" && (
            <ProductSwiper products={koelkastProducts} onPick={(id) => onPickKoelkast(id)} />
          )}
          {m.cards === "plug" && <ProductSwiper products={plugProducts} onPick={() => {}} />}
          {m.cards === "koelbox-20-alt" && (
            <ProductSwiper products={koelbox20AltProducts} onPick={(id) => onPickKoelbox20(id)} />
          )}
        </div>
      ))}

      {typing && <TypingBubble />}

      {done && flow === "koelkast-results" && (
        <QuickReplies replies={["Iets goedkopers?", "Hoe groot is 25L?", "Werkt op zonnepaneel?"]} />
      )}
      {done && flow === "plug-answer" && (
        <QuickReplies replies={["Bedankt!", "En in Kroatië?", "Verzendkosten?"]} />
      )}
      {done && flow === "koelbox-60-answer" && (
        <QuickReplies replies={["Toon meer alternatieven", "Werkt deze op campinggas?", "Verloopstekker nodig?"]} />
      )}
    </>
  );
}

function Koelbox60Intro({ onAskKofferbak }: { onAskKofferbak: () => void }) {
  const bubbles = [
    { label: "Past deze in mijn achterbak?", onClick: onAskKofferbak },
    { label: "Heb ik een verloopstekker nodig?" },
    { label: "Werkt deze ook op campinggas?" },
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-2.5">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5b48a] shadow-sm">
          <Sparkles
            className="absolute right-0 top-0 h-3 w-3 -translate-y-0.5 translate-x-0.5 text-white"
            fill="currentColor"
            strokeWidth={2.5}
          />
          <span className="font-serif text-[18px] leading-none font-bold text-white">M</span>
        </div>
        <div className="flex-1 pt-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#f5b48a]">
            Marktplaats Assistent
          </p>
          <p className="mt-1 text-[14px] leading-[19px] text-foreground">
            Vragen over deze koelbox? Kies een onderwerp of typ je vraag.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {bubbles.map((b) => (
          <button
            key={b.label}
            onClick={b.onClick}
            className="flex items-center gap-2 rounded-full border border-border bg-white px-3.5 py-2 text-left text-[13px] text-foreground transition active:scale-[0.99] hover:bg-muted/40"
          >
            <span className="text-[13px]">💬</span>
            <span className="truncate">{b.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}


function PeekProductPrompt({ onAsk }: { onAsk: () => void }) {
  return (
    <div className="flex flex-1 items-center gap-2 overflow-x-auto px-4 py-2">
      <button
        onClick={onAsk}
        className="shrink-0 rounded-full border border-assistant/30 bg-assistant/5 px-4 py-2 text-xs font-medium text-foreground active:scale-95"
      >
        🔌 Werkt deze in Griekenland?
      </button>
      <button className="shrink-0 rounded-full border bg-white px-4 py-2 text-xs font-medium text-muted-foreground">
        📏 Past dit in mijn kofferbak?
      </button>
      <button className="shrink-0 rounded-full border bg-white px-4 py-2 text-xs font-medium text-muted-foreground">
        ⚡ Verbruik per dag?
      </button>
    </div>
  );
}

function QuickReplies({ replies }: { replies: string[] }) {
  return (
    <div className="flex flex-wrap gap-2 pl-9 pt-1">
      {replies.map((r) => (
        <button
          key={r}
          className="rounded-full border border-assistant/30 bg-white px-3 py-1.5 text-xs font-medium text-assistant active:scale-95"
        >
          {r}
        </button>
      ))}
    </div>
  );
}

type Product = {
  id: string;
  title: string;
  price: string;
  loc: string;
  img: string;
  tag: string;
};

function ProductSwiper({
  products,
  onPick,
}: {
  products: Product[];
  onPick: (id: string, title: string) => void;
}) {
  return (
    <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pl-9 pr-2">
      {products.map((p) => (
        <Link
          key={p.id}
          to="/item/$id"
          params={{ id: p.id }}
          onClick={() => onPick(p.id, p.title)}
          className="w-[62%] shrink-0 overflow-hidden rounded-2xl border bg-card shadow-sm active:scale-[0.98]"
        >
          <div className="relative aspect-[4/3] bg-muted">
            <img src={p.img} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
            <span className="absolute left-2 top-2 rounded-full bg-assistant px-2 py-0.5 text-[10px] font-semibold text-white">
              {p.tag}
            </span>
          </div>
          <div className="p-2.5">
            <p className="line-clamp-2 text-xs font-medium text-foreground">{p.title}</p>
            <p className="mt-1 text-sm font-bold text-foreground">{p.price}</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">{p.loc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function IntroHome({ onPick }: { onPick: (label: string) => void }) {
  const actions = [
    { icon: Armchair, label: "Slaapmatjes & stoeltjes" },
    { icon: Snowflake, label: "Compacte koelboxen", sub: "Amsterdam" },
    { icon: Train, label: "Toon alleen bereikbaar met OV", highlight: true },
  ];
  const faqs = [
    "Koelbox op gas of stroom?",
    "Lichtgewicht stoeltjes in de buurt",
    "Wat past makkelijk in trein of fietstas?",
  ];
  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div className="flex items-start gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5b48a] shadow-sm">
          <Sparkles className="absolute h-3 w-3 translate-x-2.5 -translate-y-2.5 text-white" fill="currentColor" strokeWidth={2.5} />
          <span className="font-serif text-[18px] leading-none font-bold text-white">M</span>
        </div>
        <div className="flex-1 pt-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#f5b48a]">
            Marktplaats Assistent
          </p>
          <p className="mt-1 text-[15px] leading-[20px] font-medium text-foreground">
            Hoi Olaf, je kampeeruitrusting is bijna compleet.
          </p>
          <p className="mt-1 text-[13px] leading-[18px] text-muted-foreground">
            Waar kan ik mee helpen?
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2">
        {actions.map((a) => {
          const Icon = a.icon;
          const isWide = a.highlight;
          return (
            <button
              key={a.label}
              onClick={() => onPick(a.label)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition active:scale-[0.98] ${
                isWide
                  ? "col-span-2 border-[#f5b48a]/60 bg-[#f5b48a]/10"
                  : "border-border bg-white hover:bg-muted/40"
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isWide ? "text-[#c97a4a]" : "text-primary"}`} />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-foreground">{a.label}</p>
                {a.sub && (
                  <p className="truncate text-[11px] text-muted-foreground">{a.sub}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* FAQ bubbles */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Veelgestelde vragen tijdens het zoeken
        </p>
        <div className="flex flex-col gap-2">
          {faqs.map((q) => (
            <button
              key={q}
              onClick={() => onPick(q)}
              className="flex items-center gap-2 rounded-full border border-border bg-white px-3.5 py-2 text-left text-[13px] text-foreground transition active:scale-[0.99] hover:bg-muted/40"
            >
              <span className="text-[13px]">💬</span>
              <span className="truncate">{q}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Composer() {
  return (
    <div className="border-t bg-white px-3 pb-4 pt-3">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex items-end gap-2 rounded-2xl border border-border bg-white px-2 py-2 shadow-sm focus-within:border-[#f5b48a]"
      >
        <button
          type="button"
          aria-label="Upload foto"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
        >
          <Plus className="h-5 w-5" />
        </button>
        <textarea
          rows={1}
          placeholder="Stel je vraag aan Marktplaats..."
          className="max-h-24 flex-1 resize-none bg-transparent py-2 text-[14px] leading-[20px] outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          aria-label="Verstuur"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5b48a] text-white shadow-sm transition active:scale-95"
        >
          <ArrowUp className="h-4 w-4" strokeWidth={2.75} />
        </button>
      </form>
    </div>
  );
}

