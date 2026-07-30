import { createContext, useContext, useState, type ReactNode } from "react";

type PuurMarktplaatsCtx = {
  open: boolean;
  show: () => void;
  close: () => void;
};

const Ctx = createContext<PuurMarktplaatsCtx | null>(null);

export function PuurMarktplaatsProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Ctx.Provider value={{ open, show: () => setOpen(true), close: () => setOpen(false) }}>
      {children}
    </Ctx.Provider>
  );
}

export function usePuurMarktplaats() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePuurMarktplaats must be used within PuurMarktplaatsProvider");
  return ctx;
}
