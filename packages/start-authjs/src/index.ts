export { StartAuthJS } from './handler'
export { getSession, auth } from './session'
export { serverSignIn, serverSignOut } from './actions'
export { authMiddleware } from './middleware'
export { setEnvDefaults, getBasePath, parseUrl } from './utils'
export type {
  AuthSession,
  AuthUser,
  StartAuthJSConfig,
  SignInOptions,
  SignOutOptions,
  SignInAuthorizationParams,
  AuthRequestContext,
} from './types'

// Re-export useful types from @auth/core
export { AuthError, CredentialsSignin } from '@auth/core/errors'
export type {
  Account,
  DefaultSession,
  Profile,
  Session,
  User,
} from '@auth/core/types'
