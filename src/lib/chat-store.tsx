import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  cards?: "koelkasten" | "plug" | "koelbox-20-alt" | "racefietsen" | "koelkast-destination-choice";
};

export type ChatView = "closed" | "peek" | "open";
export type ChatFlow =
  | "intro"
  | "koelkast-destination-choice"
  | "koelkast-results"
  | "racefiets-results"
  | "suggestion-fallback"
  | "on-product"
  | "plug-answer"
  | "on-koelbox-60"
  | "koelbox-60-answer";

type ChatCtx = {
  view: ChatView;
  flow: ChatFlow;
  messages: ChatMessage[];
  /** Index in `messages` from which new messages should animate in (typing bubble, one by one). Earlier messages render instantly. */
  revealFrom: number;
  open: () => void;
  close: () => void;
  pickSuggestion: (label: string) => void;
  chooseMarktplaatsKoelkast: () => void;
  chooseDestinationKoelkast: () => void;
  askPlug: () => void;
  enterProduct: (productTitle: string) => void;
  enterKoelbox60: () => void;
  askKofferbak: () => void;
  reset: () => void;
};

const Ctx = createContext<ChatCtx | null>(null);

let mid = 0;
const nextId = () => `m${++mid}`;

/** What the assistant resets back to when opened fresh — one per page context. */
type EntryState = { flow: ChatFlow; messages: ChatMessage[] };

const introEntry = (): EntryState => ({
  flow: "intro",
  messages: [
    {
      id: nextId(),
      role: "assistant",
      text: "Hoi! Ik ben je Marktplaats-assistent. Waar ben je naar op zoek?",
    },
  ],
});

const koelbox60Entry = (): EntryState => ({ flow: "on-koelbox-60", messages: [] });

const productEntry = (productTitle: string): EntryState => ({
  flow: "on-product",
  messages: [
    {
      id: nextId(),
      role: "assistant",
      text: `Goede keuze — je bekijkt nu "${productTitle}". Wil je iets weten over dit product?`,
    },
  ],
});

