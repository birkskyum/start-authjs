import { Auth } from '@auth/core'
import { getBasePath, setEnvDefaults } from './utils'
import { serverSignIn, serverSignOut } from './actions'
import type { AuthRequestContext, StartAuthJSConfig } from './types'

const authorizationParamsPrefix = 'authorizationParams-'

export interface StartAuthJSHandlers {
  GET: (context: AuthRequestContext) => Promise<Response>
  POST: (context: AuthRequestContext) => Promise<Response>
  signIn: (context: AuthRequestContext) => Promise<Response | string | void>
  signOut: (context: AuthRequestContext) => Promise<Response | string | void>
}

/**
 * Create TanStack Start Auth handlers for API routes
 *
 * Usage in your API route (e.g., routes/api/auth/[...all].ts):
 * ```ts
 * import { StartAuthJS } from 'start-authjs'
 * import GitHub from '@auth/core/providers/github'
 *
 * const { GET, POST } = StartAuthJS({
 *   providers: [GitHub],
 * })
 *
 * export { GET, POST }
 * ```
 */
export function StartAuthJS(
  config:
    | StartAuthJSConfig
    | ((context: AuthRequestContext) => PromiseLike<StartAuthJSConfig>),
): StartAuthJSHandlers {
  const handler = async (context: AuthRequestContext): Promise<Response> => {
    const _config =
      typeof config === 'object' ? config : await config(context)

    setEnvDefaults(process.env, _config)
    _config.basePath ??= getBasePath(_config)

    const { request } = context

    // Pass directly to Auth - it handles action extraction internally
    return Auth(request, _config)
  }

  return {
    GET: handler,
    POST: handler,
    signIn: async (context: AuthRequestContext) => {
      const { request } = context
      const _config =
        typeof config === 'object' ? config : await config(context)
      setEnvDefaults(process.env, _config)

      const formData = await request.formData()
      const { providerId: provider, ...options } = Object.fromEntries(formData)

      // Extract authorization params from options prefixed with `authorizationParams-`
      const authorizationParams: Record<string, string> = {}
      const _options: Record<string, unknown> = {}

      for (const key in options) {
        if (key.startsWith(authorizationParamsPrefix)) {
          authorizationParams[key.slice(authorizationParamsPrefix.length)] =
            options[key] as string
        } else {
          _options[key] = options[key]
        }
      }

      return serverSignIn(
        provider as string,
        _options,
        authorizationParams,
        _config,
        context,
      )
    },
    signOut: async (context: AuthRequestContext) => {
      const _config =
        typeof config === 'object' ? config : await config(context)
      setEnvDefaults(process.env, _config)

      const options = Object.fromEntries(await context.request.formData())
      return serverSignOut(options, _config, context)
    },
  }
}
