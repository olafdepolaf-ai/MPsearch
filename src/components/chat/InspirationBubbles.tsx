import { useChat } from "@/lib/chat-store";
import { Sparkles } from "lucide-react";

export const suggestions = [
  { label: "Een koelkast voor op vakantie", emoji: "🧊", key: "koelkast" },
  { label: "Betaalbare racefiets", emoji: "🚴", key: "fiets" },
  { label: "Cadeau voor 5-jarige", emoji: "🎁", key: "cadeau" },
  { label: "Meubel voor kleine kamer", emoji: "🛋️", key: "meubel" },
  { label: "Vintage jas", emoji: "🧥", key: "jas" },
];

export function InspirationBubbles() {
  const { pickSuggestion } = useChat();
  return (
    <section className="border-t border-[#f5b48a]/30 bg-gradient-to-b from-[#f5b48a]/12 to-white/95 backdrop-blur supports-[backdrop-filter]:from-[#f5b48a]/10 supports-[backdrop-filter]:to-white/80 shadow-[0_-6px_24px_rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-2 px-4 pt-3.5 pb-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f5b48a] text-white shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <h3 className="font-serif text-[18px] leading-[22px] font-normal text-foreground">
          Vraag het onze assistent
        </h3>
      </div>
      <div className="no-scrollbar flex gap-2.5 overflow-x-auto px-4 py-3 pb-4">
        {suggestions.map((s, i) => (
          <button
            key={s.key}
            onClick={() => pickSuggestion(s.label)}
            className="animate-bubble-drift shrink-0 rounded-full border border-primary/25 bg-[oklch(0.97_0.02_250)] px-4 py-2.5 text-[14px] leading-[18px] font-medium text-foreground shadow-sm transition active:scale-95"
            style={{ animationDelay: `${i * 0.3}s` }}
          >
            <span className="mr-1.5">{s.emoji}</span>
            {s.label}
          </button>
        ))}
      </div>
    </section>
  );
}
