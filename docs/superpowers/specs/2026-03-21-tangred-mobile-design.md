# Tangred Mobile App — Design Spec
**Date:** 2026-03-21
**Status:** Approved (rev 3 — post-review fixes round 2)

---

## 1. Overview

Build **Tangred** as a production-grade Android APK for subscribers of the Tangred leather brand. The app gives every subscriber a Virtual Wardrobe, the full Tan Lerida AI Styling consultation, real-time product launches with pre-booking, and seamless JWT-based auth synced to the existing web backend.

---

## 2. Repository Layout

```
TANLERIDA/
├── tangred/                           ← existing Next.js web app (modified)
│   ├── prisma/schema.prisma           ← add WardrobeItem, Outfit, MagicLinkToken; PRE_BOOKED to OrderStatus; launchDate to Product
│   ├── lib/mobile-auth.ts             ← NEW: verifyMobileJwt helper
│   └── app/api/
│       ├── auth/mobile-login/         ← NEW
│       ├── auth/magic-link/verify/    ← NEW
│       ├── wardrobe/items/            ← NEW (GET, POST, DELETE /[id])
│       ├── wardrobe/outfits/          ← NEW (GET, POST, PUT /[id], DELETE /[id])
│       ├── try-on/analyse/            ← NEW (product + photo → AI compatibility)
│       └── orders/prebook/            ← NEW
└── tangred-app/                       ← NEW Expo SDK 51 React Native app
```

---

## 3. Tech Stack

| Concern | Choice |
|---|---|
| Framework | React Native with Expo SDK 51 (managed workflow) |
| Language | TypeScript strict mode |
| Navigation | Expo Router v3 (file-based) |
| Styling | StyleSheet API + React Native Reanimated 3 |
| State | Zustand 4 |
| Data fetching | TanStack Query v5 |
| Auth | Expo SecureStore + JWT (`jose` ^5.x, signed with NEXTAUTH_SECRET) |
| Camera/Photos | Expo Camera + Expo ImagePicker |
| Fonts | expo-google-fonts (Cormorant Garamond, Playfair Display, DM Sans, Bebas Neue) |
| Icons | @expo/vector-icons (Feather + MaterialCommunityIcons) |
| SVG | react-native-svg |
| Async Storage | `@react-native-async-storage/async-storage` (wardrobeStore persistence via `zustand/middleware` `persist` + `createJSONStorage(() => AsyncStorage)`) |
| Build | EAS Build — preview profile → .apk |
| Backend JWT | `jose` ^5.x added as direct dependency in `tangred/package.json` (not relied on transitively from next-auth) |

---

## 4. Design System

```typescript
// constants/colors.ts
export const Colors = {
  bg: '#0A0A0A',
  bgSecondary: '#111111',
  surface: '#1A1A1A',
  border: '#2A2A2A',
  textPrimary: '#F5F5F5',
  textSecondary: '#A0A0A0',
  accent: '#C0392B',
  gold: '#BFA07A',
  white: '#FFFFFF',
};

// constants/typography.ts
export const Fonts = {
  display: 'CormorantGaramond_600SemiBold',
  heading: 'PlayfairDisplay_700Bold',
  body: 'DMSans_400Regular',
  bodySemiBold: 'DMSans_600SemiBold',
  label: 'BebasNeue_400Regular',
};

export const Radius = { sm: 2, md: 4 };
```

**Rules:**
- Black background everywhere. White or gold text. Crimson ONLY for CTAs, prices, active states.
- No rounded corners beyond 4px.
- Every screen enters with Reanimated 3: opacity 0→1 + translateY 20→0.
- Grain overlay (`GrainOverlay` component: SVG `feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3"`, rect fill white with filter, opacity 0.04, pointerEvents none) on all hero sections.
- No blue, green, or purple anywhere.

### `lib/currency.ts`
```typescript
// Converts integer paise to formatted Indian Rupee string.
// Input: 999900 → Output: "₹9,999"
export const formatINR = (paise: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(paise / 100);
```
All prices in the database are stored as paise (integers). `formatINR` is the ONLY function that may render price values in the UI.

---

## 5. Backend Additions (`tangred/`)

### 5.1 Prisma Schema Changes

**Add `launchDate` to Product:**
```prisma
launchDate  DateTime?
```

