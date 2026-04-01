# Tanlerida Monorepo

Top-level structure:
- `website/`: deployable Next.js ecommerce and Tan Leida web app
- `landing-page/`: landing page reference assets
- `agentic-ai/`: supporting AI and content generation scripts
- `customer-app/`: reserved for customer app work
- `admin-app/`: reserved for admin app work
- `docs/`: documentation and operational notes

Deployment:
- Primary deployment target is the `website/` application.
- Root-level `Dockerfile` and `railway.json` are configured to build and run `website/` from the repo root.
- Local app verification stays inside `website/` with `npm install` and `npm run build`.
