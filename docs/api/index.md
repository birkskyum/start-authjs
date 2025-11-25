# StartAuthJS

Creates HTTP handlers for Auth.js routes.

## Import

```ts
import { StartAuthJS } from 'start-authjs'
```

## Signature

```ts
function StartAuthJS(
  config: StartAuthJSConfig | ((context: AuthRequestContext) => Promise<StartAuthJSConfig>)
): StartAuthJSHandlers
```

## Parameters

### `config`

Either a static configuration object or an async function that returns a configuration.

## Returns

```ts
interface StartAuthJSHandlers {
  GET: (context: AuthRequestContext) => Promise<Response>
  POST: (context: AuthRequestContext) => Promise<Response>
  signIn: (context: AuthRequestContext) => Promise<Response | string | void>
  signOut: (context: AuthRequestContext) => Promise<Response | string | void>
}
```

## Usage

```ts
import { createFileRoute } from '@tanstack/solid-router'
import { StartAuthJS } from 'start-authjs'
import GitHub from '@auth/core/providers/github'

const { GET, POST } = StartAuthJS({
  secret: process.env.AUTH_SECRET,
  providers: [GitHub],
})

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: ({ request }) => GET({ request, response: new Response() }),
      POST: ({ request }) => POST({ request, response: new Response() }),
    },
  },
})
```

## Dynamic Configuration

```ts
const { GET, POST } = StartAuthJS(async (context) => {
  // Load config based on request
  return {
    secret: process.env.AUTH_SECRET,
    providers: [GitHub],
  }
})
```
