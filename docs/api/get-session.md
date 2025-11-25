# getSession

Retrieves the current session from a request.

## Import

```ts
import { getSession } from 'start-authjs'
```

## Signature

```ts
function getSession(
  request: Request,
  config: StartAuthJSConfig
): Promise<AuthSession | null>
```

## Parameters

### `request`

The incoming `Request` object containing the session cookie.

### `config`

Your auth configuration object.

## Returns

Returns `Promise<AuthSession | null>`:
- `AuthSession` object if the user is authenticated (with `user` and `expires` properties)
- `null` if no valid session exists

## Usage

### In Server Functions

```ts
import { createServerFn } from '@tanstack/solid-start'
import { getRequest } from '@tanstack/solid-start/server'
import { getSession } from 'start-authjs'
import { authConfig } from '~/utils/auth'

const getUser = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()
  const session = await getSession(request, authConfig)

  if (!session) {
    throw new Error('Not authenticated')
  }

  return session.user
})
```

### In Route Loaders

```ts
export const Route = createRootRoute({
  beforeLoad: async ({ context }) => {
    const session = await fetchSession()
    return { ...context, session }
  },
})
```

## Notes

- `getSession` does **not** forward cookies to the response
- Use `auth()` instead if you need to refresh session cookies
- The session is validated against the secret in your config
