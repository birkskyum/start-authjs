# Configuration

## StartAuthJSConfig

The `StartAuthJSConfig` type extends Auth.js's `AuthConfig` with TanStack-specific options.

```ts
import type { StartAuthJSConfig } from 'start-authjs'

export const authConfig: StartAuthJSConfig = {
  // Required: Secret for signing tokens
  secret: process.env.AUTH_SECRET,

  // Required: Array of authentication providers
  providers: [
    // Add your providers here
  ],

  // Optional: Base path for auth routes (default: /api/auth)
  // Note: Not needed if AUTH_URL is set (it includes the path)
  basePath: '/api/auth',

  // Optional: Trust the host header (default: true in development)
  trustHost: true,

  // Optional: Callbacks for customizing behavior
  callbacks: {
    // Customize the JWT token
    jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },

    // Customize the session object
    session({ session, token }) {
      session.accessToken = token.accessToken
      return session
    },
  },
}
```

## Environment Variables

Auth.js automatically reads certain environment variables:

| Variable | Description |
|----------|-------------|
| `AUTH_SECRET` | Secret key for signing tokens |
| `AUTH_URL` | Full URL of your auth endpoint |
| `AUTH_TRUST_HOST` | Trust the host header |

### Provider Environment Variables

Providers follow the pattern `AUTH_<PROVIDER>_<OPTION>`:

```bash
# GitHub
AUTH_GITHUB_ID=your-client-id
AUTH_GITHUB_SECRET=your-client-secret

# Google
AUTH_GOOGLE_ID=your-client-id
AUTH_GOOGLE_SECRET=your-client-secret

# Auth0
AUTH_AUTH0_ID=your-client-id
AUTH_AUTH0_SECRET=your-client-secret
AUTH_AUTH0_ISSUER=https://your-tenant.auth0.com
```

## Session Customization

Extend the session type using module augmentation:

```ts
// src/utils/auth.ts
declare module '@auth/core/types' {
  interface Session {
    user: {
      name: string
      email: string
      sub: string
    }
    accessToken?: string
  }
}
```
