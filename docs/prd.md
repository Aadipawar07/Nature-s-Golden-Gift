# Product Requirements Document — Nature's Golden Gift

## 1. What we're building
A D2C ecommerce website for **Nature's Golden Gift**, selling 100% organic, stone-ground turmeric powder direct to consumers across India. Self-built (not Shopify), MERN stack, with integrated payments (Razorpay) and shipping (Shiprocket).

## 2. Business context
- Brand already has: domain, trademark, FSSAI license, Udyam registration, MSME registration, GST number (registered under founder's father).
- Physical product, stock, and packaging already exist.
- USP: 100% organic, no additives/bleaching, sun-dried 15 days, stone-ground fresh, sealed within 48 hours.
- Founder is solo, non-technical-by-trade, building with AI coding assistance.
- Goal: first ₹1,00,000 in revenue within month one of launch (stretch goal — see `phases.md` for a realistic ramp).

## 3. Target users

| User | Description | Needs from the site |
|---|---|---|
| First-time buyer | Found the brand via Instagram/Meta ad, hasn't bought turmeric online before | Trust signals (organic certification, FSSAI), clear pricing, easy checkout, low-commitment trial size |
| Repeat household buyer | Already tried it, buying for regular kitchen use | Fast reorder, larger pack sizes, maybe a subscribe/repeat option (v2) |
| Gifting buyer | Buying as a gift (packaging supports this) | Clean product photography, trust badges, reliable delivery timelines |
| Admin (founder) | Runs the whole operation solo | One screen to see orders, payment status, shipment status, and act on problems |

## 4. Core features — v1 (must launch with these)

### Customer-facing
- Product catalogue: single product (turmeric powder), 3 pack sizes (100g / 250g / 500g)
- Product detail page: images, description, USP/organic story, price per size, add to cart
- Cart + checkout (address entry, order summary)
- Razorpay payment (UPI, cards, netbanking, wallets)
- Order confirmation page + email/WhatsApp confirmation
- Order tracking (basic — status + AWB/tracking link once shipped)
- Static pages: About/Story, Shipping Policy, Return Policy, Privacy Policy, Contact
- Mobile-responsive (majority of Meta ad traffic will be mobile)

### Admin-facing (minimal, solo-operator scope)
- Single protected admin login
- Orders list + detail view (order status, payment status, shipment status shown separately)
- Manual "mark as packed / trigger shipment" action if auto-shipment creation fails
- Basic low-stock visibility per pack size

### Out of scope for v1 (explicitly deferred — see `phases.md`)
- Multi-admin roles / RBAC beyond a single admin check
- Self-service customer returns workflow (handle manually via WhatsApp/Razorpay dashboard for now)
- Subscriptions / repeat-order automation
- Multi-product catalogue (structure should allow it later, but launch with one product)
- Loyalty/referral programs
- Full CRM (customer lifetime value dashboards etc.)
- Audit logging of admin actions

## 5. Success metrics
- Orders placed end-to-end without manual intervention (payment → shipment created automatically)
- Cart-to-payment completion rate
- Time from "payment confirmed" to "shipment created" (should be near-instant, automated)
- Revenue toward the ₹1L first-month goal
- Zero incidents of: overselling stock, lost orders due to missed webhooks, or price tampering

## 6. Non-functional requirements
- Backend is the only thing holding Razorpay/Shiprocket secrets — never the frontend (see `rules.md`)
- Page load fast enough for mobile ad traffic (compress product images, lazy-load where sensible)
- Site must have Meta Pixel installed before ad spend begins
- HTTPS everywhere in production