**Add `PRE_BOOKED` to `OrderStatus` enum** (in `prisma/schema.prisma` AND `types/index.ts` OrderStatus union):
```prisma
enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
  PRE_BOOKED   // ← new
}
```
Also update `types/index.ts` OrderStatus union type to include `'PRE_BOOKED'`.

**New models:**
```prisma
model WardrobeItem {
  id          String   @id @default(cuid())
  userId      String
  productId   String?
  variantId   String?
  name        String
  category    String
  imageUrl    String
  isOwned     Boolean  @default(true)
  isPreBooked Boolean  @default(false)
  addedAt     DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model Outfit {
  id        String   @id @default(cuid())
  userId    String
  name      String
  occasion  String
  itemIds   Json
  notes     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model MagicLinkToken {
  id        String   @id @default(cuid())
  userId    String
  tokenHash String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
  usedAt    DateTime?
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

Also add relations to `User`:
```prisma
wardrobeItems  WardrobeItem[]
outfits        Outfit[]
magicLinkTokens MagicLinkToken[]
```

### 5.2 JWT Auth Helper — `lib/mobile-auth.ts`

```typescript
// Signs and verifies Bearer JWTs for mobile clients.
// Algorithm: HS256. Secret: process.env.NEXTAUTH_SECRET.
// Expiry: 30 days. This is intentional — no refresh token in v1.
// A user whose token expires is redirected to login; they re-authenticate.

interface MobileJwtPayload {
  sub: string;           // userId
  email: string;
  name: string | null;
  TanLeridaAccess: boolean;  // exact Prisma field name preserved
  TanLeridaId: string | null;
}

