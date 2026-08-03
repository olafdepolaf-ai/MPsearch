import { createContext, useContext, useState, type ReactNode } from "react";

type AccountMenuCtx = {
  open: boolean;
  toggle: () => void;
  close: () => void;
};

const Ctx = createContext<AccountMenuCtx | null>(null);

export function AccountMenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Ctx.Provider
      value={{
        open,
        toggle: () => setOpen((v) => !v),
        close: () => setOpen(false),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAccountMenu() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useAccountMenu must be used within AccountMenuProvider");
  return ctx;
}
