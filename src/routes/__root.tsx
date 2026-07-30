import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ChatProvider } from "../lib/chat-store";
import { DemoModeProvider, DemoModeSwitcher } from "../lib/demo-mode";
import { AccountMenuProvider } from "../lib/account-menu";
import { PuurMarktplaatsProvider } from "../lib/puur-marktplaats";
import { AssistantFab, ChatWindow } from "../components/chat/ChatAssistant";
import { AccountMenuDrawer } from "../components/marktplaats/Chrome";
import { PuurMarktplaatsOverlay } from "../components/marktplaats/PuurMarktplaats";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Bree+Serif&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <DemoModeProvider>
        <DemoModeSwitcher />
        <ChatProvider>
          <AccountMenuProvider>
            <PuurMarktplaatsProvider>
              {/* This shell used to be `min-h-screen` (no fixed height) on mobile,
                  only getting a real height at `md:` (the desktop phone-frame
                  preview). That meant the inner `overflow-y-auto` div below never
                  actually had overflowing content on mobile — its height just grew
                  to match content — so the real scrolling happened on the document
                  itself instead. `position: sticky` computes against the nearest
                  ancestor that has non-visible overflow, which was still this
                  now-inert inner div; since IT never scrolled, iOS Safari never
                  triggered "stuck" repositioning, so the header/bottom-nav weren't
                  sticky in the iOS simulator (only appeared to work when a wide
                  desktop window happened to hit `md:`). Fixed by giving the shell a
                  real `h-dvh` height on every viewport size, so the inner div is
                  always the one genuine scroll container — everywhere, not just
                  at `md:`. */}
              <div className="h-dvh overflow-hidden bg-slate-200 md:flex md:items-center md:justify-center md:py-6">
                <div className="relative mx-auto h-full w-full max-w-[430px] overflow-hidden bg-white md:aspect-[430/900] md:h-[min(900px,calc(100dvh_-_3rem))] md:w-auto md:rounded-[2.5rem] md:border-[10px] md:border-slate-900 md:shadow-2xl md:[transform:translateZ(0)]">
                  <div className="relative h-full overflow-y-auto">
                    <Outlet />
                  </div>
                  <AssistantFab />
                  <ChatWindow />
                  <AccountMenuDrawer />
                  <PuurMarktplaatsOverlay />
                </div>
              </div>
            </PuurMarktplaatsProvider>
          </AccountMenuProvider>
        </ChatProvider>
      </DemoModeProvider>
    </QueryClientProvider>
  );
}
