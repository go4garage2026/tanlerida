# Tangred Mobile App — Design Spec
**Date:** 2026-03-21
**Status:** Approved

---

## 1. Overview

Build **Tangred** as a production-grade Android APK for subscribers of the Tangred leather brand. The app gives every subscriber a Virtual Wardrobe, the full Tan Lerida AI Styling consultation, real-time product launches with pre-booking, and seamless JWT-based auth synced to the existing web backend.

---

## 2. Repository Layout

```
TANLERIDA/
├── tangred/                         ← existing Next.js web app (modified)
│   ├── prisma/schema.prisma         ← add WardrobeItem, Outfit; add launchDate to Product
│   └── app/api/
│       ├── auth/mobile-login/       ← NEW
│       ├── auth/magic-link/verify/  ← NEW
│       ├── wardrobe/items/          ← NEW (GET, POST, DELETE)
│       ├── wardrobe/outfits/        ← NEW (GET, POST, PUT/[id], DELETE/[id])
│       ├── try-on/analyse/          ← NEW
│       └── orders/prebook/          ← NEW
└── tangred-app/                     ← NEW Expo SDK 51 React Native app
```

---

## 3. Tech Stack

| Concern | Choice |
|---|---|
| Framework | React Native with Expo SDK 51 (managed workflow) |
| Language | TypeScript strict mode |
| Navigation | Expo Router v3 (file-based) |
| Styling | StyleSheet API + React Native Reanimated 3 |
| State | Zustand 4 (wardrobe persisted via AsyncStorage) |
| Data fetching | TanStack Query v5 |
| Auth | Expo SecureStore + JWT (jose, signed with NEXTAUTH_SECRET) |
| Camera/Photos | Expo Camera + Expo ImagePicker |
| Fonts | expo-google-fonts (Cormorant Garamond, Playfair Display, DM Sans, Bebas Neue) |
| Icons | @expo/vector-icons (Feather + MaterialCommunityIcons) |
| SVG | react-native-svg |
| Build | EAS Build — preview profile → .apk |

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
- Grain overlay (SVG feTurbulence noise, 4% opacity, pointerEvents none) on all hero sections.
- No blue, green, or purple anywhere.

---

## 5. Backend Additions (tangred/)

### 5.1 Prisma Schema Changes

**Add to Product model:**
```prisma
launchDate  DateTime?
```

**New models:**
```prisma
model WardrobeItem {
  id          String   @id @default(cuid())
  userId      String
  productId   String?
  name        String
  category    String
  imageUrl    String
  isOwned     Boolean  @default(true)
  isPreBooked Boolean  @default(false)
  addedAt     DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
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
}
```

### 5.2 New API Routes

All routes accept `Authorization: Bearer <jwt>`. JWT signed with `NEXTAUTH_SECRET` via `jose`, 30-day expiry. Payload: `{ sub: userId, email, name, tanLeidaAccess, tanLeidaId }`.

| Route | Method | Body / Params | Response |
|---|---|---|---|
| `/api/auth/mobile-login` | POST | `{ email, password }` | `{ token, user }` |
| `/api/auth/magic-link/verify` | POST | `{ token }` | `{ token, user }` |
| `/api/wardrobe/items` | GET | — | `{ items[] }` |
| `/api/wardrobe/items` | POST | `{ productId?, name, category, imageUrl, isOwned, isPreBooked }` | `{ item }` |
| `/api/wardrobe/items/[id]` | DELETE | — | `{ ok }` |
| `/api/wardrobe/outfits` | GET | — | `{ outfits[] }` |
| `/api/wardrobe/outfits` | POST | `{ name, occasion, itemIds, notes? }` | `{ outfit }` |
| `/api/wardrobe/outfits/[id]` | PUT | `{ name?, occasion?, itemIds?, notes? }` | `{ outfit }` |
| `/api/wardrobe/outfits/[id]` | DELETE | — | `{ ok }` |
| `/api/try-on/analyse` | POST | `{ productId, imageUrl }` | `{ score, verdict, colourNotes, tips }` |
| `/api/orders/prebook` | POST | `{ productId, variantId? }` | `{ order }` |

