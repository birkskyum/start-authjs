# start-authjs

Auth.js integration for [TanStack Start](https://tanstack.com/start) and [SolidStart](https://start.solidjs.com) applications.

## Documentation

**[View full documentation](https://birkskyum.github.io/start-authjs/)**

## Installation

```bash
npm install start-authjs @auth/core
```

## Quick Start

### 1. Set Environment Variables

```bash
AUTH_SECRET=your-secret-key  # openssl rand -base64 32
AUTH_URL=http://localhost:3000/api/auth

# Provider-specific (e.g., Auth0)
AUTH_AUTH0_ID=your-client-id
AUTH_AUTH0_SECRET=your-client-secret
AUTH_AUTH0_ISSUER=https://your-tenant.auth0.com
```

### 2. Create Auth Configuration

```ts
// src/utils/auth.ts
import Auth0 from '@auth/core/providers/auth0'
import type { StartAuthJSConfig } from 'start-authjs'

export const authConfig: StartAuthJSConfig = {
  secret: process.env.AUTH_SECRET,
  providers: [Auth0()],
}
```

### 3. Create API Route

**TanStack Start:**
```ts
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

**SolidStart:**
```ts
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

### 4. Get Session

```ts
import { getSession } from 'start-authjs'
import { authConfig } from '~/utils/auth'

const session = await getSession(request, authConfig)
```

## API

| Export | Description |
|--------|-------------|
| `StartAuthJS` | Creates GET/POST handlers for auth routes |
| `getSession` | Get current session from request |
| `auth` | Get session with cookie forwarding |
| `authMiddleware` | Middleware for protected routes |
| `serverSignIn` | Programmatic sign in |
| `serverSignOut` | Programmatic sign out |

## Examples

- [TanStack Start + React + Auth0](./examples/tanstack-start-react-auth0)
- [TanStack Start + Solid + Auth0](./examples/tanstack-start-solid-auth0)
- [SolidStart v1](./examples/solidstart-v1)
- [SolidStart v2 Alpha](./examples/solidstart-v2-alpha)

## Providers

All [Auth.js providers](https://authjs.dev/getting-started/providers) are supported: GitHub, Google, Auth0, Discord, Credentials, and 80+ more.

## License

MIT
