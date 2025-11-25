# SolidStart v2 Alpha + Auth.js Example

This example demonstrates Auth.js integration with SolidStart 2.0 alpha (using Vite Environment API) with the `start-authjs` package.

> **Note**: This uses the experimental SolidStart 2.0 alpha. For the stable version, see `solidstart-v1`.

## Setup

1. Copy `.env.example` to `.env` and fill in your Auth0 credentials:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the dev server:

```bash
pnpm dev
```

## Auth0 Configuration

In your Auth0 dashboard, configure:
- **Allowed Callback URLs**: `http://localhost:3000/api/auth/callback/auth0`
- **Allowed Logout URLs**: `http://localhost:3000`
