import { useEffect } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ChevronLeft, Heart, Share2, MapPin, Shield, Star } from "lucide-react";
import { MpBottomNav } from "@/components/marktplaats/Chrome";
import koelkast1 from "@/assets/koelkast1.jpg";
import koelkast2 from "@/assets/koelkast2.jpg";
import { useChat } from "@/lib/chat-store";

const KOELBOX_60_IMG =
  "https://admarkt-cdn.marktplaats.com/api/v1/icas-mp-pro-admarkt/images/10/10fdd7db-4e06-46e1-a100-36558ef94c19?rule=eps_85";

const items: Record<string, {
  title: string;
  price: string;
  img: string;
  loc: string;
  seller: string;
  desc: string;
  specs: [string, string][];
}> = {
  "koelbox-60": {
    title: "Compressor koelbox elektrisch — Coolbox Frigobox 60L",
    price: "€ 219,00",
    img: KOELBOX_60_IMG,
    loc: "Amsterdam",
    seller: "CoolTrade · 4.8 ★ (312)",
    desc:
      "Krachtige 60L compressor koelbox. Koelt tot -20°C, werkt op 12/24V en 230V. Ideaal voor lange kampeer- of autoreizen. Retourdeal met korting.",
    specs: [
      ["Inhoud", "60 liter"],
      ["Afmetingen", "72 × 36 × 55 cm"],
      ["Voeding", "12V / 24V DC · 230V AC"],
      ["Type koeling", "Compressor"],
    ],
  },
  "koelbox-20": {
    title: "Compressor koelbox 20L — compact",
    price: "€ 150,00",
    img: koelkast1,
    loc: "Amsterdam",
    seller: "Bram · 4.9 ★ (127)",
    desc:
      "Compacte 20L compressor koelbox. Past ruim in de meeste kofferbakken. Werkt op 12V en 230V, koelt tot -18°C.",
    specs: [
      ["Inhoud", "20 liter"],
      ["Afmetingen", "58 × 33 × 29 cm"],
      ["Voeding", "12V DC / 230V AC"],
      ["Type koeling", "Compressor"],
    ],
  },
  "koelkast-1": {
    title: "Compressor koelkast 12V/230V — 25L",
    price: "€ 189,00",
    img: koelkast1,
    loc: "Utrecht",
    seller: "Bram · 4.9 ★ (127)",
    desc:
      "Zo goed als nieuwe compressor koelkast, ideaal voor caravan, camper of boot. Koelt tot -18°C. Werkt op 12V (auto) én 230V (stopcontact). Zuinig en stil.",
    specs: [
      ["Inhoud", "25 liter"],
      ["Voeding", "12V DC / 230V AC"],
      ["Gewicht", "9 kg"],
      ["Staat", "Zo goed als nieuw"],
    ],
  },
  "koelkast-2": {
    title: "Mobicool koelbox 25L — blauw",
    price: "€ 45,00",
    img: koelkast2,
    loc: "Amsterdam",
    seller: "Sanne · 4.7 ★ (58)",
    desc:
      "Handige thermo-elektrische koelbox. Perfect voor festivals, kamperen en dagjes strand. Werkt op 12V via de auto.",
    specs: [
      ["Inhoud", "25 liter"],
      ["Voeding", "12V DC"],
      ["Gewicht", "3.2 kg"],
      ["Staat", "Gebruikt"],
    ],
  },
  "plug-1": {
    title: "12V auto-adapter met sigarettenaansteker",
    price: "€ 8,50",
    img: koelkast1,
    loc: "Eindhoven",
    seller: "Peter · 4.8 ★",
    desc: "Universele 12V adapter, geschikt voor koelboxen en kleine apparaten.",
    specs: [["Voltage", "12V"], ["Kabel", "1.5m"]],
  },
};

export const Route = createFileRoute("/item/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `${items[params.id]?.title ?? "Item"} — Marktplaats` },
      { name: "description", content: items[params.id]?.desc?.slice(0, 150) ?? "" },
    ],
  }),
  component: ItemPage,
});

function ItemPage() {
  const { id } = useParams({ from: "/item/$id" });
  const { enterProduct, enterKoelbox60 } = useChat();
  const item = items[id];

  useEffect(() => {
    if (!item) return;
    if (id === "koelbox-60") {
      enterKoelbox60();
    } else {
      enterProduct(item.title);
    }
  }, [id]);


  if (!item) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Item niet gevonden</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Top bar */}
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-white/95 px-3 py-3 backdrop-blur">
        <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <p className="flex-1 truncate text-sm font-semibold">{item.title}</p>
        <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
          <Share2 className="h-5 w-5" />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
          <Heart className="h-5 w-5" />
        </button>
      </header>

      <main className="flex-1 pb-40">
        <div className="aspect-square w-full bg-muted">
          <img src={item.img} alt={item.title} className="h-full w-full object-cover" />
        </div>

        <div className="p-4">
          <h1 className="text-lg font-bold leading-snug">{item.title}</h1>
          <p className="mt-2 text-2xl font-extrabold text-foreground">{item.price}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {item.loc} · Vandaag geplaatst
          </p>

          <div className="mt-4 flex items-center gap-3 rounded-2xl border bg-muted/40 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
              {item.seller[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{item.seller}</p>
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Shield className="h-3 w-3 text-emerald-600" /> Geverifieerde verkoper
              </p>
            </div>
            <button className="rounded-full border px-3 py-1.5 text-xs font-medium">Bekijk</button>
          </div>

          <section className="mt-5">
            <h2 className="text-sm font-bold">Beschrijving</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">{item.desc}</p>
          </section>

          <section className="mt-5">
            <h2 className="text-sm font-bold">Kenmerken</h2>
            <dl className="mt-2 divide-y rounded-xl border">
              {item.specs.map(([k, v]) => (
                <div key={k} className="flex justify-between px-3 py-2 text-xs">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-5 flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>Populair item — 43 mensen bekeken dit vandaag</span>
          </section>
        </div>
      </main>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-[64px] z-20 border-t bg-white p-3">
        <div className="flex gap-2">
          <button className="flex-1 rounded-full border-2 border-primary py-3 text-sm font-bold text-primary">
            Bied
          </button>
          <button className="flex-[2] rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground">
            Stuur bericht
          </button>
        </div>
      </div>

      <div className="sticky bottom-0 z-30">
        <MpBottomNav />
      </div>
    </div>
  );
}
