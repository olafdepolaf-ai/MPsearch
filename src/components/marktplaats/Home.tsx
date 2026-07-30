import { MpHeader, MpBottomNav, IntegratedSearchBar } from "./Chrome";
import { Heart, ArrowRight, ChevronDown, ChevronUp, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { InspirationBubbles, suggestions } from "../chat/InspirationBubbles";
import { useChat } from "@/lib/chat-store";
import { useDemoMode } from "@/lib/demo-mode";

import tileLadekast from "@/assets/tile-ladekast.jpg";
import tileTent from "@/assets/tile-tent.jpg";
import tilePeugeot from "@/assets/tile-peugeot.jpg";
import tileMok from "@/assets/tile-mok.jpg";
import bannerCouple from "@/assets/banner-couple.png";


const categoryTabs = [
  "Alle categorieën",
  "Auto's",
  "Huis en Inrichting",
  "Tuin en Terras",
  "Kleding | Dames",
  "Audio, Tv en Foto",
  "Kinderen en Baby's",
];

const allCategories = [
  "Antiek en Kunst",
  "Audio, Tv en Foto",
  "Auto's",
  "Auto-onderdelen",
  "Auto diversen",
  "Boeken",
  "Caravans en Kamperen",
  "Cd's en Dvd's",
  "Computers en Software",
  "Contacten en Berichten",
  "Diensten en Vakmensen",
  "Dieren en Toebehoren",
  "Doe-het-zelf en Verbouw",
  "Fietsen en Brommers",
  "Hobby en Vrije tijd",
  "Huis en Inrichting",
  "Huizen en Kamers",
  "Kinderen en Baby's",
  "Kleding | Dames",
  "Kleding | Heren",
  "Motoren",
  "Muziek en Instrumenten",
  "Postzegels en Munten",
  "Sieraden, Tassen en Uiterlijk",
  "Spelcomputers en Games",
  "Sport en Fitness",
  "Telecommunicatie",
  "Tickets en Kaartjes",
  "Tuin en Terras",
  "Vacatures",
  "Vakantie",
  "Verzamelen",
  "Watersport en Boten",
  "Witgoed en Apparatuur",
  "Zakelijke goederen",
  "Diversen",
];


const discoveryTiles: Array<{
  title: string;
  img: string;
}> = [
  {
    title: "Onlangs bekeken",
    img: tileLadekast,
  },
  {
    title: "Recente favorieten",
    img: tileTent,
  },
  {
    title: "Nieuwe auto",
    img: tilePeugeot,
  },
  {
    title: "Cadeau voor zus",
    img: tileMok,
  },
];

// Echte advertenties uit Marktplaats > Caravans en Kamperen > Koelboxen.
// Verkoper/rating: echte data voor koelbox-60 (zie item.$id.tsx); voor de
// admarkt/dealer-advertenties daaronder bestaat geen individuele
// verkopersbeoordeling, dus die zijn verzonnen (representatieve NL-namen).
const featured: Array<{
  id?: string;
  title: string;
  price: string;
  loc: string;
  img: string;
  seller: string;
  rating: string;
  reviews: number;
}> = [
  {
    id: "koelbox-60",
    title: "Compressor koelbox elektrisch — Coolbox Frigobox 60L",
    price: "€ 219,00",
    loc: "Amsterdam",
    img: "https://admarkt-cdn.marktplaats.com/api/v1/icas-mp-pro-admarkt/images/10/10fdd7db-4e06-46e1-a100-36558ef94c19?rule=eps_85",
    seller: "CoolTrade",
    rating: "4.8",
    reviews: 312,
  },
  {
    title: "Brisby 40 Liter Elektrische Koelbox, Frigobox 12/230 Volt",
    price: "€ 79,99",
    loc: "Moordrecht",
    img: "https://admarkt-cdn.marktplaats.com/api/v1/icas-mp-pro-admarkt/images/21/21eac0fc-6340-4630-b528-74fe027fa9d4?rule=eps_85",
    seller: "Kevin_koelt",
    rating: "4.6",
    reviews: 34,
  },

  {
    title: "Koelbox op accu Makita / Dewalt / Milwaukee / Parkside Coolbox",
    price: "€ 289,00",
    loc: "Rijssen",
    img: "https://admarkt-cdn.marktplaats.com/api/v1/icas-mp-pro-admarkt/images/bd/bd520d3c-740d-4553-80f0-e734e06d6737?rule=eps_85",
    seller: "Twanne",
    rating: "4.9",
    reviews: 81,
  },
  {
    title: "Dometic ACX3 40 liter nog splinternieuw",
    price: "€ 300,00",
    loc: "Amsterdam",
    img: "https://images.marktplaats.com/api/v1/hz-mp-pro-listing/images/9f1323f1-bf86-4ad8-890c-1fa3f77b4030?rule=ecg_mp_eps$_85",
    seller: "Fenna",
    rating: "5.0",
    reviews: 14,
  },
  {
    title: "EcoFlow GLACIER Draagbare Compressor Koelbox / Vriezer",
    price: "€ 750,00",
    loc: "Utrecht",
    img: "https://images.marktplaats.com/api/v1/hz-mp-pro-listing/images/8cad7792-9e53-406d-826d-e83d0e7dec58?rule=ecg_mp_eps$_85",
    seller: "OutdoorGijs",
    rating: "4.8",
    reviews: 203,
  },
  {
    title: "Campingaz Elektrische Koelbox 12V - Ideaal voor onderweg",
    price: "€ 20,00",
    loc: "Rotterdam",
    img: "https://images.marktplaats.com/api/v1/hz-mp-pro-listing/images/ab9b2cb7-a101-4629-a2a8-517b21fd60f9?rule=ecg_mp_eps$_85",
    seller: "Marloes92",
    rating: "4.7",
    reviews: 19,
  },
];

// De ene advertentie die Stefano zelf op dit moment heeft staan — echte
// listing (marktplaats.nl/v/audio-tv-en-foto/fotocamera-s-digitaal/m2397909785),
// past bij zijn fotografie-hobby (zie project-mpsearch-persona memory).
const myAds: typeof featured = [
  {
    title: "Sony A7III + lenses & accessoires",
    price: "€ 1.200,00",
    loc: "Eindhoven",
    img: "https://images.marktplaats.com/api/v1/hz-mp-pro-listing/images/8bbab6c3-b75c-41da-be0a-ffa84f25a619?rule=ecg_mp_eps$_85",
    seller: "Stefano",
    rating: "5.0",
    reviews: 32,
  },
];


function IntegratedChatDock() {
  const { pickSuggestion } = useChat();
  return (
    <div className="sticky top-16 z-20 border-t border-border bg-white px-4 pt-3 pb-4">
      <IntegratedSearchBar />
      <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto">
        {suggestions.map((s) => (
          <button
            key={s.key}
            onClick={() => pickSuggestion(s.label)}
            className="shrink-0 rounded-full border border-primary/25 bg-[oklch(0.97_0.02_250)] px-4 py-2.5 text-[14px] leading-[18px] font-medium text-foreground shadow-sm transition active:scale-95"
          >
            <span className="mr-1.5">{s.emoji}</span>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ListingCard(f: (typeof featured)[number]) {
  const inner = (
    <>
      <div className="flex items-center gap-1.5 px-2 pt-2">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {f.seller[0]}
        </span>
        <span className="truncate text-[11px] font-medium text-foreground">{f.seller}</span>
        <span className="flex shrink-0 items-center gap-0.5 text-[11px] text-muted-foreground">
          <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
          {f.rating} <span className="text-muted-foreground/70">({f.reviews})</span>
        </span>
      </div>
      <div className="relative aspect-square bg-muted">
        <img src={f.img} alt={f.title} className="h-full w-full object-cover" loading="lazy" />
        <button
          aria-label="Favoriet"
          onClick={(e) => e.preventDefault()}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow"
        >
          <Heart className="h-4 w-4 text-foreground" />
        </button>
      </div>
      <div className="p-2.5">
        <p className="line-clamp-2 min-h-[2.25rem] text-[14px] leading-[18px] font-medium text-foreground">
          {f.title}
        </p>
        <p className="mt-1 font-serif text-[18px] leading-[24px] font-normal text-foreground">{f.price}</p>
        <p className="mt-0.5 text-[12px] leading-[16px] text-muted-foreground">{f.loc}</p>
      </div>
    </>
  );
  const cls = "group block overflow-hidden rounded-md border border-border bg-white";
  return f.id ? (
    <Link to="/item/$id" params={{ id: f.id }} className={cls}>
      {inner}
    </Link>
  ) : (
    <article className={cls}>{inner}</article>
  );
}

export function MpHome() {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"voor-jou" | "mijn">("voor-jou");
  const { mode } = useDemoMode();
  const { reset } = useChat();

  // Landing on the homepage is its own context — claim the assistant's
  // fresh entry state here too, same as item pages do for themselves.
  useEffect(() => {
    reset();
  }, []);

  // The router's scrollRestoration re-applies "/"'s last scroll position
  // on mount, which runs after this component's own effects — so a plain
  // scrollIntoView here gets immediately overridden. Deferring to the next
  // frame lets it run after restoration, so tapping the bottom-nav Home
  // icon always lands at the top instead of wherever the homepage was
  // previously scrolled to.
  const pageTopRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      pageTopRef.current?.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={pageTopRef} className="flex min-h-full flex-col bg-white">
      <MpHeader />
      {mode === "integrated-search" && <IntegratedChatDock />}

      {/* Category tabs strip */}
      <nav className="border-b border-border bg-white">
        <ul className="no-scrollbar flex gap-1 overflow-x-auto px-2 py-2">
          {categoryTabs.map((label, i) => {
            const isAll = i === 0;
            return (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => isAll && setCategoriesOpen((v) => !v)}
                  className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-[12px] leading-[16px] font-medium transition ${
                    categoriesOpen && isAll
                      ? "bg-primary text-primary-foreground"
                      : "bg-white text-foreground hover:bg-muted"
                  }`}
                >
                  {label}
                  {isAll &&
                    (categoriesOpen ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ))}
                </button>
              </li>
            );
          })}
        </ul>

        {categoriesOpen && (
          <div className="px-3 pb-3">
            <div className="flex flex-wrap gap-2">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className="whitespace-nowrap rounded-full border border-border bg-white px-3 py-1.5 text-[12px] leading-[16px] font-medium text-foreground hover:bg-muted"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>


      <main className="flex-1 pb-24">
        {/* Discovery tiles — horizontal swipe carousel */}
        <section className="bg-white px-3 pt-3">
          <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4">
            {discoveryTiles.map((t) => (
              <article
                key={t.title}
                className="flex w-[180px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
              >
                <img
                  src={t.img}
                  alt={t.title}
                  className="h-[140px] w-full object-cover"
                  loading="lazy"
                />
                <div className="flex flex-1 items-center justify-between p-3">
                  <p className="font-serif text-[14px] leading-[18px] font-normal text-foreground">
                    {t.title}
                  </p>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f5b48a]/20 text-foreground">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>




        {/* Money-back guarantee banner */}
        <section className="px-3 pt-1">
          <a
            href="https://www.marktplaats.nl/m/veiligheidscentrum/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative block overflow-hidden rounded-2xl"
          >
            <img
              src={bannerCouple}
              alt="Stel op de bank kijkt samen op een telefoon"
              className="h-[160px] w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center gap-2 p-4">
              <h2 className="max-w-[65%] font-serif text-[20px] leading-[24px] font-normal text-white">
                Niet goed? Krijg je geld terug
              </h2>
              <p className="max-w-[65%] text-[12px] leading-[16px] text-white/90">
                Shop vol vertrouwen met de geld-terug-garantie van Marktplaats.
              </p>
              <span className="mt-1 inline-flex w-fit items-center rounded-full bg-white px-4 py-1.5 text-[13px] leading-[16px] font-medium text-foreground shadow">
                Meer informatie
              </span>
            </div>
          </a>
        </section>


        {/* Voor jou / In je buurt / Mijn advertenties tabs */}
        <section className="px-3 pt-4">
          <div className="no-scrollbar mb-3 flex overflow-x-auto border-b border-border">
            <button
              onClick={() => setActiveTab("voor-jou")}
              className={`relative shrink-0 whitespace-nowrap px-4 py-2 text-[14px] leading-[18px] font-medium ${
                activeTab === "voor-jou" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Voor jou
              {activeTab === "voor-jou" && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 bg-primary" />
              )}
            </button>
            <button className="shrink-0 whitespace-nowrap px-4 py-2 text-[14px] leading-[18px] font-medium text-muted-foreground">
              In je buurt
            </button>
            <button
              onClick={() => setActiveTab("mijn")}
              className={`relative shrink-0 whitespace-nowrap px-4 py-2 text-[14px] leading-[18px] font-medium ${
                activeTab === "mijn" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Mijn advertenties
              {activeTab === "mijn" && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 bg-primary" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(activeTab === "voor-jou" ? featured : myAds).map((f) => (
              <ListingCard key={f.title} {...f} />
            ))}
          </div>
        </section>

      </main>



      {/* Bottom nav — sticky over scrolling page. InspirationBubbles (Demo 1 only) rides along above it; Demo 2's assistant entry now lives up top, under the header. */}
      <div className="sticky bottom-0 z-30">
        {mode === "chat-menu" && <InspirationBubbles />}
        <MpBottomNav />
      </div>
    </div>
  );
}
