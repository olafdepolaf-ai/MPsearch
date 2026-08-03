import { createFileRoute } from "@tanstack/react-router";
import { MpHome } from "@/components/marktplaats/Home";

// Dedicated, shareable URL that always opens Demo 2 (integrated AI search).
// Forcing the mode happens in DemoModeProvider (src/lib/demo-mode.tsx) based
// on pathname — this route just needs to exist and render the same home
// screen.
export const Route = createFileRoute("/demo-2")({
  head: () => ({
    meta: [
      { title: "Marktplaats — Demo 2 · AI Search" },
      {
        name: "description",
        content:
          "Marktplaats mobiel met AI-shoppingassistent: krijg inspiratie, vind tweedehands producten en stel vragen aan je persoonlijke assistent.",
      },
    ],
  }),
  component: MpHome,
});
