# start-authjs

Auth.js (NextAuth.js v5) integration for TanStack Start applications.

## Installation

```bash
npm install start-authjs @auth/core

Quick Start

1. Set Environment Variables

AUTH_SECRET=your-secret-key  # openssl rand -base64 32
AUTH_URL=http://localhost:3000/api/auth

# Provider-specific (e.g., Auth0)
AUTH_AUTH0_ID=your-client-id
AUTH_AUTH0_SECRET=your-client-secret
AUTH_AUTH0_ISSUER=https://your-tenant.auth0.com

2. Create Auth Configuration

// src/utils/auth.ts
import Auth0 from '@auth/core/providers/auth0'
import type { StartAuthJSConfig } from 'start-authjs'

export const authConfig: StartAuthJSConfig = {
  secret: process.env.AUTH_SECRET,
  providers: [Auth0()],
}

3. Create API Route

// src/routes/api/auth/$.ts
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

4. Get Session

import { getSession } from 'start-authjs'
import { authConfig } from '~/utils/auth'

const session = await getSession(request, authConfig)

API

| Export        | Description                               |
|---------------|-------------------------------------------|
| StartAuthJS  | Creates GET/POST handlers for auth routes |
| getSession    | Get current session from request          |
| auth          | Get session with cookie forwarding        |
| serverSignIn  | Programmatic sign in                      |
| serverSignOut | Programmatic sign out                     |

Providers

All https://authjs.dev/getting-started/providers are supported: GitHub, Google, Auth0, Discord, 
Credentials, and 80+ more.

License

MIT