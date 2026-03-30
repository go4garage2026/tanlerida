# TANLERIDA

Tangred is a production-focused full-stack Next.js commerce app for a premium leather brand. The only live application code is in `tangred/`.

## Repo Structure

```text
TANLERIDA/
├── tangred/              # Next.js app, API routes, auth, Prisma, UI
├── docs/                 # Repo and deployment docs
├── README.md             # Root overview
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
└── LICENSE
```

## What Changed

- Removed the abandoned Firebase + Cloud Run split deployment files.
- Standardized the app runtime around `tangred/` only.
- Kept the Railway container deployment path as the active production target.

## Run Locally

```bash
cd tangred
npm install
npx prisma generate
npm run lint
npm run build
npm run dev
```

## Deployment

Current deployment docs live here:

- [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)
- [docs/REPO_STRUCTURE.md](./docs/REPO_STRUCTURE.md)

## Application Notes

- App Router UI and API routes live together in `tangred/app`.
- Authentication is configured through `tangred/auth.ts`.
- Prisma schema and seed live in `tangred/prisma`.
- Railway deployment files live in `tangred/Dockerfile` and `tangred/railway.json`.

For app-level setup details, see [tangred/README.md](./tangred/README.md).
