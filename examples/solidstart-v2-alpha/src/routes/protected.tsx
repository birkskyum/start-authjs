import { Title } from "@solidjs/meta";
import { createAsync } from "@solidjs/router";
import { Show, Suspense } from "solid-js";
import { getSessionData } from "~/app";

export default function Protected() {
  const session = createAsync(() => getSessionData());

  return (
    <main style={{ padding: "1rem" }}>
      <Title>Protected - SolidStart + Auth.js</Title>
      <h1>Protected Page</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <Show
          when={session()}
          fallback={
            <div>
              <p>You must be signed in to view this page.</p>
              <a rel="external" href="/api/auth/signin">Sign in</a>
            </div>
          }
        >
          <div>
            <p>Welcome, {session()?.user?.name || session()?.user?.email}!</p>
            <pre style={{ background: "#f5f5f5", padding: "1rem", "border-radius": "0.5rem", overflow: "auto" }}>
              {JSON.stringify(session(), null, 2)}
            </pre>
          </div>
        </Show>
      </Suspense>
    </main>
  );
}