**Auth helper:** `lib/mobile-auth.ts` — `verifyMobileJwt(req)` extracts and verifies Bearer token, returns `{ userId, email, ... }` or throws 401.

---

## 6. Mobile App — Folder Structure

```
tangred-app/
├── app/
│   ├── _layout.tsx             ← fonts, SplashScreen, auth check, deep link handler, QueryClientProvider
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
- On mount: check SecureStore for `tangred_token`. Valid token → `/(app)/home`. No token → `/(auth)/login`.
- Register Expo Linking handler for deep links: `tangred://magic-link?token=*`.
- Wrap entire app in `QueryClientProvider`.

### 7.2 `(auth)/login.tsx`
- `#0A0A0A` screen. `TANGRED` wordmark (BebasNeue gold), welcome headline, email + password `TangredInput`.
- `react-hook-form` + Zod. POST `/api/auth/mobile-login`. On success: store JWT, setAuth, navigate home.

### 7.3 `(auth)/magic-link.tsx`
- Read `token` from `useLocalSearchParams`. On mount POST `/api/auth/magic-link/verify`. Loading spinner crimson. On success: store + navigate home.

### 7.4 `(app)/_layout.tsx` — Bottom Tabs
- 5 tabs: Home (Feather `home`), Wardrobe (Feather `layers`), Tan Lerida (custom `TL` crimson badge), Shop (Feather `shopping-bag`), Profile (Feather `user`).
- Tab bar: bg `#111111`, border `#2A2A2A`, height 72px + safe area. Active: crimson with 2px underline dot. No labels.

### 7.5 `home.tsx`
- 5 sections: HeroBanner (ImageBackground + BlurView + GrainOverlay), New Arrivals (horizontal FlatList), Tan Lerida Teaser card, Wardrobe Preview (2-col grid), Recent Orders strip.
- Pull-to-refresh, SkeletonLoader during all fetches.

### 7.6 `wardrobe/index.tsx`
- Custom horizontal tab bar: All Items | Outfits | Wishlist | Pre-Booked.
- All Items: 2-col FlatList + FAB (+ crimson circle) → ActionSheet (Browse Catalogue / Upload Photo).
- Outfits: OutfitCard with 2×2 image collage.
- Wishlist: `isOwned === false` items, price crimson.
- Pre-Booked: items with `isPreBooked === true`, launch date gold.

### 7.7 `wardrobe/create.tsx`
- OutfitCanvas: 2×2 slot grid. Empty slot: dashed border, tap → BottomSheet item picker. Filled slot: image + × remove.
- Name input, occasion pills (Office/Formal/Casual/Travel), notes input.
- Save → wardrobeStore.createOutfit + POST `/api/wardrobe/outfits`.

### 7.8 `tan-lerida/index.tsx`
- Radial gradient crimson overlay + GrainOverlay. `TL` monogram 80px gold.
- No session: Begin CTA → POST `/api/tan-lerida/session` → navigate to session wizard.
- Past sessions list below.

### 7.9 `tan-lerida/session/[id].tsx` — 5-Step Wizard
- Progress bar: 5 crimson segments.
- Step 1 Photos: 2×2 PhotoUpload grid (CASUAL / FORMAL / FULL BODY / ETHNIC), upload via ImagePicker, next when 3+ selected.
- Step 2 Body Profile: gender pills, age slider, height input, build pills, skin tone swatches, style pills.
- Step 3 Style Chat: chat bubble UI, quick replies, TextInput bar, questions from session chatScript.
- Step 4 Analysis: POST `/api/tan-lerida/analyse` → AnalysisLoader + poll every 3s → on RECOMMENDATION_READY navigate to result.

