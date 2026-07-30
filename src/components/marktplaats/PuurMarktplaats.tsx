import { X, Ban, CheckCircle2, Sparkles } from "lucide-react";
import { usePuurMarktplaats } from "@/lib/puur-marktplaats";
import marktplaatsIcon from "@/assets/marktplaats-icon.png";

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

/** Full-page upsell overlay opened from the AI-search header's subscribe
 * pill — adapted from eBay Kleinanzeigen's real ad-free-subscription page
 * design (per the user's reference), reskinned to Dutch Marktplaats
 * branding. Dismissed via the X top-right, not a back-chevron, per
 * explicit instruction — it isn't meant to feel like a navigable page. */
export function PuurMarktplaatsOverlay() {
  const { open, close } = usePuurMarktplaats();
  if (!open) return null;

  return (
    <div className="animate-fade-in absolute inset-0 z-50 overflow-y-auto bg-white">
      <div className="relative overflow-hidden bg-gradient-to-br from-red-500 to-[#f5b48a] pb-14 pt-10">
        <Sparkles className="absolute left-8 top-8 h-4 w-4 text-white/70" fill="currentColor" />
        <Sparkles className="absolute left-16 top-16 h-2.5 w-2.5 text-white/60" fill="currentColor" />

        <button
          onClick={close}
          aria-label="Sluiten"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground shadow active:scale-95"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="absolute right-6 top-14 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-[#f5b48a] text-center leading-tight text-foreground shadow-lg">
          <span className="text-[10px] font-medium">Slechts</span>
          <span className="text-[13px] font-bold">€ 1,99</span>
          <span className="text-[9px] font-medium">per maand</span>
        </div>

        <div className="mt-6 flex flex-col items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg">
            <img src={marktplaatsIcon} alt="Marktplaats" className="h-16 w-16" />
          </div>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-destructive px-3 py-1 text-[12px] font-bold uppercase tracking-wide text-white shadow">
            <Ban className="h-3.5 w-3.5" />
            Geen advertenties
          </span>
        </div>
      </div>

      <div className="relative -mt-6 rounded-t-3xl bg-white px-5 pb-8 pt-6 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-2">
          <h1 className="font-sans text-xl font-bold text-foreground">Puur Marktplaats</h1>
          <span className="rounded-md bg-primary px-2 py-0.5 text-[11px] font-bold uppercase text-primary-foreground">
            Beta
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-foreground/80">
          Met Puur Marktplaats gebruik je Marktplaats zonder advertenties van derden voor slechts{" "}
          <span className="font-semibold">€ 1,99 per maand</span>. Zowel in de app als in de browser.
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
          <button type="button" className="font-medium text-primary hover:underline">
            Log hier in.
          </button>
        </p>
      </div>
    </div>
  );
}
