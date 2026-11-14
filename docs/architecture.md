# Architecture — Nature's Golden Gift

## 1. Tech stack

| Layer              | Choice                        | Notes                                                                          |
| ------------------ | ----------------------------- | ------------------------------------------------------------------------------ |
| Frontend           | React (Vite)                  | Fast dev server, simpler than CRA                                              |
| Backend            | Node.js + Express             | Single source of truth for all business logic                                  |
| Database           | MongoDB (Atlas in production) | Mongoose ODM                                                                   |
| Auth               | Firebase Auth + Admin SDK     | Identity is handled by Firebase; roles and application data remain server-side |
| Payments           | Razorpay                      | UPI/card/netbanking/wallet                                                     |
| Shipping           | Shiprocket                    | Courier aggregator API                                                         |
| Hosting — frontend | Vercel                        | Auto HTTPS, fast global CDN                                                    |
| Hosting — backend  | Render or Railway             | Set env vars in host dashboard, never in code                                  |
| Image hosting      | Cloudinary or similar         | Don't store product images in MongoDB or on the backend server disk            |

## 2. High-level system diagram

```
Customer Website (React) ───▶ Backend (Node/Express) ───▶ Database (MongoDB)
                                       │
                                       ├──▶ Razorpay (payments)
                                       └──▶ Shiprocket (shipping)

Admin Panel (protected React routes) ───▶ Backend ───▶ Database
```

**Non-negotiable rule:** the frontend never talks to Razorpay's or Shiprocket's secret-key APIs directly. It only talks to your backend. The one exception is Razorpay's public Key ID, which is safe to use in the browser to open the Checkout popup.

## 3. Customer order journey

```
Browse products
   → Add to cart (stored server-side, tied to session/user)
   → Checkout: enter/select address
   → Backend recalculates final amount (never trusts price/qty from browser)
   → Backend creates Razorpay order → Razorpay Checkout opens
   → Customer pays
   → Razorpay returns payment_id + order_id + signature to frontend
   → Frontend sends these 3 values to backend
   → Backend verifies signature (HMAC-SHA256) — only proof that matters
   → Order status → CONFIRMED, stock decremented atomically
   → Backend creates Shiprocket order + assigns AWB
   → Order status → SHIPPED → OUT_FOR_DELIVERY → DELIVERED
     (updated via Shiprocket tracking webhooks)
```

## 4. Database schema (independent status fields)

Order, Payment, and Shipment each get their **own status field** — never one shared enum. An order can be `CONFIRMED` while its payment is `REFUNDED` and its shipment is `RTO_INITIATED`, simultaneously.

### Product

```
{ name, description, images[], variants: [{ sku, sizeLabel, price, stock, weightGrams }] }
```

### Order

```
{
  orderNumber, userId, items: [{ productId, sku, sizeLabel, qty, price }],
  address (snapshot — copy the text, never a pointer to User.addresses),
  subtotal, shipping, discount, total,
  orderStatus: PENDING_PAYMENT | CONFIRMED | PACKED | SHIPPED | OUT_FOR_DELIVERY | DELIVERED | CANCELLED,
  razorpayOrderId, createdAt
}
```

### Payment

```
{ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature, amount,
  status: CREATED | PAID | FAILED | REFUNDED | PARTIALLY_REFUNDED }
```

### Shipment

```
{ orderId, shiprocketOrderId, awbCode, courierName, weightGrams,
  status: CREATED | AWB_ASSIGNED | PICKED_UP | IN_TRANSIT | OUT_FOR_DELIVERY | DELIVERED | RTO_INITIATED | RTO_DELIVERED,
  trackingEvents: [{ status, timestamp, description }] }
```

### User

```
{
  firebaseUid, email, name, phone,
  role: CUSTOMER | ADMIN | SUPER_ADMIN, isActive
}
```

Firebase Auth manages credentials and verifies identity; the MongoDB User record is the
source of truth for application profile, activation status, and authorization role.

_(Return and AuditLog collections are deferred to post-launch — see `phases.md`.)_

## 5. Folder structure

Site is multi-page (not a single scrolling landing page) — see §5.3 for the full route map. Navbar: Home · Shop · About · Contact · Cart.

### Backend

```
/server
  /src
    /config        (db.js, env.js)
    /models        (Product.js, Order.js, Payment.js, Shipment.js, User.js)
    /routes        (products.routes.js, orders.routes.js, payments.routes.js,
                    shipments.routes.js, auth.routes.js, admin.routes.js)
    /controllers   (one file per resource, matching /routes)
    /services      (razorpay.service.js, shiprocket.service.js — external API
                    wrappers live here ONLY, never inline in controllers)
    /middleware    (auth.middleware.js, requireAdmin.middleware.js,
                    errorHandler.middleware.js, rateLimiter.middleware.js)
    /utils         (invoiceNumber.util.js, priceCalc.util.js)
  server.js
  package.json
  .env.example     (placeholder values only — see rules.md)
```

### Frontend