// signMobileJwt(payload) → signed JWT string
// verifyMobileJwt(req: Request) → MobileJwtPayload or throws 401 Response
```

All new mobile API routes call `verifyMobileJwt(request)` at the top. Existing routes that need mobile access (`GET /api/tan-lerida/session`, `GET /api/tan-lerida/session/[id]`, `POST /api/tan-lerida/session`, `POST /api/tan-lerida/upload-photos`, `POST /api/tan-lerida/analyse`, `GET /api/orders`) are updated to call `getMobileOrWebUserId(request)` — a helper that tries `verifyMobileJwt` first, then falls back to `auth()` (NextAuth cookie session). This preserves web functionality while enabling mobile access.

### 5.3 New API Routes

| Route | Method | Auth | Body | Response |
|---|---|---|---|---|
| `/api/auth/mobile-login` | POST | none | `{ email: string, password: string }` | `{ token: string, user: MobileUser }` |
| `/api/auth/magic-link/verify` | POST | none | `{ token: string }` | `{ token: string, user: MobileUser }` |
| `/api/wardrobe/items` | GET | Bearer JWT | — | `{ items: WardrobeItem[] }` |
| `/api/wardrobe/items` | POST | Bearer JWT | `{ productId?, variantId?, name, category, imageUrl, isOwned, isPreBooked }` | `{ item: WardrobeItem }` |
| `/api/wardrobe/items/[id]` | DELETE | Bearer JWT | — | `{ ok: true }` |
| `/api/wardrobe/outfits` | GET | Bearer JWT | — | `{ outfits: Outfit[] }` |
| `/api/wardrobe/outfits` | POST | Bearer JWT | `{ name, occasion, itemIds: string[], notes? }` | `{ outfit: Outfit }` |
| `/api/wardrobe/outfits/[id]` | PUT | Bearer JWT | `{ name?, occasion?, itemIds?, notes? }` | `{ outfit: Outfit }` |
| `/api/wardrobe/outfits/[id]` | DELETE | Bearer JWT | — | `{ ok: true }` |
| `/api/try-on/analyse` | POST | Bearer JWT | `{ productId: string, imageUrl: string }` | `{ score: number (1-10), verdict: string, colourNotes: string, tips: string[] }` |
| `/api/orders/prebook` | POST | Bearer JWT | `{ productId: string, variantId?: string }` | `{ order: Order }` |

**New route added to backend:**
| Route | Method | Auth | Body | Response |
|---|---|---|---|---|
| `/api/products/new-arrivals` | GET | none | — | `{ products: Product[] }` sorted by `createdAt desc`, `isActive: true`, limit 20. Includes `launchDate` field. Products where `launchDate` is future are pre-bookable. |

**Existing routes updated to accept mobile JWT (via `getMobileOrWebUserId`):**
- `GET /api/orders` — returns orders for the authenticated user
- `GET /api/tan-lerida/session` — lists all sessions for the user
- `POST /api/tan-lerida/session` — body must include `{ consent: true, moderationAccepted: true }` (mobile client sends these)
- `GET /api/tan-lerida/session/[id]` — returns single session including `status`, `recommendation`, `generatedImageUrl`, `recommendedProductId`, `estimatedDelivery`
- `POST /api/tan-lerida/upload-photos` — body: `{ sessionId, photos: { casual, formal, fullBody, ethnic? } }` (base64 data URLs)
- `POST /api/tan-lerida/analyse` — body: `{ sessionId: string }` → response: `{ status: 'ANALYSING', messages: string[] }`
- `POST /api/tan-lerida/profile` — updated with JWT support (see Step 2 below for exact field names)
- `POST /api/tan-lerida/preferences` — updated with JWT support (see Step 3 below for exact field names)

**Demo-user fallback removal (intentional breaking change):**
The existing `getCurrentUserIdOrDemo()` in `lib/request-auth.ts` falls back to a demo user (`demo@tangred.in`) for unauthenticated access — this enables the current unauthenticated web demo flow. `getMobileOrWebUserId` does NOT include this demo fallback: it returns 401 if neither a valid JWT nor a NextAuth session is present. This is intentional. Web routes that currently allow unauthenticated demo access (all Tan Lerida routes) will continue to work for authenticated web users. The demo-user path is removed. If demo access needs to be preserved for web marketing pages, those routes must be explicitly exempted from `getMobileOrWebUserId` and continue using `getCurrentUserIdOrDemo()` directly.

**`/api/auth/mobile-login` implementation detail:**
- Fetch user by email from Prisma.
- Verify `user.passwordHash` using `bcryptjs.compare(password, user.passwordHash)` (`bcryptjs` is already a dependency).
- If match: call `signMobileJwt({ sub: user.id, email, name, TanLeridaAccess, TanLeridaId })` and return `{ token, user }`.
- If no match: return 401 `{ message: 'Invalid credentials.' }`.
- Google OAuth users with no `passwordHash` receive 400 `{ message: 'Use Google sign-in.' }`.

**`/api/auth/magic-link/verify` implementation detail:**
- Token from deep link query param is raw (not hashed).
- Hash with SHA-256, look up `MagicLinkToken` by `tokenHash`.
- Check `expiresAt > now()` and `usedAt === null`.
- Mark `usedAt = now()`, sign JWT, return `{ token, user }`.

**`/api/orders/prebook` implementation detail:**
- Fetch product, validate it exists and has a future `launchDate`.
- Create `Order` with `status: 'PRE_BOOKED'`, `total: product.basePrice`, `subtotal: product.basePrice`, `gst: 0`, `shippingCharge: 0`, `addressSnapshot: {}` (no address required for pre-book).
- Return the created order.

**`/api/try-on/analyse` implementation detail:**
- Call Gemini (already configured) with the product details and user photo.
- Prompt: assess how well the product suits the user in the photo (skin tone, build, style).
- Return `{ score: 1-10, verdict: string, colourNotes: string, tips: string[] }`.

### 5.4 Tan Lerida Session Step Persistence

Each step in the wizard PATCHes the session:
- Step 1 (photos): `POST /api/tan-lerida/upload-photos` → `{ sessionId, photos }` → status becomes `PHOTOS_UPLOADED`
- Step 2 (body profile): existing `POST /api/tan-lerida/profile` → `{ sessionId, gender, ageRange, height, build, skinTone, stylePreferences[] }` → status becomes `PROFILE_COLLECTED`
- Step 3 (style chat): existing `POST /api/tan-lerida/preferences` → `{ sessionId, preferences }` (chat answers as object)
- Step 4 (analysis): existing `POST /api/tan-lerida/analyse` → `{ sessionId }` → status becomes `ANALYSING`, poll `GET /api/tan-lerida/session/[id]` every 3s until `status === 'RECOMMENDATION_READY'`
- Step 5 (result confirmation): `PATCH` session status to `COMPLETED` via existing session update, or simply navigate to the result screen — no separate API step required

All five of these routes are updated to accept `getMobileOrWebUserId`.

---

## 6. Mobile App — Folder Structure

```
tangred-app/
├── app/
│   ├── _layout.tsx             ← fonts, SplashScreen, JWT validation, deep link handler, QueryClientProvider
│   ├── index.tsx               ← redirect to (auth) or (app)
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── magic-link.tsx
│   └── (app)/
│       ├── _layout.tsx         ← bottom tab navigator (5 tabs)
│       ├── home.tsx
│       ├── wardrobe/
│       │   ├── index.tsx
│       │   ├── create.tsx
│       │   └── outfit/[id].tsx
│       ├── tan-lerida/
│       │   ├── index.tsx
│       │   ├── session/[id].tsx
│       │   └── result/[id].tsx
│       ├── shop/
│       │   ├── index.tsx
│       │   └── product/[slug].tsx
│       ├── try-on/
│       │   └── index.tsx
│       ├── orders.tsx
│       └── profile.tsx
├── components/
│   ├── ui/
│   │   ├── TangredButton.tsx
│   │   ├── TangredCard.tsx
│   │   ├── TangredInput.tsx
│   │   ├── TangredBadge.tsx
│   │   ├── GrainOverlay.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── SkeletonLoader.tsx
│   │   └── EmptyState.tsx
│   ├── home/
│   │   ├── HeroBanner.tsx
│   │   ├── NewLaunchStrip.tsx
│   │   └── TanLeridaTeaser.tsx
│   ├── wardrobe/
│   │   ├── WardrobeGrid.tsx
│   │   ├── OutfitCard.tsx
│   │   └── OutfitCanvas.tsx
│   ├── tan-lerida/
│   │   ├── PhotoUpload.tsx
│   │   ├── BodyProfileForm.tsx
│   │   ├── StyleChat.tsx
│   │   ├── AnalysisLoader.tsx
│   │   └── ResultCard.tsx
│   ├── shop/
│   │   ├── ProductCard.tsx
│   │   └── ProductGallery.tsx
│   └── try-on/
│       └── TryOnResult.tsx
├── store/
│   ├── authStore.ts
│   ├── wardrobeStore.ts
│   └── cartStore.ts
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   ├── currency.ts
│   └── date.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useWardrobe.ts
│   ├── useTanLerida.ts
│   └── useProducts.ts
├── types/index.ts
├── constants/
│   ├── colors.ts
│   └── typography.ts
├── app.json
├── eas.json
├── babel.config.js
├── tsconfig.json
└── package.json
```

---

## 7. Screen Specifications

### 7.1 `app/_layout.tsx`
- Load all four Google fonts via `useFonts`. Hold `SplashScreen` until ready.
- On mount: check SecureStore for `tangred_token`. If present, **verify JWT client-side** using `jose/jwt-decode` to check `exp` field. Expired or missing → `/(auth)/login`. Valid → decode payload, call `authStore.setAuth(token, user)`, navigate `/(app)/home`.
- Register Expo Linking handler: deep link `tangred://magic-link?token=*` navigates to `/(auth)/magic-link?token=<value>`.
- Wrap entire app in `QueryClientProvider`.

