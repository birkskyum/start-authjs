import { Title } from "@solidjs/meta";
import { createAsync } from "@solidjs/router";
import { Show, Suspense } from "solid-js";
import { getSessionData } from "~/app";

export default function Protected() {
  const session = createAsync(() => getSessionData());

  return (
    <div class="max-w-2xl mx-auto">
      <Title>Protected - SolidStart + Auth.js</Title>
      <h1 class="text-3xl font-bold mb-4">Protected Page</h1>
      <p class="text-gray-600 mb-8">
        This page is only accessible to authenticated users.
      </p>

      <Suspense fallback={<p class="text-gray-500">Loading...</p>}>
        <Show
          when={session()}
          fallback={
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p class="text-yellow-800">
                You must be signed in to view this page.
              </p>
              <a
                rel="external"
                href="/api/auth/signin"
                class="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Sign in
              </a>
            </div>
          }
        >
          <div class="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-4 text-green-800">
              Welcome, {session()?.user?.name ?? "User"}!
            </h2>

            <Show when={session()?.user}>
              <div class="space-y-2 text-green-700">
                <p>
                  <strong>Email:</strong> {session()?.user?.email ?? "N/A"}
                </p>
                <Show when={session()?.user?.image}>
                  <div>
                    <strong>Avatar:</strong>
                    <img
                      src={session()?.user?.image!}
                      alt="User avatar"
                      class="w-20 h-20 rounded-full mt-2"
                    />
                  </div>
                </Show>
              </div>
            </Show>
          </div>

          <div class="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 class="font-semibold mb-2">Session Data (Debug)</h3>
            <pre class="text-xs overflow-auto bg-gray-800 text-green-400 p-4 rounded">
              {JSON.stringify(session(), null, 2)}
            </pre>
          </div>
        </Show>
      </Suspense>
    </div>
  );
}
