import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/start-authjs/',
  title: 'Start Auth.js',
  description: 'Auth.js integration for TanStack Start',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Configuration', link: '/guide/configuration' },
          ],
        },
        {
          text: 'Frameworks',
          items: [
            { text: 'TanStack Start', link: '/guide/tanstack-start' },
            { text: 'SolidStart v1', link: '/guide/solidstart-v1' },
            { text: 'SolidStart v2 Alpha', link: '/guide/solidstart-v2' },
          ],
        },
        {
          text: 'Usage',
          items: [
            { text: 'Session Management', link: '/guide/session' },
            { text: 'Protecting Routes', link: '/guide/protecting-routes' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'StartAuthJS', link: '/api/' },
            { text: 'getSession', link: '/api/get-session' },
            { text: 'auth', link: '/api/auth' },
            { text: 'authMiddleware', link: '/api/auth-middleware' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/birkskyum/start-authjs' },
    ],
  },
})