### 7.2 `(auth)/login.tsx`
- `#0A0A0A` screen. `TANGRED` wordmark (BebasNeue gold), welcome headline, email + password `TangredInput`.
- `react-hook-form` + Zod. POST `/api/auth/mobile-login`. On success: store JWT via `SecureStore.setItemAsync('tangred_token', token)`, call `authStore.setAuth(token, user)`, navigate `/(app)/home`.

### 7.3 `(auth)/magic-link.tsx`
- Read `token` from `useLocalSearchParams`. On mount: POST `/api/auth/magic-link/verify` with `{ token }`. Loading: crimson spinner. On success: store JWT + navigate `/(app)/home`. On fail: error card with "Return to login" link.

### 7.4 `(app)/_layout.tsx` — Bottom Tabs
- 5 tabs: Home (Feather `home`), Wardrobe (Feather `layers`), Tan Lerida (custom `TL` crimson badge), Shop (Feather `shopping-bag`), Profile (Feather `user`).
- Tab bar: bg `#111111`, border `#2A2A2A`, height 72px + safe area. Active: crimson with 2px underline dot. No labels.

### 7.5 `home.tsx`
- 5 sections: HeroBanner (ImageBackground + BlurView + GrainOverlay), New Arrivals (horizontal FlatList), Tan Lerida Teaser card, Wardrobe Preview (2-col grid), Recent Orders strip.
- Pull-to-refresh, SkeletonLoader during all fetches.
- Data: `GET /api/products/new-arrivals` (existing), `GET /api/wardrobe/items` (new), `GET /api/orders` (updated for JWT).

