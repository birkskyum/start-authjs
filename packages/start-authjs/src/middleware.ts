import { getSession } from './session'
import type { StartAuthJSConfig } from './types'

/**
 * Middleware options
 */
export interface AuthMiddlewareOptions {
  /**
   * Paths to preload session for
   * Can be an array of paths or `true` to preload for all paths
   */
  paths: Array<string> | boolean
  /**
   * Auth configuration
   */
  config: StartAuthJSConfig
}

/**
 * Middleware context that will receive the session
 */
export interface MiddlewareContext {
  request: Request
  locals?: {
    session?: Awaited<ReturnType<typeof getSession>>
  }
}

/**
 * Create auth middleware for TanStack Start
 *
 * This middleware can preload the session for specified paths,
 * making it available in route loaders without additional requests.
 *
 * Usage:
 * ```ts
 * import { authMiddleware } from 'start-authjs'
 *
 * // In your middleware setup
 * const middleware = authMiddleware({
 *   paths: ['/dashboard', '/profile', '/settings'],
 *   config: authConfig,
 * })
 * ```
 */
export function authMiddleware(options: AuthMiddlewareOptions) {
  const { paths, config } = options

  return async (context: MiddlewareContext): Promise<void> => {
    const url = new URL(context.request.url)

    const shouldPreload =
      typeof paths === 'boolean'
        ? paths
        : paths.some((path) => {
            // Support simple path matching
            if (path === url.pathname) return true
            // Support wildcard paths like /dashboard/*
            if (path.endsWith('/*')) {
              const basePath = path.slice(0, -2)
              return url.pathname.startsWith(basePath)
            }
            // Support paths starting with the pattern
            return url.pathname.startsWith(path)
          })

    if (shouldPreload) {
      const session = await getSession(context.request, config)
      context.locals = context.locals || {}
      context.locals.session = session
    }
  }
}
