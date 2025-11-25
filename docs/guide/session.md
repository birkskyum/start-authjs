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

::: code-group

```tsx [TanStack Start (React)]
import { Route } from './__root'

function UserProfile() {
  const { session } = Route.useRouteContext()

  if (!session) return null

  return <p>Welcome, {session.user?.name}</p>
}
```

```tsx [TanStack Start (Solid)]
import { Show } from 'solid-js'
import { Route } from './__root'

function UserProfile() {
  const context = Route.useRouteContext()

  return (
    <Show when={context().session}>
      <p>Welcome, {context().session?.user?.name}</p>
    </Show>
  )
}
```

```tsx [SolidStart]
import { createAsync } from "@solidjs/router"
import { Show, Suspense } from "solid-js"
import { getSessionData } from "~/app"

function UserProfile() {
  const session = createAsync(() => getSessionData())

  return (
    <Suspense>
      <Show when={session()}>
        <p>Welcome, {session()?.user?.name}</p>
      </Show>
    </Suspense>
  )
}
```

:::

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
