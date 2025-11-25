import { Auth, createActionURL } from '@auth/core'
import { parse as parseCookies } from 'set-cookie-parser'
import { setEnvDefaults } from './utils'
import type { Session } from '@auth/core/types'
import type { AuthRequestContext, StartAuthJSConfig } from './types'

export type GetSessionResult = Promise<Session | null>

/**
 * Get the current session from a request
 *
 * Usage in server functions or loaders:
 * ```ts
 * import { getSession } from 'start-authjs'
 *
 * const session = await getSession(request, authConfig)
 * if (!session) {
 *   throw redirect('/login')
 * }
 * ```
 */
export async function getSession(
  request: Request,
  config: StartAuthJSConfig,
): GetSessionResult {
  setEnvDefaults(process.env, config)

  const { protocol } = new URL(request.url)

  const url = createActionURL(
    'session',
    protocol,
    new Headers(request.headers),
    process.env,
    config,
  )

  const response = await Auth(
    new Request(url, { headers: request.headers }),
    config,
  )

  const { status = 200 } = response

  const data = await response.json()

  if (!data || !Object.keys(data).length) return null
  if (status === 200) return data
  throw new Error(data.message)
}

/**
 * Get the session and update response cookies
 * Use this when you need to refresh session cookies
 *
 * Usage in loaders or server functions:
 * ```ts
 * import { auth } from 'start-authjs'
 *
 * const session = await auth(context, authConfig)
 * ```
 */
export async function auth(
  context: AuthRequestContext,
  config: StartAuthJSConfig,
): Promise<Session | null> {
  setEnvDefaults(process.env, config)
  config.trustHost ??= true

  const { request } = context
  const { protocol } = new URL(request.url)

  const sessionUrl = createActionURL(
    'session',
    protocol,
    request.headers,
    process.env,
    config,
  )

  const sessionRequest = new Request(sessionUrl, {
    headers: { cookie: request.headers.get('cookie') ?? '' },
  })

  const response = await Auth(sessionRequest, config)

  // Forward cookies from auth response
  if (context.response) {
    const authCookies = parseCookies(response.headers.get('set-cookie') ?? '')
    for (const cookie of authCookies) {
      const { name, value, ...options } = cookie
      let cookieStr = `${name}=${value}; Path=/`
      if (options.httpOnly) cookieStr += '; HttpOnly'
      if (options.secure) cookieStr += '; Secure'
      if (options.sameSite) cookieStr += `; SameSite=${options.sameSite}`
      context.response.headers.append('set-cookie', cookieStr)
    }
  }

  const { status = 200 } = response
  const data = await response.json()

  if (!data || !Object.keys(data).length) return null
  if (status === 200) return data
  throw new Error(data.message)
}
