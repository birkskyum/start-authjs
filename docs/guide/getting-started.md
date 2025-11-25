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

## Basic Setup

### 1. Create Auth Configuration

Create a shared auth configuration file:

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

Create the auth API route to handle OAuth callbacks:

```ts
// src/routes/api/auth/$.ts (Solid Start)
// src/routes/api/auth/[...all].ts (React Start)
import { createFileRoute } from '@tanstack/solid-router'
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

### 3. Fetch Session in Root Route

```ts
// src/routes/__root.tsx
import { createServerFn } from '@tanstack/solid-start'
import { getRequest } from '@tanstack/solid-start/server'
import { getSession } from 'start-authjs'
import { authConfig } from '~/utils/auth'

const fetchSession = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()
  const session = await getSession(request, authConfig)
  return session
})

export const Route = createRootRoute({
  beforeLoad: async ({ context }) => {
    const session = await fetchSession()
    return { ...context, session }
  },
  component: RootComponent,
})
```

## Supported Providers

All Auth.js providers are supported. See the [Auth.js providers documentation](https://authjs.dev/getting-started/providers) for the full list.

Common providers:
- GitHub
- Google
- Auth0
- Discord
- Credentials (username/password)
