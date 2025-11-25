# SolidStart Integration

This guide covers using `start-authjs` with SolidStart. Examples are provided for both v1 (stable) and v2 alpha.

## Installation

```bash
pnpm add start-authjs @auth/core
```

## Environment Variables

```bash
AUTH_SECRET=your-secret-key  # Generate with: openssl rand -base64 32
AUTH_URL=http://localhost:3000/api/auth

# Provider-specific (example for Auth0)
AUTH_AUTH0_ID=your-client-id
AUTH_AUTH0_SECRET=your-client-secret
AUTH_AUTH0_ISSUER=https://your-tenant.auth0.com
```

## Configuration

### SolidStart v1 (Stable)

Create `app.config.ts`:

```ts
import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  server: {
    port: 3000,
  },
});
```

### SolidStart v2 Alpha

For v2 alpha, use `vite.config.ts` and load env manually:

```ts
import { defineConfig, loadEnv } from "vite";
import { solidStart } from "@solidjs/start/config";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [solidStart()],
  };
});
```

## Setup

### 1. Create Auth Configuration

```ts
// src/utils/auth.ts
import Auth0 from '@auth/core/providers/auth0'
import type { StartAuthJSConfig } from 'start-authjs'

export const authConfig: StartAuthJSConfig = {
  secret: process.env.AUTH_SECRET,
  providers: [
    Auth0({
      // Auth.js auto-reads AUTH_AUTH0_* env vars
    }),
  ],
}
```

### 2. Create API Route Handler

Create a catch-all route at `src/routes/api/auth/[...solidauth].ts`:

```ts
import type { APIEvent } from '@solidjs/start/server'
import { StartAuthJS } from 'start-authjs'
import { authConfig } from '~/utils/auth'

const { GET: AuthGET, POST: AuthPOST } = StartAuthJS(authConfig)

export const GET = (event: APIEvent) => {
  return AuthGET({ request: event.request, response: new Response() })
}

export const POST = (event: APIEvent) => {
  return AuthPOST({ request: event.request, response: new Response() })
}
```

### 3. Create Session Helper

In SolidStart, use `cache` and `createAsync` from `@solidjs/router` for proper SSR hydration:

```ts
// src/app.tsx
import { cache, createAsync, Router } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { getSession, type AuthSession } from "start-authjs";
import { authConfig } from "~/utils/auth";

export const getSessionData = cache(async (): Promise<AuthSession | null> => {
  "use server";
  const event = getRequestEvent();
  if (!event) return null;
  return getSession(event.request, authConfig);
}, "session");
```

### 4. Use Session in Components

```tsx
import { createAsync } from "@solidjs/router";
import { Show, Suspense } from "solid-js";
import { getSessionData } from "~/app";

function AuthStatus() {
  const session = createAsync(() => getSessionData());

  return (
    <Suspense>
      <Show
        when={session()}
        fallback={<a href="/api/auth/signin">Sign In</a>}
      >
        <span>{session()?.user?.name}</span>
        <a href="/api/auth/signout">Sign Out</a>
      </Show>
    </Suspense>
  );
}
```

## Full Examples

- **SolidStart v1 (stable)**: [examples/solidstart-v1](https://github.com/birkskyum/start-authjs/tree/main/examples/solidstart-v1)
- **SolidStart v2 alpha**: [examples/solidstart-v2-alpha](https://github.com/birkskyum/start-authjs/tree/main/examples/solidstart-v2-alpha)

## Key Differences from TanStack Start

| Feature | TanStack Start | SolidStart |
|---------|---------------|------------|
| API Routes | `createFileRoute` with `server.handlers` | Export `GET`/`POST` functions |
| Server Functions | `createServerFn` | `"use server"` directive |
| Request Access | `getRequest()` | `getRequestEvent().request` |
| Data Fetching | `createServerFn` + route context | `cache` + `createAsync` |
