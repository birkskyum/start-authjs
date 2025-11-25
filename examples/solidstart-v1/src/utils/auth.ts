import Auth0 from '@auth/core/providers/auth0'
import type { StartAuthJSConfig } from 'start-authjs'

/**
 * Auth.js configuration for SolidStart with Auth0
 */
export const authConfig: StartAuthJSConfig = {
  secret: process.env.AUTH_SECRET,
  providers: [
    Auth0({
      // Auth.js auto-reads AUTH_AUTH0_ID, AUTH_AUTH0_SECRET, AUTH_AUTH0_ISSUER from env
      authorization: {
        params: {
          scope: 'email openid profile',
          prompt: 'login',
        },
      },
    }),
  ],
}
