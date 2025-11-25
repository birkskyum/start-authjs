import { setEnvDefaults as coreSetEnvDefaults } from '@auth/core'
import type { InternalUrl, StartAuthJSConfig } from './types'

/**
 * Parse a URL string into components
 */
export function parseUrl(url?: string | URL): InternalUrl {
  const defaultUrl = new URL('http://localhost:3000/api/auth')

  if (url && !url.toString().startsWith('http')) {
    url = `https://${url}`
  }

  const _url = new URL(url ?? defaultUrl)
  const path = (
    _url.pathname === '/' ? defaultUrl.pathname : _url.pathname
  ).replace(/\/$/, '')

  const base = `${_url.origin}${path}`

  return {
    origin: _url.origin,
    host: _url.host,
    path,
    base,
    toString: () => base,
  }
}

/**
 * Get current timestamp in seconds
 */
export function now() {
  return Math.floor(Date.now() / 1000)
}

/**
 * Get environment variable, checking both process.env and import.meta.env
 */
export const getEnv = (env: string): string | undefined => {
  // Check import.meta.env for Vite environments
  if (env.startsWith('VITE_')) {
    return (import.meta as any).env?.[env]
  }
  // Check process.env for server environments
  if (typeof process !== 'undefined' && typeof process.env !== 'undefined') {
    return process.env[env]
  }
  return undefined
}

/**
 * Get the first defined environment variable from a list
 */
export const conditionalEnv = (...envs: Array<string>): string | undefined => {
  for (const env of envs) {
    const value = getEnv(env)
    if (value) {
      return value
    }
  }
  return undefined
}

/**
 * Set default environment values on the config
 */
export function setEnvDefaults(
  envObject: Record<string, string | undefined>,
  config: StartAuthJSConfig,
) {
  coreSetEnvDefaults(envObject, config)
  config.trustHost ??= process.env.NODE_ENV === 'development'
  // Only set basePath if AUTH_URL is not defined (to avoid redundant warning)
  if (!envObject.AUTH_URL) {
    config.basePath ??= getBasePath(config)
  }
}

/**
 * Get the base path for auth routes
 */
export const getBasePath = (config?: StartAuthJSConfig): string => {
  if (config?.basePath) return config.basePath
  const ev = conditionalEnv('VITE_AUTH_PATH', 'AUTH_PATH')
  return ev ?? '/api/auth'
}
