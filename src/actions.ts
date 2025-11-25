import { Auth, createActionURL, raw, skipCSRFCheck } from '@auth/core'
import { setEnvDefaults } from './utils'
import type {
  AuthRequestContext,
  SignInAuthorizationParams,
  SignInOptions,
  SignOutOptions,
  StartAuthJSConfig,
} from './types'

/**
 * Server-side sign in action
 * This is used internally by the auth handler and can also be called directly from server functions
 */
export async function serverSignIn(
  provider: string | undefined,
  options: SignInOptions = {},
  authorizationParams: SignInAuthorizationParams = {},
  config: StartAuthJSConfig,
  context: AuthRequestContext,
): Promise<string | void> {
  const { request } = context
  const { protocol } = new URL(request.url)
  const headers = new Headers(request.headers)

  const {
    redirect: shouldRedirect = true,
    redirectTo,
    callbackUrl: _callbackUrl,
    ...rest
  } = options

  const callbackUrl =
    (redirectTo) ??
    (_callbackUrl) ??
    headers.get('Referer') ??
    '/'

  setEnvDefaults(process.env, config)
  const base = createActionURL('signin', protocol, headers, process.env, config)

  if (!provider) {
    const url = `${base}?${new URLSearchParams({ callbackUrl })}`
    if (shouldRedirect) {
      return redirectResponse(context, url)
    }
    return url
  }

  let url = `${base}/${provider}?${new URLSearchParams(
    typeof authorizationParams === 'string'
      ? authorizationParams
      : authorizationParams instanceof URLSearchParams
        ? authorizationParams
        : Array.isArray(authorizationParams)
          ? authorizationParams
          : Object.entries(authorizationParams),
  )}`

  let foundProvider: string | undefined = undefined

  for (const _provider of config.providers) {
    const { id } = typeof _provider === 'function' ? _provider() : _provider
    if (id === provider) {
      foundProvider = id
      break
    }
  }

  if (!foundProvider) {
    const url = `${base}?${new URLSearchParams({ callbackUrl })}`
    if (shouldRedirect) {
      return redirectResponse(context, url)
    }
    return url
  }

  if (foundProvider === 'credentials') {
    url = url.replace('signin', 'callback')
  }

  headers.set('Content-Type', 'application/x-www-form-urlencoded')
  const body = new URLSearchParams({ ...(rest as Record<string, string>), callbackUrl })
  const req = new Request(url, { method: 'POST', headers, body })
  const res = await Auth(req, { ...config, raw, skipCSRFCheck })

  // Set cookies from auth response
  if (context.response) {
    for (const c of res.cookies ?? []) {
      context.response.headers.append(
        'set-cookie',
        serializeCookie(c.name, c.value, normalizeCookieOptions(c.options)),
      )
    }
  }

  if (shouldRedirect && res.redirect) {
    return redirectResponse(context, res.redirect)
  }

  return res.redirect
}

/**
 * Server-side sign out action
 * This is used internally by the auth handler and can also be called directly from server functions
 */
export async function serverSignOut<R extends boolean = true>(
  options: SignOutOptions<R> | Record<string, unknown> = {},
  config: StartAuthJSConfig,
  context: AuthRequestContext,
): Promise<string | void> {
  const { request } = context
  const { protocol } = new URL(request.url)
  const headers = new Headers(request.headers)
  headers.set('Content-Type', 'application/x-www-form-urlencoded')

  setEnvDefaults(process.env, config)
  const url = createActionURL('signout', protocol, headers, process.env, config)
  const callbackUrl =
    (options as SignOutOptions).redirectTo ?? headers.get('Referer') ?? '/'
  const body = new URLSearchParams({ callbackUrl })
  const req = new Request(url, { method: 'POST', headers, body })

  const res = await Auth(req, { ...config, raw, skipCSRFCheck })

  // Set cookies from auth response
  if (context.response) {
    for (const c of res.cookies ?? []) {
      context.response.headers.append(
        'set-cookie',
        serializeCookie(c.name, c.value, normalizeCookieOptions(c.options)),
      )
    }
  }

  const shouldRedirect = (options as SignOutOptions).redirect ?? true
  if (shouldRedirect && res.redirect) {
    return redirectResponse(context, res.redirect)
  }

  return res.redirect
}

/**
 * Normalize cookie options from @auth/core to our expected format
 * Handles the boolean sameSite type that @auth/core may return
 */
function normalizeCookieOptions(
  options?: {
    httpOnly?: boolean
    secure?: boolean
    sameSite?: boolean | 'lax' | 'strict' | 'none'
    path?: string
    maxAge?: number
    expires?: Date
  },
): {
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'lax' | 'strict' | 'none'
  path?: string
  maxAge?: number
  expires?: Date
} | undefined {
  if (!options) return undefined

  return {
    ...options,
    sameSite: typeof options.sameSite === 'boolean'
      ? (options.sameSite ? 'strict' : 'lax')
      : options.sameSite,
  }
}

/**
 * Helper to serialize a cookie
 */
function serializeCookie(
  name: string,
  value: string,
  options?: {
    httpOnly?: boolean
    secure?: boolean
    sameSite?: 'lax' | 'strict' | 'none'
    path?: string
    maxAge?: number
    expires?: Date
  },
): string {
  let cookie = `${name}=${value}`

  if (options?.path) {
    cookie += `; Path=${options.path}`
  } else {
    cookie += '; Path=/'
  }

  if (options?.httpOnly) {
    cookie += '; HttpOnly'
  }

  if (options?.secure) {
    cookie += '; Secure'
  }

  if (options?.sameSite) {
    cookie += `; SameSite=${options.sameSite}`
  }

  if (options?.maxAge !== undefined) {
    cookie += `; Max-Age=${options.maxAge}`
  }

  if (options?.expires) {
    cookie += `; Expires=${options.expires.toUTCString()}`
  }

  return cookie
}

/**
 * Helper to create a redirect response
 * This is framework-agnostic - specific frameworks can override this behavior
 */
function redirectResponse(context: AuthRequestContext, url: string): void {
  // For TanStack Start, we typically throw a redirect
  // But since this is core, we just set the header
  if (context.response) {
    context.response.headers.set('Location', url)
  }
  // The calling code should handle the actual redirect
}
