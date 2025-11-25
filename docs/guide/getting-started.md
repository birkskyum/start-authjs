# Getting Started

## Installation

```bash
npm install start-authjs @auth/core
```

## Environment Variables

Set up the required environment variables:

```bash
# Required
AUTH_SECRET=your-secret-key  # Generate with: openssl rand -base64 32
AUTH_URL=http://localhost:3000/api/auth

# Provider-specific (example for Auth0)
AUTH_AUTH0_ID=your-client-id
AUTH_AUTH0_SECRET=your-client-secret
AUTH_AUTH0_ISSUER=https://your-tenant.auth0.com
```

## Framework Guides

For detailed setup instructions, see the framework-specific guides:

- [TanStack Start (React/Solid)](/guide/tanstack-start)
- [SolidStart v1](/guide/solidstart-v1)
- [SolidStart v2 Alpha](/guide/solidstart-v2)

## Quick Start

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

::: code-group

```ts [TanStack Start]
// src/routes/api/auth/$.ts
import { createFileRoute } from '@tanstack/react-router'
import { StartAuthJS } from 'start-authjs'
import { authConfig } from '~/utils/auth'

const { GET, POST } = StartAuthJS(authConfig)

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: ({ request }) => GET({ request, response: new Response() }),
      POST: ({ request }) => POST({ request, response: new Response() }),
    },
  },
})
```

```ts [SolidStart (v1 & v2)]
// src/routes/api/auth/[...solidauth].ts
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

:::

::: tip
The API route code is identical for SolidStart v1 and v2. Only the [config files differ](/guide/solidstart-v1#configuration).
:::

### 3. Fetch Session

::: code-group

```ts [TanStack Start]
// src/routes/__root.tsx
import type { AuthSession } from 'start-authjs'
import { createRootRouteWithContext } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { getSession } from 'start-authjs'
import { authConfig } from '~/utils/auth'

interface RouterContext {
  session: AuthSession | null
}

const fetchSession = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()
  return await getSession(request, authConfig)
})

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    const session = await fetchSession()
    return { session }
  },
  component: RootComponent,
})
```

```ts [SolidStart (v1 & v2)]
// src/app.tsx
import { cache } from "@solidjs/router"
import { getRequestEvent } from "solid-js/web"
import { getSession, type AuthSession } from "start-authjs"
import { authConfig } from "~/utils/auth"

export const getSessionData = cache(async (): Promise<AuthSession | null> => {
  "use server"
  const event = getRequestEvent()
  if (!event) return null
  return getSession(event.request, authConfig)
}, "session")
```

:::

## Supported Providers

All Auth.js providers are supported. See the [Auth.js providers documentation](https://authjs.dev/getting-started/providers) for the full list.

Common providers:
- GitHub
- Google
- Auth0
- Discord
- Credentials (username/password)
