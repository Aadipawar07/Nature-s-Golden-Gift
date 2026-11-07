# Nature's Golden Gift

MERN D2C ecommerce monorepo for Nature's Golden Gift.

## Requirements

- Node.js 20 (use `.nvmrc`)
- npm 10+

## Setup

```sh
npm ci
```

Copy the relevant `.env.example` to a local `.env` only; never commit real environment files.

## Workspaces

```sh
npm run dev:storefront
npm run dev:crm
npm run dev:server
```

The storefront runs on Vite's default port, the CRM is a separate Vite shell, and the API runs on port 5000.

## Checks

```sh
npm run lint
npm run format:check
npm test
npm run build
```

## Repository conventions

Work on a task branch, use conventional commit messages, and keep each commit focused. Do not commit secrets, `.env` files, generated `dist/` output, or dependency-local lockfiles. The root `package-lock.json` is the single lockfile for npm workspaces.