### 7.6 `wardrobe/index.tsx`
- Custom horizontal tab bar: All Items | Outfits | Wishlist | Pre-Booked.
- **All Items:** 2-col FlatList + FAB (+ crimson circle) → ActionSheet (Browse Catalogue / Upload Photo via ImagePicker).
- **Outfits:** OutfitCard with 2×2 image collage. Tap → `outfit/[id].tsx`.
- **Wishlist:** `isOwned === false` items, price crimson.
- **Pre-Booked:** `isPreBooked === true` items, `launchDate` shown gold.
- State: TanStack Query `['wardrobe-items']` and `['wardrobe-outfits']`. `wardrobeStore` is a write-through cache only — it mirrors the latest successful server fetch. On mutation: call API first; on success, invalidate the query (which re-fetches and updates the store). No optimistic writes to avoid reconciliation conflicts.

### 7.7 `wardrobe/create.tsx`
- OutfitCanvas: 2×2 slot grid. Empty slot: dashed border, tap → BottomSheet item picker from `wardrobeStore.items`. Filled slot: image + × remove.
- Name input, occasion pills (Office/Formal/Casual/Travel), notes input.
- Save → POST `/api/wardrobe/outfits` → on success: invalidate `['wardrobe-outfits']` + navigate back.

### 7.8 `tan-lerida/index.tsx`
- Radial gradient crimson overlay + GrainOverlay. `TL` monogram 80px gold.
- No session: Begin CTA → POST `/api/tan-lerida/session` with body `{ consent: true, moderationAccepted: true }` → navigate to `tan-lerida/session/[id]`.
- Past sessions list: `GET /api/tan-lerida/session` (updated for JWT). Shows sessionCode, date, status badge, "Resume" if not COMPLETED.

### 7.9 `tan-lerida/session/[id].tsx` — 5-Step Wizard

**Progress bar:** 5 equal crimson segments, fills to current step index.

**Step 1 — Photos:**
- 2×2 PhotoUpload grid (CASUAL LOOK / FORMAL LOOK / FULL BODY / ETHNIC OPTIONAL).
- Tap card: `ImagePicker.launchImageLibraryAsync({ mediaTypes: 'Images', quality: 0.8 })`. Convert to base64 data URL.
- Next active when 3+ photos selected.
- On Next: POST `/api/tan-lerida/upload-photos` with `{ sessionId, photos: { casual, formal, fullBody, ethnic? } }`.

