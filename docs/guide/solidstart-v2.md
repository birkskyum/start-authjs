# SolidStart v2 Alpha

This guide covers using `start-authjs` with [SolidStart](https://docs.solidjs.com/solid-start) 2.0 alpha, which uses the new Vite Environment API.

::: warning
SolidStart v2 is in alpha. APIs may change. For production, use [SolidStart v1](/guide/solidstart-v1).
:::

**External Documentation:**
- [SolidStart Docs](https://docs.solidjs.com/solid-start) - Official SolidStart documentation
- [Solid Router](https://docs.solidjs.com/solid-router) - Routing and data loading
- [Vite Environment API](https://vite.dev/guide/api-environment) - Vite's multi-environment support
- [Auth.js](https://authjs.dev) - Authentication providers and configuration

## Installation

```bash
pnpm add start-authjs @auth/core @solidjs/start@2.0.0-alpha.0 vite@^7
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

SolidStart v2 uses `vite.config.ts` with the Vite Environment API. You need to manually load `.env` files:

```ts
// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import { solidStart } from "@solidjs/start/config";
import { nitroV2Plugin } from "@solidjs/vite-plugin-nitro-2";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    server: {
      port: 3000,
    },
    plugins: [solidStart(), nitroV2Plugin()],
  };
});
```

**`package.json` scripts**:
```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build"
  }
}
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

Use `cache` and `createAsync` from `@solidjs/router` for proper SSR hydration:

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

## Full Example

See the complete example at [examples/solidstart-v2-alpha](https://github.com/birkskyum/start-authjs/tree/main/examples/solidstart-v2-alpha).

## Key Differences from v1

| Feature | SolidStart v1 | SolidStart v2 Alpha |
|---------|---------------|---------------------|
| Config File | `app.config.ts` | `vite.config.ts` |
| Build Tool | Vinxi | Vite Environment API |
| Env Loading | Automatic | Manual with `loadEnv` |
| Scripts | `vinxi dev/build` | `vite dev/build` |
| Status | Stable | Alpha |