### 7.10 `tan-lerida/result/[id].tsx`
- Full-width AI image, dark gradient overlay, recommendation narrative, 3 why-bullets, price crimson, Add to Cart + Save to Wardrobe buttons, alternative products horizontal scroll.

### 7.11 `try-on/index.tsx`
- Product strip (120px cards, crimson border on selected). 280px photo zone. Camera/Gallery buttons.
- After selection: Analyse Look CTA → POST `/api/try-on/analyse` → TryOnResult (score circles, verdict, colour note, tips).

### 7.12 `shop/index.tsx`
- 3 custom tabs: New Arrivals (editorial full-width), All Products (2-col grid + category filter pills), Pre-Bookings.

### 7.13 `shop/product/[slug].tsx`
- ProductGallery swipeable images (320px). Sticky bottom bar: price + Add to Cart / Pre-Book.
- Scrollable: name, material/origin, action row (+ Wardrobe, Try On), description/specs/care accordions, estimated delivery.
- Pre-Book: BottomSheet → POST `/api/orders/prebook`.

### 7.14 `orders.tsx`
- FlatList of TangredCard order cards. SkeletonLoader while loading. Expandable item list on press.

### 7.15 `profile.tsx`
- User initials circle crimson. Name, email, SUBSCRIBER badge. Tan Lerida ID monospace.
- Menu: Orders, Wardrobe, Addresses, Notifications toggle, About, Privacy, Sign Out.
- Sign Out: clears SecureStore + all stores + navigate login.

---

## 8. State Management

### authStore
```typescript
{ token, user } // in-memory
setAuth(token, user) // also writes to SecureStore
clearAuth()         // also deletes from SecureStore
```

### wardrobeStore
```typescript
{ items, outfits }
// Zustand persist via AsyncStorage as offline cache.
// Server is source of truth; TanStack Query fetches on mount.
// Mutations: addItem, removeItem, createOutfit, updateOutfit, deleteOutfit
// Each mutation calls API then invalidates query.
```

### cartStore
```typescript
{ items }
// In-memory only. clearCart() called on sign-out.
```

---

## 9. Auth & API Security

- JWT signed with `NEXTAUTH_SECRET` (jose SignJWT), algorithm HS256, 30-day expiry.
- `verifyMobileJwt(req)` helper in `tangred/lib/mobile-auth.ts` verifies every protected route.
- Magic-link tokens: single-use, 15-min expiry, stored as hashed in `PasswordResetToken` table (reuses existing model with `otpCode` repurposed as the magic token).
- Axios 401 interceptor: clears SecureStore, calls `authStore.clearAuth()`, calls `router.replace('/(auth)/login')`.

---

## 10. Error Handling

| Scenario | Behaviour |
|---|---|
| No internet | TanStack Query staleTime 5min; show stale data with "cached" label |
| Camera/photo denied | EmptyState with "Open Settings" (Linking.openSettings()) |
| Tan Lerida poll timeout (3 min) | Error card with "Try again" CTA |
| Image upload failure | Auto-retry once; then manual retry button |
| JWT expiry / 401 | Axios interceptor clears auth, redirects to login |
| Pre-book on out-of-stock | Server returns 409; show toast "Currently unavailable" |

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
4. Login with subscriber credentials works; JWT in SecureStore
5. Deep link `tangred://magic-link?token=XXX` auto-authenticates
6. Home: all 5 sections render with skeleton loaders + real data
7. Virtual Wardrobe: add items, create outfits, all 4 tabs functional, state persists across restarts and on new device after login
8. Tan Lerida wizard: all 5 steps work end-to-end, polling surfaces result screen
9. Try-On: camera/gallery + API call + result with score and verdict
10. Shop: new arrivals, product detail, pre-book modal all functional
11. Profile: Tan Lerida ID visible, sign-out clears all state
12. Every screen uses the dark luxury palette — no white backgrounds, no blue/green/purple
13. All prices displayed via `formatINR` only
14. No placeholder screens — every screen has real UI, real data, real interactions
