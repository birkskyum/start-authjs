# TanStack Start Integration

This guide covers using `start-authjs` with [TanStack Start](https://tanstack.com/start) (React or Solid).

**External Documentation:**
- [TanStack Start Docs](https://tanstack.com/start/latest/docs/framework/react/overview) - Official TanStack Start documentation
- [TanStack Router](https://tanstack.com/router/latest/docs/framework/react/overview) - File-based routing and data loading
- [Auth.js](https://authjs.dev) - Authentication providers and configuration

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

Create a catch-all route at `src/routes/api/auth/$.ts`:

::: code-group

```ts [React]
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

```ts [Solid]
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
```

:::

### 3. Fetch Session in Root Route

::: code-group

```tsx [React]
// src/routes/__root.tsx
import type { AuthSession } from 'start-authjs'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { getSession } from 'start-authjs'
import { authConfig } from '~/utils/auth'

interface RouterContext {
  session: AuthSession | null
}

const fetchSession = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()
  const session = await getSession(request, authConfig)
  return session
})

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    const session = await fetchSession()
    return { session }
  },
  component: () => <Outlet />,
})
```

```tsx [Solid]
// src/routes/__root.tsx
import type { AuthSession } from 'start-authjs'
import { createRootRouteWithContext, Outlet } from '@tanstack/solid-router'
import { createServerFn } from '@tanstack/solid-start'
import { getRequest } from '@tanstack/solid-start/server'
import { getSession } from 'start-authjs'
import { authConfig } from '~/utils/auth'

interface RouterContext {
  session: AuthSession | null
}

const fetchSession = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()
  const session = await getSession(request, authConfig)
  return session
})

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    const session = await fetchSession()
    return { session }
  },
  component: () => <Outlet />,
})
```

:::

### 4. Use Session in Components

::: code-group

```tsx [React]
import { Route } from './__root'

function AuthStatus() {
  const { session } = Route.useRouteContext()

  return session ? (
    <>
      <span>{session.user?.name}</span>
      <a href="/api/auth/signout">Sign Out</a>
    </>
  ) : (
    <a href="/api/auth/signin">Sign In</a>
  )
}
```

```tsx [Solid]
import { Show } from 'solid-js'
import { Route } from './__root'

function AuthStatus() {
  const routeContext = Route.useRouteContext()

  return (
    <Show
      when={routeContext().session}
      fallback={<a href="/api/auth/signin">Sign In</a>}
    >
      <span>{routeContext().session?.user?.name}</span>
      <a href="/api/auth/signout">Sign Out</a>
    </Show>
  )
}
```

:::

## Protecting Routes

You can protect routes using the `beforeLoad` hook:

```tsx
export const Route = createFileRoute('/protected')({
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: '/login' })
    }
  },
  component: ProtectedPage,
})
```

## Full Examples

- **React**: [examples/tanstack-start-react-auth0](https://github.com/birkskyum/start-authjs/tree/main/examples/tanstack-start-react-auth0)
- **Solid**: [examples/tanstack-start-solid-auth0](https://github.com/birkskyum/start-authjs/tree/main/examples/tanstack-start-solid-auth0)

## Key Patterns

| Feature | Description |
|---------|-------------|
| API Routes | Use `createFileRoute` with `server.handlers` for GET/POST |
| Server Functions | Use `createServerFn` from `@tanstack/[react\|solid]-start` |
| Request Access | Use `getRequest()` from `@tanstack/[react\|solid]-start/server` |
| Route Context | Use `createRootRouteWithContext<T>()` for typed session access |
| Session Access | Use `Route.useRouteContext()` in components |
