# Protecting Routes

## Using `beforeLoad`

Protect routes by checking the session in `beforeLoad`:

::: code-group

```ts [TanStack Start]
import { redirect, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/protected')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: '/login' })
    }
  },
  component: ProtectedPage,
})
```

```tsx [SolidStart]
// Use Show component to conditionally render
import { createAsync } from "@solidjs/router"
import { Show } from "solid-js"
import { getSessionData } from "~/app"

export default function ProtectedPage() {
  const session = createAsync(() => getSessionData())

  return (
    <Show
      when={session()}
      fallback={<a href="/api/auth/signin">Sign in required</a>}
    >
      <div>Protected content</div>
    </Show>
  )
}
```

:::

## Using Middleware (TanStack Start)

Create reusable auth middleware:

```ts
// src/utils/auth-middleware.ts
import { redirect } from '@tanstack/react-router'

export function requireAuth({ context }: { context: { session: unknown } }) {
  if (!context.session) {
    throw redirect({ to: '/login' })
  }
}
```

Use in routes:

```ts
export const Route = createFileRoute('/dashboard')({
  beforeLoad: requireAuth,
  component: Dashboard,
})
```

## Route Groups

Protect multiple routes using a layout route:

```ts
// src/routes/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: '/login' })
    }
  },
})
```

Then nest protected routes under `_authenticated/`:

```
src/routes/
├── _authenticated/
│   ├── dashboard.tsx
│   ├── settings.tsx
│   └── profile.tsx
├── login.tsx
└── __root.tsx
```

## Role-Based Access

Check user roles in `beforeLoad`:

```ts
export const Route = createFileRoute('/admin')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: '/login' })
    }
    if (context.session.user.role !== 'admin') {
      throw redirect({ to: '/unauthorized' })
    }
  },
  component: AdminDashboard,
})
```
