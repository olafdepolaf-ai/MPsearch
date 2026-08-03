# MPsearch

Mobile-web prototype of Marktplaats (the Dutch classifieds marketplace) with a
scripted AI shopping-assistant overlay. Two demo variants are available:

- `/demo-1` — search bar + assistant reachable via the menu/bottom nav
- `/demo-2` — an integrated AI-search bar replaces the header search

## Stack

TanStack Start (file-based SSR router) + TanStack React Query + React 19 +
Tailwind v4 + shadcn/ui.

## Development

Package manager is [bun](https://bun.sh).

```sh
bun install
bun run dev       # starts the app at http://localhost:8080
bun run build     # production build
bun run preview   # preview a production build
bun run lint      # eslint .
bun run format    # prettier --write .
```

See `CLAUDE.md` for an architecture overview (routing conventions, SSR error
handling, the chat assistant's scripted state machine).
