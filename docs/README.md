  # TanStack Start Auth.js Documentation

  This is the documentation site for `start-authjs`, built with
  [VitePress](https://vitepress.dev/).

  ## Development

  ```bash
  # Install dependencies
  pnpm install

  # Start dev server
  pnpm dev

  # Build for production
  pnpm build

  # Preview production build
  pnpm preview

  Structure

  docs/
  ├── .vitepress/
  │   └── config.ts      # VitePress configuration
  ├── api/               # API reference
  │   ├── index.md       # StartAuthJS
  │   ├── get-session.md # getSession function
  │   └── auth.md        # auth function
  ├── guide/             # User guides
  │   ├── getting-started.md
  │   ├── configuration.md
  │   ├── session.md
  │   └── protecting-routes.md
  ├── index.md           # Home page
  └── package.json

  Adding New Pages

  1. Create a new .md file in the appropriate directory
  2. Add the page to the sidebar in .vitepress/config.ts

  Links

  - https://tanstack.com/router
  - https://authjs.dev/
  - https://vitepress.dev/