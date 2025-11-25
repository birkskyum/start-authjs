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
      <nav class="p-4 flex gap-4 items-center bg-gray-100">
        <a href="/" class="hover:underline">Home</a>
        <a href="/protected" class="hover:underline">Protected</a>
        <div class="ml-auto flex items-center gap-4">
          <Suspense>
            <Show
              when={session()}
              fallback={
                <a
                  rel="external"
                  href="/api/auth/signin"
                  class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Sign In
                </a>
              }
            >
              <span class="text-gray-600">
                {session()?.user?.name || session()?.user?.email}
              </span>
              <a
                rel="external"
                href="/api/auth/signout"
                class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Sign Out
              </a>
            </Show>
          </Suspense>
        </div>
      </nav>
      <main class="p-4">
        <Suspense>{props.children}</Suspense>
      </main>
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
