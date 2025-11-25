import type { AuthConfig } from '@auth/core'

/**
 * User object in the session
 * Clean type without index signatures for better type inference
 */
export interface AuthUser {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
}

/**
 * Session returned by getSession and auth functions
 * Clean type without index signatures for better type inference in TanStack Start
 */
export interface AuthSession {
  user?: AuthUser
  expires: string
}

/**
 * Configuration for Start Auth.js
 * Extends @auth/core AuthConfig without the 'raw' option
 */
export interface StartAuthJSConfig extends Omit<AuthConfig, 'raw'> {}

/**
 * Options for signIn action
 */
export interface SignInOptions extends Record<string, unknown> {
  /**
   * Specify to which URL the user will be redirected after signing in.
   * Defaults to the page URL the sign-in is initiated from.
   */
  callbackUrl?: string
  /**
   * Whether to redirect the user after sign-in.
   * Defaults to true.
   */
  redirect?: boolean
  /**
   * The URL to redirect to after signing in.
   * Alias for callbackUrl for compatibility.
   */
  redirectTo?: string
}

/**
 * Options for signOut action
 */
export interface SignOutOptions<R extends boolean = true> {
  /**
   * The URL to redirect to after signing out.
   * Defaults to the current page.
   */
  redirectTo?: string
  /**
   * Whether to redirect the user after sign-out.
   * Defaults to true.
   */
  redirect?: R
}

/**
 * Authorization parameters to pass to the OAuth provider
 */
export type SignInAuthorizationParams =
  | string
  | Array<Array<string>>
  | Record<string, string>
  | URLSearchParams

/**
 * Internal URL representation
 */
export interface InternalUrl {
  origin: string
  host: string
  path: string
  base: string
  toString: () => string
}

/**
 * Session state for client-side usage
 */
export type SessionState =
  | {
      status: 'authenticated'
      data: AuthSession
    }
  | {
      status: 'unauthenticated'
      data: null
    }
  | {
      status: 'loading'
      data: undefined
    }

/**
 * Request context for TanStack Start
 */
export interface AuthRequestContext {
  request: Request
  response?: {
    headers: Headers
  }
}
