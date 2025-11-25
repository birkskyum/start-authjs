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
            { text: 'SolidStart', link: '/guide/solidstart' },
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
            { text: 'TanStackAuth', link: '/api/' },
            { text: 'getSession', link: '/api/get-session' },
            { text: 'auth', link: '/api/auth' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/birkskyum/start-authjs' },
    ],
  },
})
