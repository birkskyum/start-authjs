import { MetaProvider, Title } from "@solidjs/meta";
import { cache, createAsync, Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Show, Suspense, type ParentProps } from "solid-js";
import { getRequestEvent } from "solid-js/web";
import { getSession, type AuthSession } from "start-authjs";
import { authConfig } from "~/utils/auth";
import "./app.css";

export const getSessionData = cache(async (): Promise<AuthSession | null> => {
  "use server";
  const event = getRequestEvent();
  if (!event) return null;
  return getSession(event.request, authConfig);
}, "session");

function RootLayout(props: ParentProps) {
  const session = createAsync(() => getSessionData());

  return (
    <MetaProvider>
      <Title>SolidStart + Auth.js</Title>
      <nav style={{ padding: "1rem", display: "flex", gap: "1rem", "align-items": "center", "background-color": "#f5f5f5" }}>
        <a href="/">Home</a>
        <a href="/protected">Protected</a>
        <div style={{ "margin-left": "auto", display: "flex", gap: "1rem", "align-items": "center" }}>
          <Suspense>
            <Show
              when={session()}
              fallback={
                <a rel="external" href="/api/auth/signin" style={{ padding: "0.5rem 1rem", "background-color": "#3b82f6", color: "white", "border-radius": "0.25rem", "text-decoration": "none" }}>
                  Sign In
                </a>
              }
            >
              <span>{session()?.user?.name || session()?.user?.email}</span>
              <a rel="external" href="/api/auth/signout" style={{ padding: "0.5rem 1rem", "background-color": "#ef4444", color: "white", "border-radius": "0.25rem", "text-decoration": "none" }}>
                Sign Out
              </a>
            </Show>
          </Suspense>
        </div>
      </nav>
      <Suspense>{props.children}</Suspense>
    </MetaProvider>
  );
}

export default function App() {
  return (
    <Router root={RootLayout}>
      <FileRoutes />
    </Router>
  );
}
