# Deployment

The active deployment target for this repository is the standalone Next.js server in `website/`.

## Runtime

- Build output: Next.js standalone server
- Container entrypoint: `node server.js`
- Health check: `/api/health`

## Railway

Deployment files:

- `Dockerfile`
- `railway.json`
- `website/Dockerfile`
- `website/railway.json`

Recommended deploy target:

- Deploy the repository root.
- The root `Dockerfile` is wired to copy and build the `website/` application specifically.

Local verification before deploy:

```bash
cd website
npm install
npm run build
```

## Website App

App-specific runtime files remain inside `website/`:

- `website/package.json`
- `website/prisma/`
- `website/public/`
- `website/.env.example`

## Firebase

There is no maintained Firebase static-frontend deployment path in the current architecture. The app relies on server components, API routes, middleware, auth flows, Prisma, and payment handlers that run as one full-stack Next.js service.
