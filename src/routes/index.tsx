import { createFileRoute } from "@tanstack/react-router";
import { MpHome } from "@/components/marktplaats/Home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Marktplaats — Vind het op Marktplaats" },
      {
        name: "description",
        content:
          "Marktplaats mobiel met AI-shoppingassistent: krijg inspiratie, vind tweedehands producten en stel vragen aan je persoonlijke assistent.",
      },
      { property: "og:title", content: "Marktplaats — AI Shopping Assistant Prototype" },
      { property: "og:description", content: "Prototype: Marktplaats mobiel met AI-assistent voor persoonlijke shoppinghulp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MpHome,
});
