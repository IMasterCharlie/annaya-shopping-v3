# ANNAYA Boutique — Next.js 15

A full-stack Indian ethnic fashion storefront built entirely in Next.js 15 (App Router). Frontend and backend live in the same repo with no separate Express server.

## Tech Stack

| Concern    | Technology |
|------------|------------|
| Framework  | Next.js 15 (App Router) |
| Language   | TypeScript |
| Styling    | Tailwind CSS v3 |
| Auth       | Auth0 via `@auth0/nextjs-auth0` v3 |
| Database   | MongoDB Atlas + Mongoose |
| Payments   | Razorpay |
| Animation  | Motion (Framer Motion v12) |
| Images     | `next/image` with remote patterns |
| Fonts      | `next/font/google` (Playfair Display + Inter) |

---

## Project Structure

```
annaya-next/
├── app/
│   ├── api/
│   │   ├── auth/[auth0]/route.ts       ← Auth0 login/logout/callback
│   │   ├── products/route.ts           ← GET  /api/products
│   │   ├── products/[id]/route.ts      ← GET  /api/products/:id
│   │   ├── cart/route.ts               ← GET  /api/cart
│   │   ├── cart/add/route.ts           ← POST /api/cart/add
│   │   ├── cart/update/route.ts        ← PUT  /api/cart/update
│   │   ├── cart/remove/[productId]/[size]/route.ts
│   │   ├── cart/clear/route.ts         ← DELETE /api/cart/clear
│   │   ├── wishlist/route.ts           ← GET + POST /api/wishlist
│   │   ├── orders/route.ts             ← GET + POST /api/orders
│   │   ├── orders/[id]/route.ts        ← GET + PATCH /api/orders/:id
│   │   ├── payment/create-order/route.ts
│   │   └── payment/verify/route.ts
│   ├── (pages)
│   │   ├── page.tsx                    ← Home
│   │   ├── shop/page.tsx
│   │   ├── product/[id]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx           ← 3-step + Razorpay
│   │   ├── success/page.tsx
│   │   ├── wishlist/page.tsx
│   │   ├── account/page.tsx            ← Live order history
│   │   ├── search/page.tsx
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx
│   ├── layout.tsx                      ← Fonts, Auth0 UserProvider, AppProvider
│   └── globals.css
├── components/
│   ├── Navigation.tsx                  ← Header + Mobile BottomNav
│   └── ProductCard.tsx
├── context/
│   └── AppContext.tsx                  ← Cart + Wishlist state, API sync
├── hooks/
│   └── useRazorpay.ts
├── lib/
│   └── mongodb.ts                      ← Shared Mongoose connection utility
├── models/
│   ├── Product.ts                      ← Matches existing MongoDB collection
│   ├── Cart.ts
│   ├── Order.ts                        ← Includes Razorpay fields
│   └── UserProfile.ts                  ← Auth0 sub + wishlist
├── scripts/
│   └── seed.ts                         ← Seed MongoDB
├── types/
│   └── index.ts                        ← Shared TypeScript types
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Quick Start

### 1. Install

```bash
npm install
```

### 2. Environment variables

```bash
cp .env.local.example .env.local
```

Fill in all values (see sections below).

### 3. Seed MongoDB

```bash
npm run seed
```

### 4. Run

```bash
npm run dev       # http://localhost:3000
```

---

## Auth0 Setup

### Step 1 — Create a Regular Web Application

1. [manage.auth0.com](https://manage.auth0.com) → **Applications → Create Application → Regular Web Application**
2. In **Settings**:
   - **Allowed Callback URLs**: `http://localhost:3000/api/auth/callback`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`
3. Copy **Domain**, **Client ID**, **Client Secret** into `.env.local`

### Step 2 — Generate AUTH0_SECRET

```bash
openssl rand -hex 32
```

Paste the output as `AUTH0_SECRET` in `.env.local`.

### Step 3 — Create an API (for audience)

1. **Applications → APIs → Create API**
2. Identifier: `https://annaya-api`
3. Copy the identifier as `AUTH0_AUDIENCE`

**Complete `.env.local`:**
```env
AUTH0_SECRET=<output of openssl rand -hex 32>
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
AUTH0_AUDIENCE=https://annaya-api

MONGODB_URI=mongodb+srv://...

RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

---

## Razorpay Setup

1. Sign up at [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. **Settings → API Keys → Generate Key**
3. Use `rzp_test_*` keys for development

### Payment Flow

```
User clicks "Pay ₹X"
  → POST /api/payment/create-order   (server creates Razorpay order)
  → Razorpay checkout widget opens   (client-side, loads SDK)
  → User pays
  → handler() fires with payment IDs
  → POST /api/payment/verify         (server verifies HMAC signature)
  → POST /api/orders                 (saves order, clears cart)
  → redirect /success
```

---

## MongoDB Schema

Your existing `Product` collection is used as-is:

```json
{
  "name":            "string",
  "slug":            "string (unique)",
  "description":     "string",
  "category":        "string",
  "images":          ["string"],
  "price":           "number",
  "originalPrice":   "number",
  "discountPercent": "number",
  "sizes":           ["string"],
  "colors":          [{ "name": "string", "hex": "string" }],
  "stock":           "number",
  "rating":          "number",
  "reviewCount":     "number",
  "isFeatured":      "boolean",
  "isNewArrival":    "boolean"
}
```

---

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/products` | Public | List with `?category&sortBy&search&page&limit` |
| GET | `/api/products/:id` | Public | Single product |
| GET | `/api/cart` | Required | Get cart |
| POST | `/api/cart/add` | Required | Add item |
| PUT | `/api/cart/update` | Required | Update quantity |
| DELETE | `/api/cart/remove/:pid/:size` | Required | Remove item |
| DELETE | `/api/cart/clear` | Required | Empty cart |
| GET | `/api/wishlist` | Required | Get wishlist |
| POST | `/api/wishlist` | Required | Toggle product |
| GET | `/api/orders` | Required | List orders |
| POST | `/api/orders` | Required | Create order (clears cart) |
| GET | `/api/orders/:id` | Required | Single order |
| PATCH | `/api/orders/:id` | Required | Cancel order |
| POST | `/api/payment/create-order` | Required | Create Razorpay order |
| POST | `/api/payment/verify` | Required | Verify HMAC signature |

---

## Production Deploy (Vercel)

1. Push to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Add all `.env.local` variables as Vercel Environment Variables
4. Update Auth0 callback/logout URLs to your production domain
5. Switch to `rzp_live_*` Razorpay keys
