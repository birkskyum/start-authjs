import { Title } from "@solidjs/meta";
import { createAsync } from "@solidjs/router";
import { Show, Suspense } from "solid-js";
import { getSessionData } from "~/app";

export default function Home() {
  const session = createAsync(() => getSessionData());

  return (
    <div class="max-w-2xl mx-auto">
      <Title>SolidStart + Auth.js</Title>
      <h1 class="text-3xl font-bold mb-4">SolidStart Auth.js Example</h1>
      <p class="text-gray-600 mb-8">
        This example demonstrates Auth.js integration with SolidStart using
        Auth0 OAuth.
      </p>

      <div class="bg-gray-50 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Auth Status</h2>

        <Suspense fallback={<p class="text-gray-500">Loading...</p>}>
          <Show
            when={session()}
            fallback={
              <p class="text-gray-500">
                You are not signed in. Click "Sign In" in the navigation bar to
                authenticate with Auth0.
              </p>
            }
          >
            <div class="space-y-2">
              <p class="text-green-600 font-medium">Authenticated</p>
              <Show when={session()?.user?.image}>
                <img
                  src={session()?.user?.image!}
                  alt="Avatar"
                  class="w-16 h-16 rounded-full"
                />
              </Show>
              <p>
                <strong>Name:</strong> {session()?.user?.name ?? "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {session()?.user?.email ?? "N/A"}
              </p>
            </div>
          </Show>
        </Suspense>
      </div>
    </div>
  );
}