```
/apps/storefront
  /src
    /pages
      /account       (Dashboard.jsx, Orders.jsx, OrderDetail.jsx, TrackOrder.jsx)
      /admin         (Login.jsx, Dashboard.jsx, OrderDetail.jsx — separate
                      namespace, never mixed into customer page files)
      /legal         (PrivacyPolicy.jsx, Terms.jsx, ShippingPolicy.jsx,
                      ReturnRefundPolicy.jsx)
      Home.jsx, Shop.jsx, ProductDetail.jsx, Cart.jsx, Checkout.jsx,
      OrderConfirmation.jsx, Login.jsx, Register.jsx, ForgotPassword.jsx,
      About.jsx, Sourcing.jsx, Contact.jsx, FAQ.jsx, NotFound.jsx
    /components
      /layout        (Navbar.jsx, Footer.jsx, AnnouncementBar.jsx)
      /product       (ProductCard.jsx, VariantSelector.jsx, PriceDisplay.jsx)
      /cart          (CartDrawer.jsx, CartLineItem.jsx, CartSummary.jsx)
      /common        (Button.jsx, Badge.jsx, TrustBadges.jsx, Toast.jsx)
      /admin         (AdminGuard.jsx — route protection wrapper)
    /context         (CartContext.jsx, AuthContext.jsx)
    /api             (client.js + one file per resource: products.js, orders.js,
                      payments.js, shipments.js, auth.js)
    /styles          (tokens.css — design tokens from design.md, global.css)
    /utils           (formatPrice.js, validators.js)
    App.jsx, main.jsx, routes.jsx
  index.html
  vite.config.js
  package.json
  .env.example       (VITE_API_BASE_URL only — never secrets in frontend env)
```

### 5.1 Where the six planning docs live

Keep `prd.md`, `architecture.md`, `rules.md`, `phases.md`, `design.md`, and `memory.md` in a `/docs` folder at the **repo root** — outside both `/frontend` and `/backend`, since they describe the whole project, not one half of it:

```
/nature-golden-gift          (repo root)
  /docs
    prd.md
    architecture.md
    rules.md
    phases.md
    design.md
    memory.md
  /apps/storefront
  /server
  README.md
  .gitignore
```

This keeps them visible to anyone opening the repo root (including an AI coding assistant reading the project for context) without cluttering either app's own source tree. Commit them to Git like any other file — they're documentation, not secrets.

### 5.2 Security notes on the scaffold itself

- `.gitignore` must include `.env`, `node_modules/`, `/frontend/dist`, `/backend/dist`, `*.log`, `.DS_Store` — set this up in the very first commit, before any real code.
- Never create a real `.env` — only `.env.example` with placeholder values (see `rules.md` §1).
- `/backend/src/services` is the only place Razorpay/Shiprocket credentials are referenced — never imported into `/routes` or `/controllers` directly.

### 5.3 Page / route map

**Customer-facing — required for launch:** `/`, `/shop`, `/product/:slug`, `/cart`, `/checkout`, `/order-confirmation/:orderId`, `/login`, `/register`, `/account/orders`, `/account/orders/:id/track`

**Legal — required for launch** (Razorpay Live Mode and Meta ad approval both check for these): `/privacy-policy`, `/terms`, `/shipping-policy`, `/return-refund-policy`, `/contact`

**Recommended, not blocking:** `/about` (folds in "Our Story"), `/sourcing`, `/faq`, `/404`

**Admin — minimal scope:** `/admin/login`, `/admin/dashboard` (orders list), `/admin/orders/:id`

**Deferred post-launch:** `/shop/:categorySlug`, `/account/wishlist`, `/account/reviews`, `/account/returns`, `/recipes`, `/benefits/:slug`, `/bulk-enquiry`, `/admin/coupons`, `/admin/webhooks`, `/admin/settings`, `/store-locator`

## 6. Core API endpoints (v1)

| Endpoint                                 | Caller                                     | Purpose                                                                            |
| ---------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------- |
| `POST /api/auth/sync`                    | Frontend                                   | Verify Firebase ID token and synchronize the MongoDB customer profile              |
| `GET /api/auth/me`                       | Authenticated customer                     | Read the current profile                                                          |
| `PATCH /api/auth/me`                     | Authenticated customer                     | Update the current profile (name and phone only)                                  |
| `GET /api/addresses`                     | Authenticated customer                     | List the current customer's active addresses                                     |
| `POST /api/addresses`                    | Authenticated customer                     | Create an address                                                                 |
| `PATCH /api/addresses/:id`               | Authenticated customer                     | Update an owned address                                                          |
| `DELETE /api/addresses/:id`               | Authenticated customer                     | Soft-delete an owned address                                                     |
| `POST /api/addresses/:id/default`         | Authenticated customer                     | Set an owned address as default                                                  |
| `GET /api/admin/ping`                    | Admin or super-admin                       | Verify that MongoDB-backed role authorization is enforced                        |
| `GET /api/products`                      | Frontend                                   | List product + variants                                                            |
| `POST /api/orders`                       | Frontend, at checkout                      | Create Order, status `PENDING_PAYMENT`, server-calculated total                    |
| `POST /api/payments/create-order`        | Frontend                                   | Calls Razorpay Orders API using DB amount, returns `razorpay_order_id`             |
| `POST /api/payments/verify`              | Frontend, after Checkout success           | Verifies HMAC signature, marks Payment `PAID`, Order `CONFIRMED`, decrements stock |
| `POST /api/payments/webhook`             | Razorpay servers                           | Independent confirmation — source of truth even if verify never fires              |
| `POST /api/shipments/create`             | Backend (internal, triggered post-payment) | Creates Shiprocket order + AWB                                                     |
| `GET /api/shipments/track/:awb`          | Frontend / Admin                           | Shows current tracking status                                                      |
| `GET /api/admin/orders`                  | Admin panel                                | List all orders with all three statuses                                            |
| `POST /api/admin/orders/:id/mark-packed` | Admin panel                                | Manual override if automation needs a nudge                                        |

## 7. Webhooks — critical implementation note

The webhook route **must** use `express.raw({ type: 'application/json' })`, not the global `express.json()` parser, or HMAC signature verification will always fail. Mount this route before any global JSON body-parser middleware, or exclude it explicitly.
