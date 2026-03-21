# 🚀 TANLERIDA - Google Cloud Platform Architecture

## Deployment Summary

**Architecture**: Firebase Hosting (Frontend) + Google Cloud Run (Backend) + Cloud SQL (Database)

---

## 📁 GCP Configuration Files

```
TANLERIDA/
│
├── 🔥 Firebase (Frontend)
│   ├── firebase.json              # Firebase hosting config (dev)
│   ├── firebase.json.prod         # Firebase hosting config (production)
│   ├── .firebaserc                # Firebase project configuration
│   └── storage.rules              # Firebase Storage security rules
│
├── ☁️ Google Cloud Platform
│   └── gcp/
│       ├── cloudbuild.yaml        # CI/CD pipeline configuration
│       │
│       ├── cloud-run/
│       │   ├── Dockerfile         # Container image for backend
│       │   └── service.yaml       # Cloud Run service configuration
│       │
│       └── cloud-sql/
│           ├── setup.sql          # Database setup script
│           └── connection.sh      # Cloud SQL Proxy connection
│
├── 🛠️ Deployment Scripts
│   └── scripts/
│       ├── setup-gcp.sh           # Infrastructure setup (one-time)
│       └── deploy.sh              # Deployment orchestration
│
├── ⚙️ Configuration
│   ├── .env.gcp.example           # Environment variables template
│   └── GCP_DEPLOYMENT.md          # Detailed deployment guide
│
└── 💻 Application
    └── tangred/
        ├── next.config.firebase.ts    # Next.js config for Firebase
        ├── next.config.cloudrun.ts    # Next.js config for Cloud Run
        ├── app/api/health/route.ts    # Health check endpoint
        └── lib/cors.ts                # CORS configuration
```

---

## 🏗️ Architecture Components

### 1. Firebase Hosting (Frontend)
```
┌─────────────────────────────────────┐
│  Firebase Hosting                   │
│  ├─ Global CDN                      │
│  ├─ SSL Certificates                │
│  ├─ Custom Domain Support           │
│  └─ Static Site Generation          │
└─────────────────────────────────────┘
```

**Configuration**: `firebase.json`, `firebase.json.prod`

### 2. Google Cloud Run (Backend)
```
┌─────────────────────────────────────┐
│  Cloud Run                          │
│  ├─ Auto-scaling: 1-10 instances    │
│  ├─ Container-based                 │
│  ├─ HTTPS endpoints                 │
│  ├─ Health checks                   │
│  └─ Secret Manager integration      │
└─────────────────────────────────────┘
```

**Configuration**: `gcp/cloud-run/Dockerfile`, `gcp/cloud-run/service.yaml`

### 3. Cloud SQL (Database)
```
┌─────────────────────────────────────┐
│  Cloud SQL PostgreSQL               │
│  ├─ Private VPC connection          │
│  ├─ Automated backups               │
│  ├─ High availability (optional)    │
│  └─ Connection via VPC Connector    │
└─────────────────────────────────────┘
```

**Configuration**: `gcp/cloud-sql/setup.sql`

---

## 🚀 Quick Deployment

### Step 1: Setup Infrastructure (One-time)

```bash
./scripts/setup-gcp.sh
```

### Step 2: Configure Secrets

```bash
./scripts/deploy.sh secrets
```

### Step 3: Full Deploy

```bash
./scripts/deploy.sh full
```

Or deploy components separately:

```bash
./scripts/deploy.sh backend   # Deploy Cloud Run only
./scripts/deploy.sh frontend  # Deploy Firebase only
./scripts/deploy.sh migrate   # Run database migrations
```

---

## 🔐 Security Features

- ✅ Secrets stored in Google Secret Manager
- ✅ VPC Connector for private database access
- ✅ Service Account with minimal permissions
- ✅ HTTPS enforced on all endpoints
- ✅ CORS configured for cross-origin requests
- ✅ Health checks for service monitoring

---

## 📊 Scaling Configuration

| Component | Min | Max | Trigger |
|-----------|-----|-----|---------|
| Cloud Run | 1   | 10  | CPU/Memory |
| Cloud SQL | 1   | 1   | N/A (managed) |

---

## 💰 Cost Estimate

| Service | Monthly Cost |
|---------|--------------|
| Firebase Hosting | Free - $5 |
| Cloud Run | Free - $20 |
| Cloud SQL (db-f1-micro) | ~$7 |
| Secret Manager | Free |
| **Total** | **$7 - $32** |

---

## 📚 Documentation

- **Full Guide**: `docs/GCP_DEPLOYMENT.md`
- **Environment Setup**: `.env.gcp.example`
- **Architecture**: This file

---

**Ready to deploy! 🎉**
