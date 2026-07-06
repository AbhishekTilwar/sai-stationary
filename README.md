# Sai Gift, Stationery and Xerox — E‑Commerce Platform

A production-ready, mobile-first e‑commerce platform for a gift, stationery & xerox shop —
gifts, customized gifts, school & office stationery, art supplies, corporate gifts,
festival hampers and xerox/printing services. Orders are delivered straight to the shop's
**WhatsApp** on checkout.

Built with **React + Vite + Tailwind + Redux Toolkit + React Query + Framer Motion** on the
frontend, **Node/Express** on the backend, and **Firebase (Auth + Firestore + Storage)** as the
data layer, with **Razorpay** payments (UPI / Cards / COD).

> 💡 **Runs out of the box in "demo mode"** — without any Firebase or Razorpay keys, the
> storefront is fully browsable with a bundled mock catalog, working cart, wishlist, checkout
> and order tracking (persisted to `localStorage`). Add real keys to switch to live data.

---

## Monorepo layout

```
Sai_Stationary/
├── client/                 # React + Vite storefront & admin
├── server/                 # Node/Express API (payments, orders, notifications, SEO)
├── firestore.rules         # Firestore security rules
├── storage.rules           # Firebase Storage security rules
├── firestore.indexes.json  # Composite indexes
├── firebase.json           # Hosting + rules config
├── docker-compose.yml      # Run the API in a container
├── .github/workflows/ci.yml# CI/CD pipeline
├── ARCHITECTURE.md          # ← All 13 deliverables (architecture, schema, API, scaling…)
└── README.md
```

---

## Quick start

### 1. Frontend (storefront + admin)

```bash
cd client
npm install
npm run dev
# open http://localhost:5173
```

Demo mode tips:
- **No sign-up needed.** Browse and add to cart as a guest. At checkout you verify your **mobile
  number with an OTP** — the demo OTP is always **`123456`**.
- The **mobile number is the account key**: orders and saved addresses are stored against it, so
  checking out again with the same number recognises you and pre-fills your address.
- **Admin:** verify with mobile number `9999999999` (configurable via `VITE_ADMIN_PHONES`) to unlock `/admin`.
- **Coupons:** try `WELCOME10`, `FLAT100`, `FIRST50` in the cart.
- Place an order → it appears in **My Account → Orders** and the **order tracking** timeline.

### 2. Backend (optional for demo)

```bash
cd server
npm install
cp .env.example .env   # fill in Razorpay + Firebase Admin keys
npm run dev
# API on http://localhost:4000  (Vite proxies /api → :4000)
```

### 3. Go live (real data)

1. Create a Firebase project → enable **Authentication**, **Firestore**, **Storage**.
2. Copy `client/.env.example` → `client/.env` and fill the `VITE_FIREBASE_*` values.
3. Deploy rules: `firebase deploy --only firestore:rules,storage:rules`.
4. Set Razorpay keys (`VITE_RAZORPAY_KEY_ID` on the client, secret on the server).
5. Build & deploy (see **Deployment** in `ARCHITECTURE.md`).

---

## Tech stack

| Layer       | Choice                                                             |
|-------------|--------------------------------------------------------------------|
| Frontend    | React 18, Vite, React Router, Redux Toolkit, React Query, Tailwind, Framer Motion |
| Backend     | Node.js, Express, JWT (Firebase ID tokens), REST                   |
| Data        | Firebase Auth, Firestore, Firebase Storage                         |
| Payments    | Razorpay (UPI / Cards / Netbanking) + COD                          |
| Deploy      | Firebase Hosting / Vercel (web) · Docker + Render/VPS (API) · CDN  |

See **[`ARCHITECTURE.md`](./ARCHITECTURE.md)** for the full system design, Firestore schema,
API reference, component tree, security model, deployment topology, CI/CD and the
scalability plan for 100,000+ users.

---

## Key features

- 🏠 Premium homepage: hero carousel, categories, best sellers, new arrivals, festival collection, testimonials, newsletter
- 🔎 Search, filters (price, brand, category, rating, availability) and sorting
- 🛒 Cart with quantity, save-for-later and coupons · slide-in cart drawer
- ❤️ Wishlist
- 📱 Passwordless, guest-friendly checkout: **Verify (mobile + OTP) → Address → Delivery → Payment → Review → Confirmation** with Razorpay/UPI/Card/COD
- 📲 Mobile-first: bottom tab bar, always-on search, sticky add-to-cart bar on product pages
- 📦 Order tracking timeline (Pending → Processing → Packed → Shipped → Delivered)
- 👤 Account: profile, orders, addresses, loyalty & referral
- 🛠️ Admin: analytics dashboard, products, orders, low-stock alerts
- 🎁 Local-business extras: WhatsApp ordering, COD, corporate/bulk enquiry form, gift personalization upload, loyalty points
- 🔍 SEO: dynamic meta tags, product JSON-LD, sitemap & robots.txt
