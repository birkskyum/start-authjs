# Session Management

## Getting the Session

There are two ways to get the current session:

### `getSession` - Simple Session Fetch

Use `getSession` when you just need to read the session data:

```ts
import { getSession } from 'start-authjs'
import { authConfig } from '~/utils/auth'

const session = await getSession(request, authConfig)

if (session) {
  console.log('Logged in as:', session.user.name)
} else {
  console.log('Not authenticated')
}
```

### `auth` - Session with Cookie Forwarding

Use `auth` when you need to refresh session cookies (e.g., in middleware):

```ts
import { auth } from 'start-authjs'
import { authConfig } from '~/utils/auth'

const session = await auth({ request, response }, authConfig)
```

## Using Session in Components

Access the session via route context:

```tsx
// Solid.js
function UserProfile() {
  const context = Route.useRouteContext()

  return (
    <Show when={context().session}>
      <p>Welcome, {context().session?.user?.name}</p>
    </Show>
  )
}
```

```tsx
// React
function UserProfile() {
  const { session } = Route.useRouteContext()

  if (!session) return null

  return <p>Welcome, {session.user?.name}</p>
}
```

## Sign In / Sign Out

### Client-Side Navigation

```html
<!-- Sign in -->
<a href="/api/auth/signin">Sign In</a>

<!-- Sign out -->
<a href="/api/auth/signout">Sign Out</a>

<!-- Sign in with specific provider -->
<a href="/api/auth/signin/github">Sign in with GitHub</a>
```

### Programmatic Sign In/Out

Use the `serverSignIn` and `serverSignOut` actions:

```ts
import { serverSignIn, serverSignOut } from 'start-authjs'
import { authConfig } from '~/utils/auth'

// Sign in
await serverSignIn('github', {}, {}, authConfig, context)

// Sign out
await serverSignOut({}, authConfig, context)
```
