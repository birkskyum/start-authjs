# authMiddleware

Creates middleware to preload session for specified routes.

## Import

```ts
import { authMiddleware } from 'start-authjs'
```

## Signature

```ts
function authMiddleware(options: AuthMiddlewareOptions): (context: MiddlewareContext) => Promise<void>
```

## Parameters

### `options`

```ts
interface AuthMiddlewareOptions {
  // Paths to preload session for
  // Can be an array of paths or `true` to preload for all paths
  paths: Array<string> | boolean

  // Auth configuration
  config: StartAuthJSConfig
}
```

## Returns

A middleware function that preloads the session and stores it in `context.locals.session`.

## Usage

```ts
import { authMiddleware } from 'start-authjs'
import { authConfig } from '~/utils/auth'

const middleware = authMiddleware({
  paths: ['/dashboard', '/profile', '/settings'],
  config: authConfig,
})
```

## Path Matching

The middleware supports several path matching patterns:

```ts
authMiddleware({
  paths: [
    '/dashboard',      // Exact match
    '/profile/*',      // Wildcard - matches /profile/anything
    '/settings',       // Also matches /settings/nested
  ],
  config: authConfig,
})

// Or preload for all paths
authMiddleware({
  paths: true,
  config: authConfig,
})
```

## Accessing Preloaded Session

After the middleware runs, the session is available in `context.locals.session`:

```ts
// In a route loader or server function
const session = context.locals?.session
```

## Notes

- The middleware only preloads the session; it does not enforce authentication
- Use in combination with route-level `beforeLoad` checks for protection
- Reduces database/auth calls by preloading session once per request
