# Sai Stationary — System Architecture & Design

This document covers all 13 requested deliverables for the Sai Stationary e‑commerce platform.

1. [System Architecture Diagram](#1-system-architecture-diagram)
2. [Folder Structure](#2-folder-structure)
3. [Firestore Schema Design](#3-firestore-schema-design)
4. [API Design](#4-api-design)
5. [React Component Structure](#5-react-component-structure)
6. [Admin Dashboard Design](#6-admin-dashboard-design)
7. [Database Security Rules](#7-database-security-rules)
8. [Firebase Storage Structure](#8-firebase-storage-structure)
9. [UI Wireframes](#9-ui-wireframes)
10. [Responsive Design Strategy](#10-responsive-design-strategy)
11. [Deployment Architecture](#11-deployment-architecture)
12. [CI/CD Pipeline](#12-cicd-pipeline)
13. [Scalability Plan for 100,000+ Users](#13-scalability-plan-for-100000-users)

---

## Architectural principle: Firebase + Express division of responsibility

The brief lists both Firebase/Firestore **and** a Node/Express backend. These overlap, so we
split responsibilities the way modern D2C shops do:

- **Firebase (Auth + Firestore + Storage)** is the primary data layer. The client reads catalog
  data (products, categories, banners) **directly** from Firestore — fast, real-time, cacheable,
  and guarded by security rules. **Auth is passwordless: phone number + OTP** (Firebase Phone Auth).
  Customers never register — they browse, add to cart, and verify their mobile number with an OTP
  only at checkout. The **mobile number is the user key** (`users/{phone}`, orders' `userId`, saved
  addresses), so a returning customer is recognised by their number alone.
- **Node/Express** is the **server-only trust boundary** for everything that must not run on the
  client:
  - Razorpay **order creation + signature verification + webhooks** (needs the secret key).
  - **Server-validated order placement** (recompute totals, validate coupons, decrement stock in a transaction) — never trust client-sent prices.
  - **Notifications** (email, WhatsApp), **invoice generation**, **sitemap.xml/robots.txt**.
  - Privileged admin writes & audit logging via the **Firebase Admin SDK**.

This keeps reads cheap and real-time while keeping money, inventory and secrets safe on the server.

---

## 1. System Architecture Diagram

```
                                ┌──────────────────────────────┐
                                │           Clients            │
                                │  Web (React PWA) · Mobile     │
                                │  (future Flutter app)         │
                                └───────────────┬──────────────┘
                                                │ HTTPS
                        ┌───────────────────────┼────────────────────────┐
                        │                        │                        │
                 (static assets)          (catalog reads)           (sensitive ops)
                        │                        │                        │
                        ▼                        ▼                        ▼
              ┌──────────────────┐    ┌────────────────────┐    ┌──────────────────────┐
              │   CDN / Hosting  │    │  Firebase Firestore│    │  Node/Express API     │
              │ Firebase Hosting │    │  (products, orders,│    │  (Docker → Render/VPS)│
              │  or Vercel       │    │   reviews, users…) │    │                        │
              └──────────────────┘    └─────────┬──────────┘    └──────────┬───────────┘
                        ▲                        │ Admin SDK                │
                        │                        ▼                          ▼
              ┌──────────────────┐    ┌────────────────────┐    ┌──────────────────────┐
              │ Firebase Storage │    │  Firebase Auth     │    │  Razorpay (Payments)  │
              │ (product images, │    │  (JWT / ID tokens, │    │  UPI · Cards · COD     │
              │  customizations) │    │   custom claims)   │    └──────────────────────┘
              └──────────────────┘    └────────────────────┘
                                                                 ┌──────────────────────┐
                                                                 │ Email + WhatsApp APIs │
                                                                 │ (SendGrid/Resend,     │
                                                                 │  Meta Cloud API)      │
                                                                 └──────────────────────┘
```

**Request flows**
- *Browse:* Client → Firestore (direct, cached by React Query) + Storage/CDN for images.
- *Auth:* Client → Firebase **Phone Auth** (mobile + OTP) → ID token (JWT, includes `phone_number`)
  attached to API calls as `Authorization: Bearer`. No login is required to browse or fill a cart.
- *Checkout (online):* Client → `POST /api/payments/create-order` → Razorpay → client checkout →
  `POST /api/payments/verify` → Express writes order to Firestore (transaction) → email + WhatsApp.
- *Checkout (COD):* Client → `POST /api/orders` → Express validates & writes order → notifications.
- *Admin write:* Client (admin claim) → `POST /api/products` → Express (Admin SDK) → Firestore + Storage.

---

## 2. Folder Structure

```
client/
├── public/                       # favicon, static
├── index.html
├── vite.config.js                # aliases, chunking, /api proxy
├── tailwind.config.js            # brand colors & tokens
└── src/
    ├── main.jsx                  # providers: Redux, React Query, Router, Helmet, Toaster
    ├── App.jsx                   # routes (lazy-loaded) + layouts + auth guards
    ├── index.css                 # Tailwind layers + component classes
    ├── config/
    │   └── site.js               # brand, currency, order statuses, payment methods
    ├── lib/
    │   ├── firebase.js           # client SDK init (demo-mode aware)
    │   └── format.js             # price/discount helpers
    ├── store/                    # Redux Toolkit
    │   ├── index.js              # store + localStorage persistence
    │   ├── persist.js
    │   └── slices/{cart,wishlist,auth,ui}Slice.js
    ├── services/                 # data access (Firestore-or-mock)
    │   ├── authService.js
    │   ├── catalogService.js
    │   ├── orderService.js
    │   └── couponService.js
    ├── hooks/
    │   └── useAuthListener.js
    ├── data/                     # demo-mode mock catalog
    │   ├── products.js
    │   └── categories.js
    ├── components/
    │   ├── layout/   {StoreLayout, AdminLayout, Navbar, Footer, WhatsAppButton}
    │   ├── common/   {Seo, Rating, SectionHeader, PageLoader, ScrollToTop}
    │   ├── auth/     {RequireAuth}
    │   ├── product/  {ProductCard, ProductCarousel, FilterSidebar}
    │   ├── cart/     {CartDrawer}
    │   └── home/     {Hero, CategoryGrid, FeatureStrip, Testimonials, Newsletter}
    └── pages/
        ├── Home, Products, ProductDetail, Cart, Checkout, Wishlist,
        ├── Login, Account, OrderTracking, CorporateEnquiry, NotFound
        └── admin/ {Dashboard, Products, Orders}

server/
├── Dockerfile
└── src/
    ├── index.js                  # express app, security middleware, route mounts
    ├── config/firebaseAdmin.js   # Admin SDK init
    ├── middleware/{auth,errorHandler}.js
    ├── services/{razorpay,email,whatsapp}.js
    └── routes/{payments,orders,products,notifications,seo}.js
```

---

## 3. Firestore Schema Design

Collections (top-level) with representative documents:

```jsonc
// users/{phone}            <-- KEYED BY 10-DIGIT MOBILE NUMBER (no email/password)
{
  "name": "Priya Sharma",
  "phone": "9999999999",
  "role": "customer",            // 'customer' | 'admin'  (mirror of custom claim)
  "addresses": [                  // saved against the mobile number for fast checkout
    { "id": "addr_1", "name", "phone", "line1", "city", "state", "pincode", "isDefault": true }
  ],
  "loyaltyPoints": 350,
  "referralCode": "SAI-PRIYA-100",
  "referredBy": "SAI-RAHUL-100",
  "createdAt": <timestamp>
}

// products/{productId}
{
  "name": "Parker Jotter Ball Pen",
  "slug": "parker-jotter-ball-pen",  // unique, indexed (used for /product/:slug)
  "category": "pens",                 // -> categories/{id}
  "brand": "Parker",
  "price": 449, "mrp": 650,
  "stock": 42,
  "rating": 4.6, "reviewCount": 218,
  "images": ["gs://…/products/p1/0.jpg"],
  "variants": [{ "id": "blue", "label": "Blue Ink", "priceDelta": 0 }],
  "badges": ["bestseller"],
  "bestSeller": true, "newArrival": false, "festival": null,
  "customizable": false,
  "description": "…",
  "createdAt": <timestamp>, "updatedAt": <timestamp>
}

// categories/{categoryId}  -> { name, slug, icon, image, order }

// orders/{orderId}
{
  "userId": "9999999999",         // customer's mobile number (the user key)
  "items": [{ "productId", "name", "price", "qty", "variant", "customization" }],
  "address": { … },
  "delivery": { "id": "express", "label", "eta", "price" },
  "payment": { "method": "razorpay", "status": "paid", "paymentId": "pay_…" },
  "totals": { "subtotal", "discount", "shipping", "total" },
  "couponCode": "WELCOME10",
  "status": "Shipped",            // Pending|Processing|Packed|Shipped|Delivered|Cancelled
  "timeline": [{ "status": "Pending", "at": <ts> }, …],
  "createdAt": <ts>
}

// reviews/{reviewId} -> { productId, userId, userName, rating, text, createdAt }
// coupons/{couponId} -> { code, type:'percent'|'flat', value, maxDiscount, minOrder, firstOrderOnly, active, expiresAt }
// wishlists/{userId} -> { productIds: ["p1","p2"] }
// carts/{userId}     -> { items: [...], updatedAt }
// banners/{bannerId} -> { title, image, cta, link, active, order }
// enquiries/{id}     -> { company, name, email, phone, quantity, budget, message, createdAt }
// newsletter/{email} -> { subscribedAt }
```

**Indexing notes** (see `firestore.indexes.json`): composite indexes on
`products(category, price)`, `products(category, rating desc)`, `orders(userId, createdAt desc)`,
`reviews(productId, createdAt desc)`. Full-text search beyond prefix matching uses **Algolia/Typesense**
(see scaling plan).

---

## 4. API Design

Base URL: `/api`. Auth via `Authorization: Bearer <Firebase ID token>`.

| Method | Endpoint                       | Auth   | Purpose |
|--------|--------------------------------|--------|---------|
| GET    | `/health`                      | –      | Liveness probe |
| POST   | `/payments/create-order`       | user   | Create Razorpay order (amount validated server-side) |
| POST   | `/payments/verify`             | user   | Verify checkout signature → mark order paid |
| POST   | `/payments/webhook`            | sig    | Razorpay webhook (captured/failed/refund) — raw body |
| POST   | `/orders`                      | user   | Place order (recompute totals, validate coupon, decrement stock) |
| GET    | `/orders`                      | user   | List the current user's orders |
| PATCH  | `/orders/:id/status`           | admin  | Update status + append timeline + notify |
| POST   | `/products`                    | admin  | Create product |
| PUT    | `/products/:id`                | admin  | Update product |
| DELETE | `/products/:id`                | admin  | Delete product |
| PATCH  | `/products/:id/inventory`      | admin  | Adjust stock |
| POST   | `/notifications/newsletter`    | –      | Subscribe email |
| POST   | `/notifications/enquiry`       | –      | Corporate/bulk enquiry |
| POST   | `/notifications/welcome`       | –      | Welcome email |
| GET    | `/sitemap.xml`, `/robots.txt`  | –      | SEO |

**Conventions:** JSON in/out; errors as `{ "error": "message" }` with proper HTTP codes;
rate limited (120 req/min/IP); `helmet` + CORS allow-list; idempotency via the app-level `orderId`.

**Catalog reads are NOT REST endpoints** — the client reads Firestore directly through
`catalogService.js` (real-time + offline cache). The same shape is returned in demo mode.

---

## 5. React Component Structure

```
App (Router + auth listener)
├── StoreLayout
│   ├── Navbar (search, cart badge, wishlist, account, category nav)
│   ├── <Outlet/>
│   │   ├── Home ── Hero · CategoryGrid · FeatureStrip · ProductCarousel×3 · Testimonials · Newsletter
│   │   ├── Products ── FilterSidebar + ProductCard grid + sort
│   │   ├── ProductDetail ── gallery/zoom · variants · customization upload · Rating · ReviewSection · related
│   │   ├── Cart ── line items · save-for-later · coupon · summary
│   │   ├── Checkout ── stepper (Address→Delivery→Payment→Review) · summary
│   │   ├── Wishlist · Login · Account (tabs) · OrderTracking (timeline) · CorporateEnquiry · NotFound
│   ├── Footer · WhatsAppButton · CartDrawer
└── AdminLayout (sidebar)
    └── <Outlet/> ── Dashboard (KPIs + charts) · Products (table) · Orders (table)
```

**State management**
- **Redux Toolkit** for client-owned state: `cart`, `wishlist`, `auth`, `ui` (persisted: cart + wishlist).
- **React Query** for server/async state: products, product detail, related (caching, retries, stale-time).
- **Local component state** for ephemeral UI (filters, form fields, steppers).

---

## 6. Admin Dashboard Design

- **KPIs:** Revenue, Orders, Products, Customers, Avg. Order Value — each with trend chips.
- **Charts:** Monthly Revenue (bar), Sales by Category (horizontal bars), Top Products (ranked list).
  (Rendered with lightweight CSS/SVG here; swap in Recharts/Chart.js for richer interactions.)
- **Inventory:** Low-stock alerts (threshold-based), stock badges in the product table.
- **Management screens:** Products (search, add/edit/delete, image upload to Storage), Orders
  (status dropdown → `PATCH /orders/:id/status`), plus future Coupons/Banners/Users/Analytics.
- **Access control:** `/admin/*` is guarded by `RequireAuth role="admin"` (Firebase custom claim).

---

## 7. Database Security Rules

See [`firestore.rules`](./firestore.rules) and [`storage.rules`](./storage.rules). Summary:

- **products / categories / banners:** public read; **admin-only** write (`request.auth.token.role == 'admin'`).
- **users `{phone}`:** read/update only own doc, where the verified token phone matches the doc id
  (`request.auth.token.phone_number == '+91' + phone`); admin override.
- **orders:** owner reads/creates where `userId` matches their verified phone; **only admin** updates status.
- **reviews:** public read; verified users create their own; author/admin can edit/delete.
- **coupons:** signed-in read (for validation), admin write.
- **carts / wishlists `{phone}`:** strictly owner-only (mobile-number document).
- **default deny** for anything unmatched.

Admin role is assigned via a **custom claim** (`admin.auth().setCustomUserClaims(uid, { role: 'admin' })`)
and mirrored into `users/{phone}.role` for queries. (In demo mode, configure admin numbers via
`VITE_ADMIN_PHONES`; default `9999999999`.)

---

## 8. Firebase Storage Structure

```
gs://<bucket>/
├── products/{productId}/{n}.jpg        # public read, admin write, ≤5MB, image/*
├── banners/{bannerId}.jpg              # public read, admin write
├── customizations/{uid}/{file}.jpg     # owner+admin read, owner write, ≤10MB (gift personalization)
└── avatars/{uid}/{file}.jpg            # public read, owner write, ≤2MB
```

Images are served via Firebase's CDN; use **resized image extensions** or an image CDN
(Cloudinary/imgix) for responsive `srcset` in production.

---

## 9. UI Wireframes

```
HOME (mobile-first)                      PRODUCT DETAIL
┌───────────────────────────┐           ┌───────────────────────────┐
│ promo bar                 │           │ breadcrumb                │
│ [logo]  search   ♡ 🛒 👤  │           │ ┌─────────┐  Brand        │
│ category nav (scroll)     │           │ │ gallery │  Title ★★★★☆  │
├───────────────────────────┤           │ │ + zoom  │  ₹449  ₹650   │
│   HERO carousel  [CTA]    │           │ └─────────┘  variants     │
├───────────────────────────┤           │ thumbs       [qty][Add]♡  │
│ category cards (grid)     │           │              customize ⬆  │
│ feature strip (trust)     │           ├───────────────────────────┤
│ Best Sellers  → carousel  │           │ description · reviews     │
│ New Arrivals  → carousel  │           │ You may also like (grid)  │
│ Festival band → carousel  │           └───────────────────────────┘
│ testimonials · newsletter │
└───────────────────────────┘
CART                                     CHECKOUT
┌───────────────────────────┐           ┌───────────────────────────┐
│ items   |  Order Summary  │           │ ①Addr ②Deliv ③Pay ④Review │
│ [img] name  qty  ₹   🗑    │           │ ┌── step form ──┐ Summary │
│ save for later            │           │ │  fields/opts  │ subtotal │
│ coupon [____][Apply]      │           │ └───────────────┘ total    │
│ subtotal/discount/total   │           │   [Back]      [Continue]   │
│ [Proceed to Checkout]     │           └───────────────────────────┘
└───────────────────────────┘
```

---

## 10. Responsive Design Strategy

- **Mobile-first** Tailwind breakpoints: base → `sm`(640) → `md`(768) → `lg`(1024) → `xl`(1280).
- Product grids: 2 cols (mobile) → 3 (`sm`) → 4 (`xl`); category grid 2 → 4 → 8.
- Navigation: hamburger + slide-down on mobile; full category bar on `lg+`.
- Sidebars (filters, summaries) collapse into drawers/stacked cards on small screens.
- Sticky elements (order summary, filters) only on `lg+`; full-width CTAs on mobile.
- Touch targets ≥ 44px; `loading="lazy"` images; reduced-motion respected via Framer defaults.
- Fonts via `font-display: swap`; preconnect to Google Fonts.

---

## 11. Deployment Architecture

```
┌────────────────────┐     build      ┌──────────────────────────────┐
│ GitHub (main)      │ ─────────────▶ │ CI (GitHub Actions)          │
└────────────────────┘                └───────────┬──────────────────┘
                                                   │
                  ┌────────────────────────────────┼─────────────────────────────┐
                  ▼                                 ▼                              ▼
       Frontend (client/dist)            API (server, Docker)            Rules & Indexes
       Firebase Hosting / Vercel         Render / VPS (docker-compose)   firebase deploy
       + global CDN, immutable assets    autoscale, /api/health probe    firestore/storage
```

- **Frontend:** static build deployed to **Firebase Hosting** (or Vercel) behind a global CDN;
  SPA rewrite to `index.html`; long-cache hashed assets.
- **Backend:** containerized (`server/Dockerfile`) and deployed to **Render** or a **VPS** via
  `docker-compose.yml`; health-checked at `/api/health`; horizontally scalable (stateless).
- **Images:** Firebase Storage + CDN (optionally fronted by Cloudinary/imgix for transforms).
- **Secrets:** Razorpay secret & service account only on the server / CI secrets — never bundled.

---

## 12. CI/CD Pipeline

See [`.github/workflows/ci.yml`](./.github/workflows/ci.yml):

1. **client** job → `npm ci` → `vite build` → upload `dist` artifact.
2. **server** job → `npm ci` → `node --check` (syntax/lint gate; add tests here).
3. **deploy-hosting** job (on `main` push) → build client → deploy to Firebase Hosting via
   `FirebaseExtended/action-hosting-deploy` using `FIREBASE_SERVICE_ACCOUNT` secret.

Extensions: add unit tests (Vitest) + e2e (Playwright), a Docker build-and-push step for the API,
and `firebase deploy --only firestore:rules,storage:rules` on rule changes. PRs get preview channels.

---

## 13. Scalability Plan for 100,000+ Users

**Reads & catalog**
- Firestore scales horizontally; keep documents small and denormalize (`reviewCount`, `rating`
  cached on the product). Use React Query + Firestore offline cache + CDN to cut read volume.
- Hot lists (best sellers, new arrivals) precomputed into a `feeds/*` doc by a scheduled function.

**Search**
- Move beyond prefix matching to **Algolia / Typesense / Meilisearch**, synced from Firestore via
  Cloud Functions triggers — instant, typo-tolerant, faceted search.

**Writes, money & inventory**
- All order/inventory writes go through Express + Firestore **transactions** (atomic stock
  decrement, no overselling). Idempotency keyed on app `orderId`. Razorpay **webhooks** are the
  source of truth for payment state.

**API tier**
- Stateless Express → run N replicas behind a load balancer; autoscale on CPU/RPS. Redis for
  rate-limit counters, sessions and hot caches. Queue (BullMQ/PubSub) for emails, WhatsApp,
  invoices and analytics so requests stay fast.

**Media**
- Image CDN with responsive `srcset`, WebP/AVIF, lazy loading; offload all bandwidth from origin.

**Observability & resilience**
- Structured logs, Sentry (errors), uptime + p95 latency dashboards; alerting on error rate and
  payment failures. Multi-region hosting/CDN; Firestore daily exports for backup/DR.

**Cost & data**
- Aggregate analytics into `stats/*` rollups (avoid scanning `orders` for dashboards).
- Archive old orders to BigQuery for reporting; TTL on transient docs (carts/sessions).

**Future-ready (designed for, not yet built)**
- *Multi-vendor:* add `vendorId` to products/orders + a `vendors` collection + payout splits.
- *Mobile app (Flutter):* reuses the same REST API + Firebase Auth/Firestore.
- *Multiple branches / franchise:* `branches` collection + per-branch inventory & delivery zones.
- *ERP / inventory sync:* Express integration layer + webhooks/queues to external ERP.
- *AI recommendations:* event stream → recommendations service → `recommended` feed per user.
