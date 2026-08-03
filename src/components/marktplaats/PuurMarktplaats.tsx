import { X, Ban, CheckCircle2 } from "lucide-react";
import { usePuurMarktplaats } from "@/lib/puur-marktplaats";

const features = [
  {
    icon: Ban,
    tone: "text-destructive",
    title: "Geen advertenties van derden",
    desc: "Geen banners en video-advertenties van derden meer.",
  },
  {
    icon: Ban,
    tone: "text-destructive",
    title: "Geen tracking voor advertenties",
    desc: "Je gegevens blijven van jou.",
  },
  {
    icon: CheckCircle2,
    tone: "text-emerald-600",
    title: "Geen verplichtingen",
    desc: "Maandelijks opzegbaar.",
  },
];

/** Bottom-sheet upsell opened from the AI-search header's "Puur Marktplaats"
 * pill — slides up over whatever's currently showing (chat window or
 * homepage), same pattern as ChatWindow's sheet. No hero illustration —
 * just the plain white card, dismissed via the X top-right. */
export function PuurMarktplaatsOverlay() {
  const { open, close } = usePuurMarktplaats();
  if (!open) return null;

  return (
    <>
      <div
        className="animate-fade-in absolute inset-0 z-[60] bg-black/30"
        onClick={close}
      />
      <div className="animate-sheet-up absolute inset-x-0 bottom-0 z-[70] max-h-[85%] overflow-y-auto rounded-t-3xl bg-white px-5 pb-8 pt-6 shadow-2xl">
        <button
          onClick={close}
          aria-label="Sluiten"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted active:scale-95"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 pr-10">
          <h1 className="font-sans text-xl font-bold text-foreground">
            Puur Marktplaats
          </h1>
          <span className="rounded-md bg-primary px-2 py-0.5 text-[11px] font-bold uppercase text-primary-foreground">
            Beta
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-foreground/80">
          Met Puur Marktplaats gebruik je Marktplaats zonder advertenties van
          derden voor slechts{" "}
          <span className="font-semibold">€ 1,99 per maand</span>. Zowel in de
          app als in de browser.
        </p>

        <div className="mt-5 space-y-4">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <f.icon className={`mt-0.5 h-5 w-5 shrink-0 ${f.tone}`} />
              <div>
                <p className="text-sm font-bold text-foreground">{f.title}</p>
                <p className="text-[13px] text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-6 w-full rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-sm active:scale-[0.98]"
        >
          Abonnement afsluiten
        </button>

        <p className="mt-4 text-center text-[13px] text-muted-foreground">
          Heb je Puur Marktplaats al?{" "}
          <button
            type="button"
            className="font-medium text-primary hover:underline"
          >
            Log hier in.
          </button>
        </p>
      </div>
    </>
  );
}