**Step 2 — Body Profile:**
- `BodyProfileForm`: gender pills, age slider (20-60), height input (cm), build pills, skin tone swatches (6 hex values: #FAE0C8, #F0C9A0, #D4A574, #A67C52, #6B4226, #3B1F0F), style pills (multi-select).
- On Next: POST `/api/tan-lerida/profile` (existing, updated for JWT) with **exact field names from live Zod schema**:
  ```json
  { "sessionId": "...", "gender": "Male|Female|Non-binary|Prefer not to say",
    "ageRange": "25-30", "heightCm": 175, "bodyBuild": "Athletic",
    "skinTone": "#D4A574", "resonance": ["Classic Professional", "Minimalist"] }
  ```
  Note: `heightCm` (not `height`), `bodyBuild` (not `build`), `resonance` (not `stylePreferences`).

**Step 3 — Style Chat:**
- Chat bubble UI. Tan Lerida messages left-aligned (surface bubble, `TL` crimson avatar). User messages right-aligned (crimson bubble, white text).
- Quick reply chips + TextInput bar.
- Chat questions are **hardcoded in the mobile app** as `constants/chatScript.ts` — there is no `chatScript` field on the server. The question sequence maps to the live `/api/tan-lerida/preferences` Zod fields:
  ```typescript
  export const CHAT_SCRIPT = [
    { field: 'need',       question: "What are you primarily looking for?",
      quickReplies: ["A leather bag", "A wallet", "A belt", "A luxury gift"] },
    { field: 'laptopSize', question: "Do you carry a laptop? What size?",
      quickReplies: ["13\"", "15\"", "No laptop", "Skip"], optional: true },
    { field: 'structure',  question: "Structured or relaxed?",
      quickReplies: ["Structured & formal", "Relaxed & slouchy", "No preference"], optional: true },
    { field: 'budget',     question: "What is your budget?",
      quickReplies: ["₹5k–15k", "₹15k–30k", "₹30k–60k", "Above ₹60k"] },
    { field: 'occasion',   question: "What occasion are you shopping for?",
      quickReplies: ["Office", "Travel", "Gifting", "Casual", "Special event"] },
    { field: 'colours',    question: "Any colour preference?",
      quickReplies: ["Classic black", "Tan / cognac", "Dark brown", "No preference"] },
  ];
  ```
- On Next: POST `/api/tan-lerida/preferences` (existing, updated for JWT) with exact live schema fields:
  `{ sessionId, need, laptopSize?, structure?, budget, occasion, colours }`

**Step 4 — Analysis:**
- POST `/api/tan-lerida/analyse` with `{ sessionId }` → response: `{ status: 'ANALYSING', messages: string[] }`.
- Show `AnalysisLoader` component.
- Poll `GET /api/tan-lerida/session/[id]` every 3000ms via `useInterval`.
- Timeout after 3 minutes: show error card with "Try again" CTA.
- On `status === 'RECOMMENDATION_READY'`: navigate to `router.replace('/tan-lerida/result/' + id)`.

**Step 5 — Result (handled by result/[id].tsx):**
- Navigated to automatically by Step 4 when ready. No wizard UI — this is the final destination screen.

### 7.10 `tan-lerida/result/[id].tsx`
- Fetch session: `GET /api/tan-lerida/session/[id]`.
- Full-width AI image (`session.generatedImageUrl`), dark gradient overlay.
- Recommendation narrative, 3 why-bullets (from `session.recommendation`), price crimson.
- `"Add to Cart"` → cartStore + toast. `"Save to Wardrobe"` → POST `/api/wardrobe/items`.
- Session code: JetBrains Mono gold. Alternative products horizontal scroll.

### 7.11 `try-on/index.tsx`
- Product strip (120px cards, crimson border on selected). 280px photo zone.
- Camera/Gallery buttons → `ImagePicker`. After selection: photo fills zone.
- "Analyse Look" CTA → POST `/api/try-on/analyse` with `{ productId, imageUrl }` → `TryOnResult`.
- `TryOnResult`: compatibility score 1-10 (filled/empty circles), verdict PlayfairDisplay, colour harmony DM Sans gold, tips DM Sans muted.

### 7.12 `shop/index.tsx`
- 3 custom tabs: New Arrivals (editorial full-width, `GET /api/products/new-arrivals`), All Products (2-col grid + category filters, `GET /api/products`), Pre-Bookings (user's `PRE_BOOKED` orders from `GET /api/orders`).
- `launchDate` in future → `PRE-BOOK` gold badge. Within 30 days of creation → `NEW` crimson badge.

### 7.13 `shop/product/[slug].tsx`
- `GET /api/products/[slug]` (existing).
- ProductGallery: swipeable images, 320px height, dot pagination.
- Sticky bottom bar: `formatINR(basePrice)` + Add to Cart or Pre-Book (if `launchDate` is future).
- Scrollable: name, material/origin, action row (+ Wardrobe, Try On), description/specs/care accordions, `deliveryDate(leadTimeDays)`.
- Pre-Book BottomSheet → POST `/api/orders/prebook` → success toast + dismiss.

### 7.14 `orders.tsx`
- `GET /api/orders` (updated for JWT).
- FlatList of TangredCard order cards. SkeletonLoader while loading.
- Each card: order number JetBrains Mono gold, date, total `formatINR`, status `TangredBadge`.
- Expandable: shows item thumbnails.
- `EmptyState` if no orders.

### 7.15 `profile.tsx`
- User initials circle crimson. Name, email, SUBSCRIBER badge. Tan Lerida ID monospace.
- Notification toggle, menu items.
- **Sign Out:** `SecureStore.deleteItemAsync('tangred_token')` → `authStore.clearAuth()` → `wardrobeStore.reset()` → `cartStore.clearCart()` → `queryClient.clear()` → `router.replace('/(auth)/login')`.

---

## 8. State Management

### authStore
```typescript
// In-memory. Source of truth for UI auth state.
{ token: string | null, user: User | null }
setAuth(token, user)  // in-memory only (SecureStore write done separately)
clearAuth()           // in-memory only (SecureStore delete done separately)
```

### wardrobeStore
```typescript
// Write-through cache of TanStack Query data.
// Never written to directly by mutations — only updated by query success callbacks.
// Persisted to AsyncStorage via zustand/middleware `persist` + `createJSONStorage(() => AsyncStorage)`
// so items appear instantly on cold start while the query fetches fresh data.
{ items: WardrobeItem[], outfits: Outfit[] }
setItems(items)
setOutfits(outfits)
reset()
```
Persistence: `import AsyncStorage from '@react-native-async-storage/async-storage'` — this package is a required peer dependency of Expo SDK 51 and must be listed in `tangred-app/package.json`.

### cartStore
```typescript
// In-memory only. Not synced to server in v1.
// "Add to Cart" stores items locally. Checkout flow is out of scope for v1.
{ items: CartItem[] }
addItem(product, variantId?)
removeItem(id)
updateQty(id, qty)
clearCart()
totalPaise(): number
```

---

## 9. Auth & API Security

- JWT signed with `NEXTAUTH_SECRET` (jose `SignJWT`), algorithm HS256, **30-day expiry** (intentional — no refresh token in v1; expired users re-login).
- `verifyMobileJwt(req)` in `tangred/lib/mobile-auth.ts` — parses `Authorization: Bearer <token>`, verifies with `jose jwtVerify`, returns `MobileJwtPayload` or throws a `NextResponse` 401.
- `getMobileOrWebUserId(req)` — tries JWT first, falls back to NextAuth `auth()`. Used to retrofit existing routes for mobile without breaking web.
- Magic-link tokens: new `MagicLinkToken` model (separate from `PasswordResetToken`), stored as SHA-256 hash, 15-min expiry, single-use.
- Axios 401 interceptor (mobile): calls `SecureStore.deleteItemAsync('tangred_token')`, `authStore.clearAuth()`, `queryClient.clear()`, `router.replace('/(auth)/login')`.
- Deep link handler in `_layout.tsx`: on `tangred://magic-link?token=*` → `router.push('/(auth)/magic-link?token=<value>')`.

---

## 10. Error Handling

| Scenario | Behaviour |
|---|---|
| No internet | TanStack Query `staleTime: 5min`; show stale data with "cached" label via `query.isStale` |
| Camera/photo permission denied | `EmptyState` with "Open Settings" (`Linking.openSettings()`) |
| Tan Lerida poll timeout (3 min) | Stop polling, show error card with "Try again" |
| Image upload failure | Auto-retry once; then manual retry button shown |
| JWT expired (detected at splash) | Clear SecureStore + redirect to login |
| JWT expired (detected mid-session via 401) | Axios interceptor → clear all state → redirect to login |
| Pre-book on product without launchDate | Server returns 400; show toast "This item is not available for pre-booking" |
| Session creation failure | Toast error; user stays on Tan Lerida hub |
| Google OAuth user tries mobile login | Server returns 400 "Use Google sign-in"; show in-app message |

---

## 11. Build & Delivery

```bash
# From tangred-app/
npm install
npx expo login
npx eas init
npx eas build --platform android --profile preview --non-interactive
```

EAS outputs a downloadable `.apk`. Install on Android 10+ via sideload.

**app.json scheme:** `tangred` — enables deep links `tangred://magic-link?token=*`.

---

## 12. Definition of Done

1. `npx expo start` runs without errors on clean `npm install`
2. `eas build --platform android --profile preview` produces downloadable `.apk`
3. APK installs on Android 10+ without crashing
4. Login with subscriber email+password works; JWT stored in SecureStore. 30-day expiry is the accepted trade-off for v1.
5. Deep link `tangred://magic-link?token=XXX` auto-authenticates via `MagicLinkToken` model
6. Expired JWT at splash redirects to login (client-side `exp` check)
7. Home: all 5 sections render with skeleton loaders + real data
8. Virtual Wardrobe: add items, create outfits, all 4 tabs functional; state persists on reinstall (backend) and shows instantly on cold start (AsyncStorage cache)
9. Tan Lerida wizard: all 5 steps (photos → profile → chat → analysis → result) work end-to-end; polling surfaces result screen
10. Try-On: camera/gallery + POST `/api/try-on/analyse` + `TryOnResult` with score and verdict
11. Shop: new arrivals, product detail, pre-book modal → `POST /api/orders/prebook` → `PRE_BOOKED` order created
12. Orders screen lists all orders including PRE_BOOKED status
13. Profile: Tan Lerida ID visible, sign-out clears all state (SecureStore + stores + query cache)
14. Every screen uses dark luxury palette — no white backgrounds, no blue/green/purple
15. All prices rendered via `formatINR(paise)` only
16. No placeholder screens — every screen has real UI, real data, real interactions
