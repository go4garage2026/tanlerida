# Deployment

The active deployment target for this repository is the standalone Next.js server in `tangred/`.

## Runtime

- Build output: Next.js standalone server
- Container entrypoint: `node server.js`
- Health check: `/api/health`

## Railway

Deployment files:

- `tangred/Dockerfile`
- `tangred/railway.json`

Local verification before deploy:

```bash
cd tangred
npm run lint
npm run build
```

## Firebase

There is no maintained Firebase static-frontend deployment path in the current application architecture. The app uses server components, API routes, middleware, and auth flows that run as one full-stack Next.js service.

If a Firebase frontend-only deployment is required later, that needs a real frontend/backend split refactor first.