export function ChatProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ChatView>("closed");
  const [entryState, setEntryState] = useState<EntryState>(introEntry);
  const [flow, setFlow] = useState<ChatFlow>(() => entryState.flow);
  const [messages, setMessages] = useState<ChatMessage[]>(() => entryState.messages);
  // Nothing to animate for the initial static greeting.
  const [revealFrom, setRevealFrom] = useState(() => entryState.messages.length);

  const value = useMemo<ChatCtx>(
    () => ({
      view,
      flow,
      messages,
      revealFrom,
      // Opening via the main assistant entry point (FAB / bottom-nav icon /
      // the Demo 2 search bar) always starts a clean conversation for the
      // current page context — closing + reopening is a fresh start, not a
      // resume. The panel's own open animation is what carries the "old
      // content is gone, here's the new empty state" transition.
      open: () => {
        setView("open");
        setFlow(entryState.flow);
        setMessages(entryState.messages);
        setRevealFrom(entryState.messages.length);
      },
      close: () => setView("closed"),
      reset: () => {
        const entry = introEntry();
        setEntryState(entry);
        setFlow(entry.flow);
        setMessages(entry.messages);
        setRevealFrom(entry.messages.length);
      },
      pickSuggestion: (label) => {
        setView("open");
        // Skip past the new user message — only the assistant's reply animates in.
        setRevealFrom(messages.length + 1);
        if (label === "Betaalbare racefiets") {
          setFlow("racefiets-results");
          setMessages((prev) => [
            ...prev,
            { id: nextId(), role: "user", text: label },
            {
              id: nextId(),
              role: "assistant",
              text: "Ik heb twee betaalbare racefietsen onder de € 500 gevonden, allebei in Amsterdam en op fietsafstand — zo opgehaald en direct mee naar huis gefietst. Op basis van de verkopersbeoordelingen zou ik gaan voor de fiets van Benjamin: die heeft de hoogste rating van de twee.",
              cards: "racefietsen",
            },
          ]);
          return;
        }
        if (label === "Een koelkast voor op vakantie") {
          setFlow("koelkast-destination-choice");
          setMessages((prev) => [
            ...prev,
            { id: nextId(), role: "user", text: label },
            {
              id: nextId(),
              role: "assistant",
              text:
                "Wil je 'm gewoon in Nederland kopen op Marktplaats, of liever op je vakantiebestemming? Ga je naar Frankrijk, Italië of Duitsland? Dan kan ik ook zoeken bij de zusterwebsites van Marktplaats daar — bijvoorbeeld in de buurt van je bestemming.",
              cards: "koelkast-destination-choice",
            },
          ]);
          return;
        }
        // No scripted results for this suggestion yet — say so honestly
        // instead of (incorrectly) reusing the koelkast script for
        // anything unrecognized. The koelkast Q&A elsewhere (Koelbox60Intro
        // / askKofferbak) stays hardcoded to the koelbox-60 item page.
        setFlow("suggestion-fallback");
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: "user", text: label },
          {
            id: nextId(),
            role: "assistant",
            text: "Daar kan ik je in deze demo nog niet mee helpen — probeer 'Een koelkast voor op vakantie' of 'Betaalbare racefiets' voor een voorbeeld van hoe ik zoekopdrachten oppak.",
          },
        ]);
      },
      chooseMarktplaatsKoelkast: () => {
        setView("open");
        setFlow("koelkast-results");
        setRevealFrom(messages.length + 1);
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: "user", text: "Koop op Marktplaats" },
          {
            id: nextId(),
            role: "assistant",
            text: "Ik heb een paar koelkasten gevonden van betrouwbare merken voor in je tent.",
            cards: "koelkasten",
          },
        ]);
      },
      chooseDestinationKoelkast: () => {
        setView("open");
        setFlow("suggestion-fallback");
        setRevealFrom(messages.length + 1);
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: "user", text: "Koop op vakantiebestemming" },
          {
            id: nextId(),
            role: "assistant",
            text:
              "Zoeken bij de zusterwebsites van Marktplaats op je bestemming (zoals Leboncoin in Frankrijk, Subito in Italië of eBay Kleinanzeigen in Duitsland) werkt nog niet in deze demo — probeer 'Koop op Marktplaats' voor een voorbeeld.",
          },
        ]);
      },
      enterProduct: (productTitle) => {
        const entry = productEntry(productTitle);
        setEntryState(entry);
        setFlow(entry.flow);
        // Tapping a product card from an already-open chat should close the
        // sheet entirely, not drop it down to the peek upsell — that upsell
        // is only for arriving at a product "cold" (chat wasn't in use).
        setView((prevView) => (prevView === "open" ? "closed" : "peek"));
        setMessages(entry.messages);
        setRevealFrom(entry.messages.length);
      },
      enterKoelbox60: () => {
        // Prepare contextual intro flow for the 60L page. Do not open the sheet.
        const entry = koelbox60Entry();
        setEntryState(entry);
        setFlow(entry.flow);
        setView("closed");
        setMessages(entry.messages);
        setRevealFrom(0);
      },
      askKofferbak: () => {
        setView("open");
        setFlow("koelbox-60-answer");
        setRevealFrom(messages.length + 1);
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: "user", text: "Past deze in mijn achterbak?" },
          {
            id: nextId(),
            role: "assistant",
            text:
              "Nee, deze past net niet. Hij is te groot.\n\nDe kofferbak van jouw Peugeot is ongeveer 68 cm diep. Deze 60L koelbox is 72 × 36 × 55 cm — de achterklep kan dan niet dicht. Een kleiner model past wél.",
          },
          {
            id: nextId(),
            role: "assistant",
            text: "Hier is een compacter alternatief in de buurt (Amsterdam) in dezelfde prijsklasse:",
            cards: "koelbox-20-alt",
          },
        ]);
      },
      askPlug: () => {
        setView("open");
        setFlow("plug-answer");
        setRevealFrom(messages.length + 1);
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: "user", text: "Werkt deze ook in Griekenland? Of heb ik een aparte stekker nodig?" },
          {
            id: nextId(),
            role: "assistant",
            text:
              "Goede vraag! Griekenland gebruikt stopcontacten van het type C en F — dezelfde als in Nederland. Deze koelkast werkt dus gewoon op het lichtnet daar. Reis je met een auto of camper? Dan is een 12V-adapter handig voor onderweg. Ik vond deze op Marktplaats:",
            cards: "plug",
          },
        ]);
      },
    }),
    [view, flow, messages, revealFrom, entryState]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useChat() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
