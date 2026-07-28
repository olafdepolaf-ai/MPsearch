import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  cards?: "koelkasten" | "plug" | "koelbox-20-alt";
};

export type ChatView = "closed" | "peek" | "open";
export type ChatFlow =
  | "intro"
  | "koelkast-results"
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
  askPlug: () => void;
  enterProduct: (productTitle: string) => void;
  enterKoelbox60: () => void;
  askKofferbak: () => void;
  reset: () => void;
};

const Ctx = createContext<ChatCtx | null>(null);

let mid = 0;
const nextId = () => `m${++mid}`;

const makeInitialMessages = (): ChatMessage[] => [
  {
    id: nextId(),
    role: "assistant",
    text: "Hoi! Ik ben je Marktplaats-assistent. Waar ben je naar op zoek?",
  },
];

export function ChatProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ChatView>("closed");
  const [flow, setFlow] = useState<ChatFlow>("intro");
  const [messages, setMessages] = useState<ChatMessage[]>(makeInitialMessages);
  // Nothing to animate for the initial static greeting.
  const [revealFrom, setRevealFrom] = useState(1);

  const value = useMemo<ChatCtx>(
    () => ({
      view,
      flow,
      messages,
      revealFrom,
      open: () => setView("open"),
      close: () => setView("closed"),
      reset: () => {
        setFlow("intro");
        setMessages(makeInitialMessages());
        setRevealFrom(1);
      },
      pickSuggestion: (label) => {
        setView("open");
        setFlow("koelkast-results");
        // Skip past the new user message — only the assistant's reply animates in.
        setRevealFrom(messages.length + 1);
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: "user", text: label },
          {
            id: nextId(),
            role: "assistant",
            text: "Leuk plan! Ik heb een paar compacte koelkasten gevonden die perfect passen in een caravan, camper of tent. Swipe hieronder om te bekijken:",
            cards: "koelkasten",
          },
        ]);
      },
      enterProduct: (productTitle) => {
        setFlow("on-product");
        setView("peek");
        setRevealFrom(messages.length);
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: "assistant", text: `Goede keuze — je bekijkt nu "${productTitle}". Wil je iets weten over deze koelkast?` },
        ]);
      },
      enterKoelbox60: () => {
        // Prepare contextual intro flow for the 60L page. Do not open the sheet.
        setFlow("on-koelbox-60");
        setView("closed");
        setMessages([]);
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
    [view, flow, messages, revealFrom]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useChat() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
