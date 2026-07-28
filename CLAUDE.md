# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A mobile-web prototype of Marktplaats (Dutch classifieds marketplace) with a scripted AI shopping-assistant chat overlay. This is a **Lovable** project (see `AGENTS.md`) — it syncs bidirectionally with the Lovable editor via git, so avoid rewriting published history (no force-push, no rebase/amend/squash of pushed commits).

## Commands

Package manager is **bun** (`bun.lock`, `bunfig.toml`), despite `README.md` showing npm.

```sh
bun install
bun run dev       # vite dev — starts the app
bun run build      # vite build (production)
bun run build:dev  # vite build --mode development
bun run preview    # vite preview
bun run lint       # eslint .
bun run format     # prettier --write .
```

There is no test runner configured in `package.json`.

`bunfig.toml` enforces a 24h supply-chain guard (`minimumReleaseAge`) on new dependency versions, with an explicit exclude list for `@lovable.dev/*` packages. Adding a package to `minimumReleaseAgeExcludes` should be confirmed with the user first.

## Architecture

**Stack**: TanStack Start (file-based SSR router) + TanStack React Query + React 19 + Tailwind v4 + shadcn/ui (Radix primitives, "new-york" style, see `components.json`).

**Vite config is largely hidden.** `vite.config.ts` delegates to `@lovable.dev/vite-tanstack-config`, which already wires up TanStack devtools, `tanstackStart`, `viteReact`, `tailwindcss`, `tsConfigPaths`, the `@` path alias, nitro (build-only), env injection, and Lovable's own error-logger/sandbox-detection plugins. Do not re-add any of those manually — read the comment at the top of `vite.config.ts` before touching it.

**Routing** (`src/routes/`): file-based via TanStack Router, generating `src/routeTree.gen.ts` (auto-generated, never edit by hand). Conventions are documented in `src/routes/README.md` — notably: no `src/pages/`, no Next/Remix-style `app/` directory; dynamic segments are bare `$id` (not `{id}`); `__root.tsx` is the only root layout and must preserve `<Outlet />`. Server-only API routes live under `src/routes/api/**` and export a `server.handlers` object (see `src/routes/api/public/suggestions.ts`, which proxies Marktplaats' real search-suggestions endpoint).

**SSR error handling is layered and load-bearing** — don't simplify without understanding why:
- `src/start.ts` defines `startInstance` with a server-side `errorMiddleware` (catches thrown errors, renders `renderErrorPage()`) plus a CSRF middleware for server functions. TanStack Start only auto-installs CSRF protection when `src/start.ts` is *absent*; defining this file requires re-adding `createCsrfMiddleware` explicitly.
- `src/server.ts` wraps the generated SSR entry (`@tanstack/react-start/server-entry`) and additionally detects the case where h3 (Nitro's HTTP layer) swallows an in-handler throw into a generic `{"unhandled":true,"message":"HTTPError"}` 500 JSON body — a try/catch around the handler call does not catch this, so it's detected by inspecting the response body instead.
- `src/lib/error-capture.ts` monkey-patches `console.error` to expand `Error`-like args (message + stack + full `cause` chain) before they hit the log pipeline, and records the last real error out-of-band (5s TTL) so `server.ts` can recover error detail that h3 already stripped.
- `src/lib/lovable-error-reporting.ts` and `src/routes/__root.tsx`'s `ErrorComponent` report client-side render errors back to Lovable.

Changes to error handling should preserve this chain (capture → server-level swallow detection → error page) rather than adding a parallel path.

**The chat assistant is a fully scripted demo, not a live LLM integration.** `src/lib/chat-store.tsx` is a React context (`ChatProvider`/`useChat`) holding a fixed state machine (`ChatFlow`: `intro → koelkast-results → on-product`, etc.) with hardcoded Dutch conversation copy and canned product-card responses (e.g. `askKofferbak`, `askPlug`). There is no backend call and no free-text handling — the chat composer's textarea in `src/components/chat/ChatAssistant.tsx` does not actually submit. When extending the assistant, follow the existing pattern: add a new `ChatFlow` value and a corresponding action on `ChatCtx` that pushes scripted messages/cards into `messages`. `useMessageReveal` in `ChatAssistant.tsx` handles the typing-bubble/message-reveal animation and is generic to any message list.

**Navigation has two interchangeable variants** controlled by `NAV_MODE` in `src/lib/layout-settings.ts` (`"assistant"` | `"notifications"`). This single flag changes both the header (`MpHeader`) and bottom nav (`MpBottomNav`) in `src/components/marktplaats/Chrome.tsx`, and the floating-FAB visibility in `ChatAssistant.tsx`'s `AssistantFab`. Check this flag before assuming the notifications bell vs. assistant trigger is in a fixed location.

**Item data is hardcoded.** `src/routes/item.$id.tsx` contains a static `items` record keyed by id (`koelbox-60`, `koelkast-1`, etc.) — there is no product database or CMS. Product listings on the home page (`src/components/marktplaats/Home.tsx`) and in chat product cards (`ChatAssistant.tsx`) reference these same ids independently; keep them in sync by hand when adding/editing items.

**Path alias**: `@/*` → `src/*` (defined in both `tsconfig.json` and via the Lovable vite config).

**Styling**: Tailwind v4 with CSS variables (`src/styles.css`), shadcn "new-york" components in `src/components/ui/` — treat these as generated/vendored; prefer composing them over editing internals.

## Lint notes

- `eslint.config.js` bans importing the Next.js `server-only` package — TanStack Start's equivalent is naming the module `*.server.ts` or using `@tanstack/react-start/server-only`.
- `@typescript-eslint/no-unused-vars` and `noUnusedLocals`/`noUnusedParameters` are all off — unused vars are not flagged.
