# auth

Gets the session and forwards authentication cookies to the response.

## Import

```ts
import { auth } from 'start-authjs'
```

## Signature

```ts
function auth(
  context: AuthRequestContext,
  config: StartAuthJSConfig
): Promise<AuthSession | null>
```

## Parameters

### `context`

An object containing:
- `request`: The incoming `Request` object
- `response`: The `Response` object to forward cookies to

### `config`

Your auth configuration object.

## Returns

Returns `Promise<AuthSession | null>`:
- `AuthSession` object if the user is authenticated (with `user` and `expires` properties)
- `null` if no valid session exists

## Usage

```ts
import { auth } from 'start-authjs'
import { authConfig } from '~/utils/auth'

const session = await auth(
  {
    request,
    response: new Response(),
  },
  authConfig
)

if (session) {
  console.log('User:', session.user.name)
}
```

## When to Use

Use `auth()` instead of `getSession()` when:
- You need to refresh session cookies
- You're implementing middleware that modifies the response
- The session token needs to be extended

## Notes

- Automatically sets `trustHost: true` if not specified
- Parses and forwards `Set-Cookie` headers from Auth.js response
- Uses `set-cookie-parser` internally for proper cookie handling
