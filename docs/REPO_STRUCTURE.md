# Repo Structure

`TANLERIDA` is structured around a single deployable application.

## Source Of Truth

- `tangred/` contains the entire runtime:
  - App Router pages under `app/`
  - API routes under `app/api/`
  - auth configuration in `auth.ts`
  - shared logic in `lib/`
  - Prisma schema and seed in `prisma/`
  - client state in `store/`

## Deployment Files

- `tangred/Dockerfile` builds the standalone Next.js server image.
- `tangred/railway.json` defines the Railway deployment contract.

## Root Directory

The repository root is intentionally lightweight:

- `README.md` for project overview
- `docs/` for structure and deployment notes
- standard project meta files such as `LICENSE`, `CHANGELOG.md`, `SECURITY.md`, and `CONTRIBUTING.md`

## Removed Legacy Layout

The old Firebase Hosting + Cloud Run split files were removed because they no longer matched the running application architecture.
