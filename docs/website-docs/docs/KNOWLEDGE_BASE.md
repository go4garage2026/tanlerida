# 📚 TANLERIDA — Comprehensive Knowledge Base

> **Project**: Tangred — Premium Indian Leather E-Commerce Platform  
> **Version**: 1.0.0 | **Status**: Production Ready  
> **Stack**: Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS 4 · Prisma 7 · PostgreSQL  
> **Last Updated**: March 31, 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Repository Structure](#2-repository-structure)
3. [Tech Stack & Dependencies](#3-tech-stack--dependencies)
4. [App Router — Pages & Routes](#4-app-router--pages--routes)
5. [API Routes](#5-api-routes)
6. [Database Schema (Prisma)](#6-database-schema-prisma)
7. [Authentication System](#7-authentication-system)
8. [AI Pipeline — Tan Lerida™](#8-ai-pipeline--tan-lerida)
9. [Component Architecture](#9-component-architecture)
10. [State Management](#10-state-management)
11. [Lib Modules Reference](#11-lib-modules-reference)
12. [Utility Functions](#12-utility-functions)
13. [Styling & Design System](#13-styling--design-system)
14. [Payment Integration](#14-payment-integration)
15. [Email Service](#15-email-service)
16. [Deployment & Infrastructure](#16-deployment--infrastructure)
17. [Seed Data & Catalog](#17-seed-data--catalog)
18. [Known Issues & Naming Conventions](#18-known-issues--naming-conventions)
19. [Development Workflow](#19-development-workflow)
20. [Security Practices](#20-security-practices)

---

## 1. Project Overview

**Tangred** is a full-stack e-commerce platform for a premium Indian leather brand. It features:

- **Product Catalog** with search, filters, and categories
- **Shopping Cart** with persistent client-side state
- **Complete Checkout** with Razorpay payment integration
- **User Authentication** — Email/password + Google OAuth (NextAuth v5)
- **Order Management** — Create, track, and manage orders
- **Wishlist** functionality
- **Tan Lerida™** — AI-powered personal styling assistant using Gemini Vision + Claude + Pinecone vector search

**Brand Identity**: Dark luxury aesthetic with crimson red (`#C0392B`) and gold (`#BFA07A`) accents. Premium serif typography. Indian craftsmanship narrative.

**Owner**: GO4GARAGE (vivek@go4garage.in)  
**Repository**: `G4G-EKA-Ai/TANLERIDA`

---

## 2. Repository Structure

```
TANLERIDA/                          # Git root
├── tangred/                        # ★ THE APP — All live code lives here
│   ├── app/                        # Next.js App Router (pages + API)
│   │   ├── layout.tsx              # Root layout (Navbar, Footer, CartDrawer, Notification)
│   │   ├── providers.tsx           # SessionProvider (NextAuth)
│   │   ├── globals.css             # Theme variables, fonts, custom utilities
│   │   ├── page.tsx                # Homepage
│   │   ├── account/               # User dashboard, profile, addresses, wishlist, tan-lerida sessions
│   │   ├── api/                   # All API route handlers
│   │   ├── cart/                  # Cart page
│   │   ├── category/[slug]/       # Category filtered products
│   │   ├── checkout/              # Checkout flow
│   │   ├── forgot-password/       # Password reset
│   │   ├── login/                 # Login page
│   │   ├── orders/                # Order history
│   │   ├── products/              # Catalog + product detail [slug]
│   │   ├── register/              # Registration
│   │   ├── tan-lerida/            # AI styling info page + payment
│   │   ├── tan-leida/             # Redirect alias → /tan-lerida
│   │   └── verify/                # Email OTP verification
│   ├── auth.ts                    # NextAuth v5 config (root)
│   ├── components/                # React components (6 subdirs, 20 files)
│   │   ├── cart/                  # CartDrawer
│   │   ├── home/                  # HeroSection, CategoryGrid, FeaturedProducts, etc.
│   │   ├── layout/                # Navbar, MobileMenu, Footer
│   │   ├── product/               # ProductCard
│   │   ├── shared/                # Notification
│   │   └── tan-lerida/            # 7 consultation flow components
│   ├── lib/                       # Business logic, AI, integrations
│   │   ├── ai/                    # AI pipeline (orchestrator, claude, gemini, pinecone, image-gen)
│   │   ├── utils/                 # currency, date, guards, ids
│   │   └── *.ts                   # auth, prisma, razorpay, resend, cloudinary, catalog, etc.
│   ├── store/                     # Zustand stores (cart, UI)
│   ├── types/                     # TypeScript type definitions
│   ├── prisma/                    # schema.prisma + seed.ts
│   ├── public/                    # Static assets (SVG icons)
│   ├── generated/                 # Prisma generated client
│   ├── Dockerfile                 # Multi-stage Alpine Node 20 build
│   ├── railway.json               # Railway deployment config
│   ├── package.json               # Dependencies & scripts
│   ├── next.config.ts             # Next.js config (standalone output)
│   ├── tailwind.config.ts         # Custom luxury theme
│   └── tsconfig.json              # TypeScript config
├── docs/                          # Documentation
│   ├── DEPLOYMENT.md
│   ├── REPO_STRUCTURE.md
│   └── Tangred_Cap_Table_*.docx
├── README.md                      # Root overview
├── CHANGELOG.md                   # Version history
├── CONTRIBUTING.md                # Contribution guidelines
├── SECURITY.md                    # Security policy
├── CODE_OF_CONDUCT.md             # Community standards
├── PROJECT_STATUS.md              # Feature status tracker
├── IMPLEMENTATION_GUIDE.md        # Full implementation reference
└── LICENSE
```

---

## 3. Tech Stack & Dependencies

### Core Framework

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.2.0 | Full-stack React framework (App Router) |
| **React** | 19.2.4 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **Prisma** | 7.5.0 | ORM + PostgreSQL adapter |
| **PostgreSQL** | 14+ | Primary database |

### Authentication & Security

| Package | Purpose |
|---|---|
| `next-auth@5.0.0-beta.30` | Authentication (Credentials + Google OAuth) |
| `bcryptjs@3.0.3` | Password hashing |
| `zod@4.3.6` | Input validation schemas |

### AI Services

| Package | Purpose |
|---|---|
| `@anthropic-ai/sdk@0.80.0` | Claude AI (recommendations) |
| `@google/generative-ai@0.24.1` | Gemini (vision analysis + embeddings) |
| `@pinecone-database/pinecone@7.1.0` | Vector search |
| `openai@6.33.0` | GitHub Models fallback (Azure OpenAI) |
| `langchain@1.2.35` | LLM orchestration utilities |

### Integrations

| Package | Purpose |
|---|---|
| `razorpay@2.9.6` | Payment gateway (INR) |
| `resend@6.9.4` | Transactional emails |
| `cloudinary@2.9.0` | Image upload & CDN |

### UI & State

| Package | Purpose |
|---|---|
| `zustand@5.0.12` | Client state management |
| `framer-motion@12.38.0` | Animations |
| `lucide-react@0.577.0` | Icons |
| `react-hook-form@7.71.2` | Form management |
| `class-variance-authority@0.7.1` | Component variants |
| `clsx` + `tailwind-merge` | Class merging utilities |

### Scripts

```bash
npm run dev          # Development server (hot reload)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run db:seed      # Seed database (prisma db seed)
# postinstall: prisma generate (auto-runs on npm install)
```

---

## 4. App Router — Pages & Routes

### All Page Routes (23 total)

| Route | Component | Description |
|---|---|---|
| `/` | `page.tsx` | Homepage — hero, showcase, products, categories, brand story, testimonials |
| `/products` | `products/page.tsx` | Product catalog — filters (category, price, material, color), sort, pagination |
| `/products/[slug]` | `products/[slug]/page.tsx` | Product detail — images, specs, variants, add-to-cart, wishlist, related |
| `/category/[slug]` | `category/[slug]/page.tsx` | Category-filtered product grid |
| `/cart` | `cart/page.tsx` | Shopping cart — qty controls, subtotal/GST/total, checkout link |
| `/checkout` | `checkout/page.tsx` | Multi-section checkout — address, items, payment, order summary |
| `/orders` | `orders/page.tsx` | User order history with status tracking |
| `/login` | `login/page.tsx` | Credentials login + Google OAuth |
| `/register` | `register/page.tsx` | User registration (name, email, phone, password) |
| `/forgot-password` | `forgot-password/page.tsx` | 2-step: request OTP → reset password |
| `/verify` | `verify/page.tsx` | Email OTP verification (post-registration) |
| `/account` | `account/page.tsx` | Dashboard — orders count, Tan Lerida sessions, recent activity |
| `/account/profile` | `account/profile/page.tsx` | Edit name & phone (email read-only) |
| `/account/addresses` | `account/addresses/page.tsx` | CRUD delivery addresses, set default |
| `/account/wishlist` | `account/wishlist/page.tsx` | Wishlist display (currently placeholder) |
| `/account/tan-lerida` | `account/tan-lerida/page.tsx` | All Tan Lerida consultation sessions |
| `/account/tan-lerida/session/[id]` | `...session/[id]/page.tsx` | Individual session detail page |
| `/account/tan-leida` | `account/tan-leida/page.tsx` | Redirect → `/account/tan-lerida` |
| `/tan-lerida` | `tan-lerida/page.tsx` | Tan Lerida™ marketing/info page, FAQs, app download links |
| `/tan-lerida/payment` | `tan-lerida/payment/page.tsx` | Start new Tan Lerida session (payment) |
| `/tan-leida` | `tan-leida/page.tsx` | Redirect → `/tan-lerida` |

### Layout Structure

**Single root layout** (`app/layout.tsx`):
```
<html> → <body> → <Providers(SessionProvider)>
  → <Navbar />
  → <main>{children}</main>
  → <Footer />
  → <CartDrawer />
  → <Notification />
```

No nested layouts. All pages share the same root layout.

### Providers

```tsx
// app/providers.tsx — Client component
<SessionProvider>{children}</SessionProvider>
```

Only NextAuth's SessionProvider. Zustand stores are used directly in components (no provider needed).

---

## 5. API Routes

### Authentication (`/api/auth/`)

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register user, generate OTP, send verification email |
| POST | `/api/auth/verify-email` | Verify email with OTP |
| POST | `/api/auth/forgot-password` | Request password reset OTP |
| POST | `/api/auth/reset-password` | Reset password with OTP |
| * | `/api/auth/[...nextauth]` | NextAuth handler (credentials + Google OAuth) |

### Products (`/api/products/`)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/products` | Get all products |
| GET | `/api/products/[slug]` | Get single product by slug |

### Cart (`/api/cart/`)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/cart` | Info message (cart is client-side via Zustand) |

### Orders (`/api/orders/`)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/orders` | Get authenticated user's orders |
| POST | `/api/orders` | Create new order (address, items, totals, payment) |

### Account (`/api/account/`)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/account/addresses` | Get saved addresses |
| POST | `/api/account/addresses` | Create address |
| PATCH | `/api/account/addresses` | Update address / set default |
| DELETE | `/api/account/addresses` | Delete address |
| GET | `/api/account/profile` | Get user profile |
| PATCH | `/api/account/profile` | Update profile (name, phone) |

### Payment (`/api/payment/`)

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/payment/create-order` | Create Razorpay order |
| POST | `/api/payment/verify` | Verify payment signature |

### Tan Lerida (`/api/tan-lerida/` — mirrored at `/api/tan-leida/`)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tan-lerida/session` | Get all user's sessions |
| POST | `/api/tan-lerida/session` | Create new session |
| GET | `/api/tan-lerida/session/[id]` | Get session details |
| POST | `/api/tan-lerida/profile` | Save body profile data |
| POST | `/api/tan-lerida/preferences` | Save style preferences |
| POST | `/api/tan-lerida/analyse` | Trigger AI photo analysis |
| POST | `/api/tan-lerida/recommend` | Get AI styling recommendation |
| POST | `/api/tan-lerida/generate-image` | Generate outfit visualization |
| POST | `/api/tan-lerida/upload-file` | Upload single file |
| POST | `/api/tan-lerida/upload-photos` | Upload multiple photos (batch) |

### Utility

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check (used by Railway) |

**Total: 32+ API endpoints**

---

## 6. Database Schema (Prisma)

### Models Overview

```
User ──┬── Account (OAuth)
       ├── Session (NextAuth JWT)
       ├── Address[] ──── Order[]
       ├── Cart ──── CartItem[]
       ├── Wishlist[]
       ├── Review[]
       └── TanLeidaSession[] ──── TanLeidaPayment
```

### Core Models

#### User
- `id`, `email` (unique), `name`, `phone`
- `passwordHash` — bcrypt hashed (for credentials auth)
- `googleId` — Google OAuth linking
- `isVerified` — email verification status
- `tanLeidaAccess` (Boolean) — Tan Lerida™ access flag
- `tanLeidaId` (String) — unique Tan Lerida user ID (e.g., `TL-AB3K7M2P`)
- `avatarUrl` — profile picture
- Relations: accounts, sessions, addresses, orders, cart, wishlist, reviews, TanLeidaSessions

#### Product
- `id`, `slug` (unique), `name`, `description`, `longDesc`
- `basePrice` (Int, paise), `discountPrice` (Int?, paise)
- `sku` (unique), `stock`, `isActive`, `isFeatured`
- `material`, `origin`, `leadTimeDays` (default 14)
- Relations: images[], variants[], tags[], reviews[], category, orderItems, wishlists

#### ProductImage
- `url`, `altText`, `isPrimary`, `sortOrder`

#### ProductVariant
- `color`, `size`, `finish` (Matte/Glossy/Distressed)
- `stock`, `priceAdj` (Int, paise adjustment)

#### Category (6 total)
- Office Bags, Belts, Jackets, Wallets, Briefcases, Accessories

#### Cart & CartItem
- One cart per user
- CartItem unique on `(cartId, productId, variantId)`

#### Order & OrderItem
- **OrderStatus enum**: `PENDING` → `CONFIRMED` → `PROCESSING` → `SHIPPED` → `DELIVERED` (or `CANCELLED`/`REFUNDED`)
- OrderItem: snapshot of product info at purchase time

#### TanLeidaSession
- **Status flow**: `INITIATED` → `PHOTOS_UPLOADED` → `PROFILE_COLLECTED` → `ANALYSING` → `RECOMMENDATION_READY` → `COMPLETED`
- Stores: `userPhotos` (Json), `bodyProfile`, `stylePreferences`, `aiAnalysis`, `recommendation`, `generatedImageUrl`
- Links to recommended product & payment

#### TanLeidaPayment
- Razorpay integration fields
- Standard pricing: ₹9,900 + ₹1,782 GST = ₹11,682 (in paise)

### Enums

- **OrderStatus**: PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED
- **TanLeidaStatus**: INITIATED, PHOTOS_UPLOADED, PROFILE_COLLECTED, ANALYSING, RECOMMENDATION_READY, COMPLETED

### Auth-Related Models

- `Account` — OAuth provider linkage
- `Session` — NextAuth sessions
- `VerificationToken` — NextAuth token verification
- `EmailVerificationToken` — OTP-based email verification
- `PasswordResetToken` — Password reset with OTP code

---

## 7. Authentication System

### NextAuth v5 Configuration (`tangred/auth.ts`)

**Session Strategy**: JWT (not database sessions)

**Providers**:
1. **Google OAuth** — `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`
   - `allowDangerousEmailAccountLinking: true` (links Google to existing email)
2. **Credentials (Email/Password)** — email + password (min 8 chars)
   - Validates: user exists, has passwordHash, email is verified, bcrypt match
   - Returns: id, email, name, image, tanLeridaAccess, tanLeridaId

**JWT Callback**: Populates token with `user.id`, `tanLeridaAccess`, `tanLeridaId`. Refetches from DB on session update or missing token.id.

**Session Callback**: Enriches `session.user` with id and Tan Lerida fields.

**Custom Pages**: Login redirect → `/login`

### Auth Helper (`lib/request-auth.ts`)

```typescript
getCurrentUserIdOrDemo()
```
- Authenticated → returns `session.user.id`
- Unauthenticated → creates/retrieves demo user (`demo@tangred.in`, isVerified: true)
- Enables unauthenticated browsing

### Token Utilities (`lib/auth-tokens.ts`)

- `hashToken(token)` — SHA256 hash
- `buildOtpToken(expiryMinutes = 10)` — Returns `{ otp, tokenHash, expiresAt }`

### Auth Flows

1. **Registration**: Form → POST `/api/auth/register` → OTP email → `/verify` page → POST `/api/auth/verify-email`
2. **Login**: Form → NextAuth signIn (credentials or Google)
3. **Password Reset**: `/forgot-password` → POST `/api/auth/forgot-password` (OTP) → POST `/api/auth/reset-password`

---

## 8. AI Pipeline — Tan Lerida™

### Overview

Tan Lerida™ is a paid AI-powered personal styling consultant. Users upload photos, provide body profile & style preferences, and receive personalized product recommendations with AI-generated outfit visualizations.

### Pipeline Flow

```
1. INITIATED       → User creates session (pays ₹116.82)
2. PHOTOS_UPLOADED  → User uploads 3-4 photos (casual, formal, full body, ethnic)
3. PROFILE_COLLECTED → User provides body profile + style preferences
4. ANALYSING        → AI pipeline runs (orchestrator.ts)
5. RECOMMENDATION_READY/COMPLETED → Results displayed
```

### Pipeline Architecture (`lib/ai/orchestrator.ts`)

```
runTanLeridaPipeline(sessionId)
    │
    ├── 1. Fetch session (photos, profile, preferences)
    │
    ├── 2. analysePhotosWithGemini() → body shape, undertone, style sensibility
    │
    ├── 3. getSmartCandidates() → product matching
    │       ├── Try: Pinecone vector search (semantic)
    │       ├── Fallback: DB query (category hints + budget range)
    │       └── Relaxed: Broader DB query if <2 results
    │
    ├── 4. claudeGenerateRecommendation() → JSON recommendation
    │       ├── primaryRecommendation: { productId, narrative, whyItWorks, craftStory }
    │       ├── alternatives: [{ productId, brief }]
    │       ├── visualPrompt: text for image gen
    │       └── signOff: closing message
    │
    ├── 5. generateOutfitImage() → outfit visualization
    │
    └── 6. Update session → COMPLETED + delivery estimate
```

### AI Modules

#### Gemini Vision (`lib/ai/gemini.ts`)
- **Models**: `gemini-1.5-pro` (vision), `gemini-1.5-flash` (validation)
- `validatePhotoWithGemini(photoUrl)` → `{ isRealPerson, hasFullBody, safeForProcessing, reason }`
- `analysePhotosWithGemini({ photoUrls })` → `{ bodyShape, undertone, styleSensibility, posture, faceShape, notes, colourBias }`
- Fallback: GitHub Models (GPT-4o) → dev mock

#### Claude AI (`lib/ai/claude.ts`)
- **Model**: `claude-3-5-sonnet-latest`
- `claudeStyleConsultation(messages, userContext)` — Multi-turn chat (max 700 tokens)
- `claudeGenerateRecommendation({ userProfile, geminiAnalysis, products, stylePreferences })` — Structured JSON (max 1200 tokens)
- **System Prompt**: Tan Lerida persona — master tailor, quiet authority, craftsmanship language
- Fallback: GitHub Models → dev mock

#### Image Generation (`lib/ai/image-gen.ts`)
- `generateOutfitImage({ baseUserPhoto, productName, stylePrompt })`
- **Primary**: Stability AI (SDXL 1.0, 768×1024, photographic style)
- **Fallback**: Returns user's original photo
- Prompt includes: luxury editorial photography, dark studio, cinematic lighting, 8K

#### Pinecone Vector Search (`lib/ai/pinecone.ts`)
- `matchProductsFromEmbeddings({ bodyProfile, stylePrefs, geminiAnalysis, topK })`
- Builds profile text from user data → embeds via Gemini/GitHub Models → queries Pinecone
- `upsertProductEmbedding()` — Index products for vector search
- Embedding models: `text-embedding-004` (Gemini), `text-embedding-3-small` (GitHub)

#### GitHub Models Fallback (`lib/ai/github-models.ts`)
- **Base URL**: `https://models.inference.ai.azure.com`
- Uses GITHUB_TOKEN (free via Azure)
- Functions: `githubModelsVision()`, `githubModelsChat()`, `githubModelsChatMultiTurn()`, `githubModelsEmbed()`
- Universal fallback for all AI tasks when primary APIs unavailable

### AI Fallback Chain

```
Gemini (vision/embedding) → GitHub Models (GPT-4o) → Dev Mock
Claude (text/recommendation) → GitHub Models (GPT-4o) → Dev Mock
Stability AI (image gen) → Return original photo
Pinecone (vector search) → Database query fallback
```

---

## 9. Component Architecture

### Directory Organization (20 components, 6 subdirectories)

```
components/
├── cart/CartDrawer.tsx              # Slide-out cart panel
├── home/                            # Homepage sections (7 files)
│   ├── HeroSection.tsx              # Full-screen hero with CTAs
│   ├── CinematicShowcase.tsx        # Spotlight product with metrics
│   ├── FeaturedProducts.tsx         # Featured product grid
│   ├── CategoryGrid.tsx             # Category card grid
│   ├── BrandStory.tsx               # Brand narrative section
│   ├── TanLeridaTeaser.tsx          # Consultation CTA section
│   └── Testimonials.tsx             # Customer review cards
├── layout/                          # Global layout (3 files)
│   ├── Navbar.tsx                   # Fixed header with nav, cart, auth
│   ├── MobileMenu.tsx               # Full-screen mobile nav overlay
│   └── Footer.tsx                   # Footer with links, social, legal
├── product/ProductCard.tsx          # Product grid item card
├── shared/Notification.tsx          # Toast notification system
└── tan-lerida/                      # AI consultation flow (7 files)
    ├── TanLeridaSessionClient.tsx   # Main orchestrator (multi-step wizard)
    ├── PhotoUploadStep.tsx          # 4-slot drag-and-drop photo upload
    ├── BodyProfileStep.tsx          # Anthropometric data collection
    ├── StylePreferenceStep.tsx      # Shopping intent collection
    ├── AnalysisLoader.tsx           # Loading spinner with status messages
    ├── GeneratedOutfitCard.tsx      # AI-generated outfit image display
    └── RecommendationCard.tsx       # Product recommendation with add-to-cart
```

### Server vs Client Components

| Type | Components |
|---|---|
| **Client** (11) | CartDrawer, HeroSection, Navbar, MobileMenu, ProductCard, Notification, all 7 tan-lerida/* |
| **Server** (9) | CinematicShowcase, FeaturedProducts, CategoryGrid, BrandStory, TanLeridaTeaser, Testimonials, Footer |

### Key Component Details

#### CartDrawer
- Framer Motion slide-in panel (right side, 0.35s)
- Uses `useCartStore` for all cart operations
- Nested `CartItemCard` sub-component
- Pricing: subtotal → GST 18% → total

#### Navbar
- Fixed header, scroll-triggered background blur (80px threshold)
- Desktop nav + mobile hamburger toggle
- User menu dropdown (AnimatePresence)
- Cart badge showing item count

#### TanLeridaSessionClient (Complex)
- Multi-step wizard orchestrating 6 sub-components
- 7+ state variables (session, photos, profile, preferences, busy, error, products)
- Polling mechanism: checks session status every 2.5s during ANALYSING (120s timeout)
- Calls 6 API endpoints during full flow

#### ProductCard
- Props: `{ product: Product, className?: string }`
- Shows badge (New Arrival if <45 days, Bestseller tag)
- Image zoom on hover, wishlist button, add-to-cart on hover
- Includes `ProductCardSkeleton` for loading states

### Animation Patterns (Framer Motion)

| Component | Animation |
|---|---|
| HeroSection | Staggered cascade — 4 elements with 0.15-0.2s delays |
| CartDrawer | Slide from right (`x: 100% → 0`), backdrop fade |
| MobileMenu | Full-screen overlay, staggered nav items (`x: -18 → 0`) |
| Navbar | User menu dropdown, fade + Y offset |
| Notification | Toast pop-in (`y: 16 → 0, scale: 0.96 → 1`) |

Common pattern: `opacity: 0 → 1`, `y-offset → 0`, duration 0.3-0.8s, AnimatePresence for conditional renders.

---

## 10. State Management

### Zustand Stores

#### Cart Store (`store/cartStore.ts`)
- **Persistence**: localStorage (`tangred-cart` key)
- **State**: `items: CartItemType[]`, `isOpen: boolean`
- **Key Actions**:
  - `addItem(product, variantId?, qty)` — Merges duplicates, auto-opens cart
  - `removeItem(itemId)`, `updateQuantity(itemId, qty)` — Auto-removes if qty ≤ 0
  - `clearCart()`, `openCart()`, `closeCart()`, `toggleCart()`
- **Computed**:
  - `getTotalItems()` — sum of quantities
  - `getSubtotal()` — discount-aware: `discountPrice ?? basePrice`
  - `getGST()` — 18% of subtotal
  - `getTotal()` — subtotal + GST
- **Cart ID Format**: `${product.id}-${variantId ?? 'default'}-${Date.now()}`

#### UI Store (`store/uiStore.ts`)
- **No persistence** — ephemeral state
- **State**: `isMobileMenuOpen`, `isSearchOpen`, `isLoading`, `notification`
- **Notification**: `{ message, type: 'success'|'error'|'info' }` — auto-dismiss 4s
- **Used by**: Navbar, MobileMenu, ProductCard, Notification, RecommendationCard

### State Flow

```
Zustand (cartStore)  ←→  CartDrawer, ProductCard, Navbar, RecommendationCard, Checkout
Zustand (uiStore)    ←→  Navbar, MobileMenu, Notification, ProductCard
NextAuth (session)   ←→  Navbar, MobileMenu, Account pages, API routes
Local useState       ←→  TanLeridaSessionClient (complex multi-step form)
```

---

## 11. Lib Modules Reference

| Module | File | Key Exports | Description |
|---|---|---|---|
| **AI Orchestrator** | `lib/ai/orchestrator.ts` | `runTanLeridaPipeline()` | Full AI pipeline coordinator |
| **Claude** | `lib/ai/claude.ts` | `claudeGenerateRecommendation()`, `claudeStyleConsultation()` | Anthropic Claude integration |
| **Gemini** | `lib/ai/gemini.ts` | `analysePhotosWithGemini()`, `validatePhotoWithGemini()` | Google Gemini Vision |
| **Image Gen** | `lib/ai/image-gen.ts` | `generateOutfitImage()` | Stability AI image generation |
| **Pinecone** | `lib/ai/pinecone.ts` | `matchProductsFromEmbeddings()`, `upsertProductEmbedding()` | Vector search |
| **GitHub Models** | `lib/ai/github-models.ts` | `githubModelsChat()`, `githubModelsVision()`, `githubModelsEmbed()` | Fallback AI (Azure OpenAI) |
| **Auth** | `lib/auth.ts` | `auth`, `handlers`, `signIn`, `signOut` | Re-exports from root auth.ts |
| **Auth Tokens** | `lib/auth-tokens.ts` | `hashToken()`, `buildOtpToken()` | Token hashing & OTP generation |
| **Request Auth** | `lib/request-auth.ts` | `getCurrentUserIdOrDemo()` | Per-request user identification |
| **Prisma** | `lib/prisma.ts` | `prisma` (Proxy), `getPrismaClient()` | Lazy singleton DB client |
| **Rate Limit** | `lib/rate-limit.ts` | `enforceRateLimit()` | In-memory Map-based rate limiting |
| **Razorpay** | `lib/razorpay.ts` | `createRazorpayOrder()`, `verifyRazorpaySignature()` | Payment integration |
| **Resend** | `lib/resend.ts` | `sendVerificationEmail()`, `sendOrderConfirmationEmail()`, etc. | Email service |
| **Cloudinary** | `lib/cloudinary.ts` | `uploadToCloudinary()` | Image upload & CDN |
| **Catalog** | `lib/catalog.ts` | `products`, `categories`, `getProductBySlug()`, etc. | Static product data & helpers |
| **Tan Lerida Store** | `lib/tan-leida-store.ts` | `createTanLeridaSession()`, `markTanLeridaSessionPaid()`, etc. | Session CRUD operations |
| **Format** | `lib/format.ts` | `formatPrice()`, `formatDate()` | Re-export convenience aliases |
| **CORS** | `lib/cors.ts` | `setCorsHeaders()`, `corsOptions` | CORS configuration |

### Prisma Client Pattern

```typescript
// Lazy Proxy singleton — only creates client when accessed
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    const client = getPrismaClient()
    return Reflect.get(client, property, receiver)
  },
})
```

Uses `@prisma/adapter-pg` with `pg.Pool` for connection pooling. Singleton stored in `globalForPrisma.__tangredPrisma`.

---

## 12. Utility Functions

### Currency (`lib/utils/currency.ts`)

| Function | Signature | Example |
|---|---|---|
| `formatPaise(value)` | `number → string` | `11682 → "₹116.82"` |
| `paiseToRupees(value)` | `number → number` | `11682 → 116.82` |
| `rupeesToPaise(value)` | `number → number` | `116.82 → 11682` |
| `calculateGSTFromPaise(value)` | `number → number` | `9900 → 1782` (18%) |

**Constants**: `TAN_LERIDA_TOTAL_PAISE = 11682`, `GST_RATE = 0.18`

### Date (`lib/utils/date.ts`)

| Function | Returns | Example |
|---|---|---|
| `formatDisplayDate(input)` | `"DD MMM YYYY"` | `"20 Mar 2025"` |
| `formatDeliveryEstimate(leadDays)` | `"Ready in X working days · by DD MMM YYYY"` | `"Ready in 14 working days · by 03 Apr 2025"` |

### Guards (`lib/utils/guards.ts`)

| Function | Purpose |
|---|---|
| `isConfigured(value)` | Checks env var is truthy & non-empty |
| `invariant(condition, message)` | Assertion helper (throws if falsy) |
| `getRequestIp(request)` | Extracts client IP from `x-forwarded-for` or fallback `127.0.0.1` |

### IDs (`lib/utils/ids.ts`)

| Function | Format | Example |
|---|---|---|
| `generateTanLeridaSessionCode()` | `TL-XXXXXXXX` | `TL-AB3K7M2P` |
| `generateTanLeridaId()` | `TL-XXXXXXXX` | `TL-KJ4N8R3Q` |
| `generateOtp(length=6)` | `NNNNNN` | `847362` |
| `generateOrderNumber()` | `TAN-YYYYMMDD-NNNN` | `TAN-20250320-0042` |

Alphabet excludes ambiguous chars: no I, O, 0, 1.

---

## 13. Styling & Design System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#0A0A0A` | Primary background (near black) |
| `--color-bg-secondary` | `#111111` | Secondary background |
| `--color-surface` | `#1A1A1A` | Card/surface backgrounds |
| `--color-border` | `#2A2A2A` | Border color |
| `--color-text-primary` | `#F5F5F5` | Main text (near white) |
| `--color-text-secondary` | `#A0A0A0` | Secondary text (grey) |
| `--color-accent-red` | `#C0392B` | Primary CTA red |
| `--color-accent-red-hover` | `#E74C3C` | Hover state red |
| `--color-gold` | `#BFA07A` | Secondary accent gold |

### Typography

| Token | Font Family | Usage |
|---|---|---|
| `font-display` | Cormorant Garamond | Elegant serif — display text |
| `font-heading` | Playfair Display | Luxury serif — headings |
| `font-body` | DM Sans | Modern sans-serif — body text |
| `font-label` | Bebas Neue | All-caps — labels, badges |
| `font-mono-tan` | JetBrains Mono | Monospace — codes, technical |

### Font Sizes

| Token | Size |
|---|---|
| `text-hero` | 72px |
| `text-display` | 56px |
| `text-h1` | 48px |
| `text-h2` | 36px |
| `text-h3` | 28px |
| `text-nav` | 13px |
| `text-label` | 11px |
| `text-eyebrow` | 14px |

### Custom CSS Utilities (via `@utility` in globals.css)

| Class | Description |
|---|---|
| `btn-primary` | White bg, dark text, uppercase, hover effect |
| `btn-red` | Red bg, white text, glow on hover |
| `btn-outline` | Red border, transparent bg, inverts on hover |
| `btn-ghost` | Border only, minimal |
| `input-luxury` | Bordered input with red focus ring |
| `product-card` | Border + hover lift effect |
| `badge-red` / `badge-gold` | Small labeled badges |
| `skeleton` | Shimmer loading animation |
| `transition-luxury` | Cubic-bezier timing (`0.25, 0.46, 0.45, 0.94`) |
| `grain-overlay` | SVG noise texture (4% opacity) |
| `nav-glow` | Red underline glow on nav items |

### Custom Animations

- `fade-in` / `fade-up` — Opacity + transform
- `pulse-red` — Red glow pulse
- `shimmer` — Background gradient shift
- `slide-in-right` / `slide-out-right` — Drawer animation
- `chevron-bounce` — Scroll indicator bounce

### Design Philosophy

- **Dark luxury theme** — Deep blacks/greys with red & gold accents
- **Premium feel** — Serif fonts for headings, refined spacing
- **Interactive polish** — Smooth transitions, hover effects, glowing elements
- **Mobile-first** — Responsive utility classes with md/lg breakpoints
- **Dark mode** — Class-based (`darkMode: 'class'` in Tailwind config)

---

## 14. Payment Integration

### Razorpay (`lib/razorpay.ts`)

**Currency**: INR (always)  
**Amount Unit**: Paise (₹100 = 10000 paise)

| Function | Purpose |
|---|---|
| `getRazorpayClient()` | Returns Razorpay instance or null |
| `getRazorpayKeyId()` | Public key for frontend |
| `createRazorpayOrder(amount, receipt?)` | Create payment order |
| `verifyRazorpaySignature(orderId, paymentId, signature)` | HMAC-SHA256 verification |
| `isMockRazorpayOrder(orderId)` | Check if mock (`mock_order_*`) |
| `getTanLeridaPaymentBreakdown()` | Returns `{ subtotal: 9900, gst: 1782, total: 11682 }` |

**Mock Mode**: When API keys not configured, returns mock orders and auto-accepts verification.

### Tan Lerida Pricing

| Item | Paise | Rupees |
|---|---|---|
| Subtotal | 9,900 | ₹99.00 |
| GST (18%) | 1,782 | ₹17.82 |
| **Total** | **11,682** | **₹116.82** |

### Cart GST

All cart items: 18% GST calculated on subtotal via `getGST()` in cartStore.

---

## 15. Email Service

### Resend (`lib/resend.ts`)

**Provider**: Resend API  
**From**: `process.env.FROM_EMAIL ?? 'noreply@tangred.in'`

| Function | Subject Format | Use Case |
|---|---|---|
| `sendVerificationEmail(to, name, otp, expiresAt)` | `Verify your Tangred account — {otp}` | Post-registration |
| `sendPasswordResetEmail(to, name, otp, expiresAt)` | `Reset your Tangred password — {otp}` | Forgot password |
| `sendOrderConfirmationEmail(to, name, orderNumber, totalPaise)` | `Order confirmed — {orderNumber}` | Post-purchase |
| `sendTanLeridaAccessEmail(to, name, tanLeridaId)` | `Tan Lerida access confirmed — {id}` | After payment |
| `sendTanLeridaCompletionEmail(to, name, sessionCode)` | `Tan Lerida session ready — {code}` | After AI pipeline |

**Email Template**: HTML with dark background (#0A0A0A), Tangred branding (red accent), DM Sans typography, responsive.

**Mock Mode**: Returns `{ id: 'mock-email-{timestamp}' }` when API key not configured.

---

## 16. Deployment & Infrastructure

### Target: Railway (Container)

**Dockerfile**: Multi-stage Alpine Node 20 build
1. **deps** — `npm ci` (install dependencies)
2. **builder** — `prisma generate` + `next build` (standalone output)
3. **runner** — Minimal production image (~200MB)
   - Non-root user (`nextjs:nodejs`, uid 1001)
   - Port 3000
   - Entrypoint: `node server.js`

**railway.json**:
```json
{
  "build": { "builder": "DOCKERFILE", "dockerfilePath": "Dockerfile" },
  "deploy": {
    "startCommand": "node server.js",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 120,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Next.js Config

```typescript
{
  output: 'standalone',           // Single executable deployment
  images: {
    unoptimized: true,            // No Next.js image optimization
    remotePatterns: [unsplash, cloudinary, googleusercontent.com]
  },
  typescript: { ignoreBuildErrors: false }
}
```

### Pre-Deploy Checklist

```bash
cd tangred
npm run lint    # ESLint checks
npm run build   # Production build
```

### Firebase Status

Firebase deployment is **not maintained**. The app's server-side architecture (server components, API routes, middleware, auth flows) is incompatible with static hosting without a major frontend/backend split refactor.

---

## 17. Seed Data & Catalog

### Categories (6)

| Name | Slug | Description |
|---|---|---|
| Office Bags | `office-bags` | Structured carriers for executives |
| Belts | `belts` | Premium leather finishing pieces |
| Jackets | `jackets` | Luxury leather outerwear |
| Wallets | `wallets` | Refined everyday carry |
| Briefcases | `briefcases` | Boardroom-grade documents |
| Accessories | `accessories` | Compact leather organizers |

### Products (8-10 seed items)

| Product | Price | Material | Lead Time |
|---|---|---|---|
| Tangred Executive Tote (★Featured) | ₹8,299 | Full-grain leather | 14 days |
| Tangred Slim Bifold | ₹2,499 | Top-grain leather | 7 days |
| The Boardroom Belt (★Featured) | ₹3,499 | Vegetable-tanned | 10 days |
| Tangred Moto Jacket (★Featured) | ₹24,999 | Nappa leather | 21 days |
| The Counsel Briefcase | ₹14,999 | Full-grain cowhide | 16 days |
| Tangred Card Case | ₹1,299 | Calf leather | 5 days |
| The Mumbai Weekender (★Featured) | ₹12,499 | Crazy horse leather | 18 days |
| Tangred Officer Belt | ₹2,999 | Genuine leather | 7 days |
| The Founder Satchel | ₹10,999 | — | — |

**Images**: Unsplash URLs  
**Tags**: Bestseller, New Arrival, Travel, Heritage, Giftable, Boardroom

### Static Catalog (`lib/catalog.ts`)

Also exports:
- `featuredProducts` — 4 featured items
- `testimonials` — 3 customer testimonials
- `tanLeridaFaqs` — 4 FAQs
- `tanLeridaSteps` — 4-step onboarding description
- `filterGroups` — UI filter options for products page
- `accountAddresses` — 2 demo addresses
- `accountOrders` — 2 demo orders
- `tanLeridaSessions` — 1 demo session with full AI results

### Helper Functions

```typescript
getProductBySlug(slug: string): Product | undefined
getCategoryBySlug(slug: string): Category | undefined
getProductsByCategory(slug?: string): Product[]
getRelatedProducts(product: Product): Product[]
```

---

## 18. Known Issues & Naming Conventions

### ⚠️ Critical: "Leida" vs "Lerida" Naming Inconsistency

The character's correct name is **"Tan Lerida"**, but a typo variant **"Tan Leida"** exists throughout:

| Location | Uses "Leida" | Uses "Lerida" |
|---|---|---|
| Prisma Schema | `TanLeidaSession`, `TanLeidaPayment` | Table mapping: `TanLeridaSession` |
| Database fields | `tanLeidaAccess`, `tanLeidaId` | — |
| Auth callbacks | Populates both variants | `tanLeridaAccess`, `TanLeridaAccess` |
| Types | All 6 naming variants | — |
| Lib files | `tan-leida-store.ts` (implementation) | `tan-lerida-store.ts` (re-export wrapper) |
| API routes | `/api/tan-leida/*` (mirror) | `/api/tan-lerida/*` (primary) |
| App pages | `/tan-leida` (redirects) | `/tan-lerida` (actual) |

**Strategy**: Both spellings are maintained for compatibility. The "leida" variant is often the source of truth in DB/backend, while "lerida" is the public-facing API.

### Other Issues

1. **Redundant auth token properties**: JWT callbacks populate same values under 3+ casings (`tanLeridaAccess`, `tanLeidaAccess`, `TanLeridaAccess`)
2. **No stock validation in cart**: `addItem` doesn't check `product.stock`
3. **Image optimization disabled**: `unoptimized: true` in next.config.ts (increases bandwidth)
4. **Hardcoded Tan Lerida pricing**: ₹116.82 total fixed in constants
5. **In-memory rate limiting**: Resets on server restart (no Redis/persistent store)
6. **Wishlist placeholder**: Currently shows featured products instead of actual wishlist
7. **No form validation**: Client-side Tan Lerida forms have no validation before API calls
8. **No error boundaries**: Components lack React Error Boundary wrappers

---

## 19. Development Workflow

### Local Setup

```bash
cd tangred
npm install                    # Install deps (auto-runs prisma generate)
cp .env.example .env.local     # Configure environment variables
npx prisma migrate dev         # Run database migrations
npm run db:seed                # Seed sample data
npm run dev                    # Start dev server (http://localhost:3000)
```

### Required Environment Variables

```bash
# Core
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# AI Services (all optional — fallbacks exist)
GOOGLE_GEMINI_API_KEY="..."
ANTHROPIC_API_KEY="..."
PINECONE_API_KEY="..."
GITHUB_TOKEN="..."             # Free fallback for all AI

# Integrations (optional — mock mode available)
RAZORPAY_KEY_ID="..."
RAZORPAY_KEY_SECRET="..."
RESEND_API_KEY="..."
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

### Code Style (from CONTRIBUTING.md)

- **TypeScript**: Strict types, interfaces over types, explicit return types, no `any`
- **React**: Functional components, hooks, PascalCase naming, single-responsibility
- **Styling**: Tailwind CSS, responsive design, semantic classes
- **File Naming**: Components `PascalCase.tsx`, utils `camelCase.ts`, constants `SCREAMING_SNAKE_CASE`
- **Commits**: Conventional Commits (`feat(scope): subject`, `fix(scope): subject`)

### Node Version

`.nvmrc` file present (Node 20.x recommended — matches Dockerfile).

---

## 20. Security Practices

### Authentication Security
- bcryptjs (12 salt rounds) for password hashing
- JWT with HTTP-only cookies
- PKCE Google OAuth
- Email OTP verification (6-digit, 10-min expiry, SHA256 hashed)

### API Security
- Rate limiting (in-memory, per-key)
- Zod input validation schemas
- Prisma parameterized queries (SQL injection prevention)
- CSRF protection via NextAuth.js
- CORS configuration for cross-origin requests

### Payment Security
- Razorpay HMAC-SHA256 signature verification
- Payment IDs stored, never card data
- PCI DSS compliance via Razorpay

### Infrastructure Security
- Non-root Docker container (uid 1001)
- Alpine Linux (minimal attack surface)
- Environment variables for all secrets
- TLS 1.3 in transit
- PostgreSQL with SSL at rest

### Vulnerability Reporting
- Email: `vivek@go4garage.in` (do NOT create public issues)
- 24-hour acknowledgment, 3-5 day investigation, 1-2 week fix

---

*This knowledge base is auto-generated from deep codebase analysis. For the latest changes, refer to the source code in `tangred/`.*
