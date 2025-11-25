# Protecting Routes

## Using `beforeLoad`

Protect routes by checking the session in `beforeLoad`:

```ts
import { redirect, createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/protected')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: '/login' })
    }
  },
  component: ProtectedPage,
})
```

## Using Middleware

Create reusable auth middleware:

```ts
// src/utils/auth-middleware.ts
import { redirect } from '@tanstack/solid-router'
import type { BeforeLoadContext } from '@tanstack/solid-router'

export function requireAuth(context: BeforeLoadContext) {
  if (!context.session) {
    throw redirect({
      to: '/login',
      search: { redirect: context.location.pathname },
    })
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
