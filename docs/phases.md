# Phases — Nature's Golden Gift

Scoped to a solo founder building with AI coding assistance, targeting launch within ~3-4 weeks. Each phase should be fully working before moving to the next — don't parallelize payment and shipping integration, they're each complex enough alone.

## Phase 0 — Foundation (Days 1-2)

- Express app scaffolded, MongoDB Atlas connected
- Mongoose models: Product, Order, Payment, Shipment, User (per `architecture.md`)
- Basic JWT auth middleware working (login/register)
- Frontend scaffolded (Vite + React), routing set up, deployed once (even empty) to Vercel to confirm the pipeline works

**Done when:** backend responds to a health-check route, frontend deploys, both connect to each other locally.

## Phase 1 — Product & commerce logic (no payment yet) (Days 3-6)

- Product listing + detail pages, using real product data (name, description, images, 3 variants with weights)
- Cart (add/remove/update quantity), stored server-side
- Checkout page: address form, order summary
- `POST /api/orders` creates an Order at `PENDING_PAYMENT` with server-calculated total

**Done when:** you can go from product page to a created Order in the database, with a correct server-calculated total, with no payment involved yet.

## Phase 2 — Razorpay integration (Days 7-11)

- Test Mode account + API keys
- `POST /api/payments/create-order`, Razorpay Checkout wired into frontend
- `POST /api/payments/verify` with signature check
- `POST /api/payments/webhook` (raw body, signature verified) — build this in the same phase, not later
- Test: successful payment, failed payment, tampered signature rejected, webhook received via ngrok

**Done when:** a test payment moves an Order from `PENDING_PAYMENT` to `CONFIRMED`, stock decrements atomically, and the webhook independently confirms the same thing even if you block the frontend callback on purpose.

## Phase 3 — Shiprocket integration (Days 12-16)

- Shiprocket account, pickup address, dedicated API user
- `POST /api/shipments/create` triggered automatically right after payment verification
- AWB assignment + pickup generation
- Tracking webhook wired to update `Shipment.status` and `trackingEvents[]`

**Done when:** a confirmed test order automatically produces a Shiprocket shipment with a real AWB, and tracking status updates flow back into your database.

## Phase 4 — Minimal admin panel (Days 17-19)

- Single protected `/admin` login (one role check, no RBAC tiers)
- Orders list + detail view showing Order/Payment/Shipment status as three separate badges
- Manual "retry shipment creation" button for the failure case in `rules.md`
- Low-stock indicator per variant

**Done when:** you can see and act on every order from one screen without touching the database directly.

## Phase 5 — Compliance, polish & marketing wiring (Days 20-24)

- Static pages: Shipping Policy, Return Policy, Privacy Policy, Contact, About/Story (required before Meta approves ads)
- Meta Pixel installed and firing on key events (view product, add to cart, purchase)
- WhatsApp click-to-chat or Business API link
- GST-compliant invoice generation (sequential numbering via atomic counter)
- Mobile responsiveness pass, image compression pass

**Done when:** the full flow — browse → buy → get invoice → get shipped → track — works end to end on a phone, and ad infrastructure is ready.

## Phase 6 — Soft launch (Days 25-28)

- Personal network + local WhatsApp circles first, before any paid spend
- Collect first genuine reviews/UGC
- Watch for edge cases: failed webhooks, stuck orders, shipment failures — fix live issues before scaling spend

## Phase 7 — Paid push (Day 29 onward)

- Shift budget into Meta conversion campaigns once pixel has ~20-50 real purchase events
- Monitor `PENDING_PAYMENT` orders older than 30 minutes (abandoned checkouts) for follow-up

---

## Deferred to post-launch (do not build before Phase 7)

- Full Returns/Refunds self-service workflow (handle manually via WhatsApp + Razorpay dashboard refunds until volume justifies automation)
- Multi-admin RBAC / role tiers
- AuditLog collection
- Customer lifetime-value dashboards, full CRM features
- Subscriptions / repeat-order automation
- Multi-product catalogue expansion (structure supports it, but don't build UI for it yet)

Revisit this list once you're consistently processing orders — pull items forward only when a real operational pain justifies the build time.
