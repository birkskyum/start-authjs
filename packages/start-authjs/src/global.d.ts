declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AUTH_SECRET?: string
      AUTH_URL?: string
      AUTH_PATH?: string
      NODE_ENV?: string
    }
  }
}

export {}
