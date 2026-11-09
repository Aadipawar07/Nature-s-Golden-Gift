# Rules — Nature's Golden Gift

Things to always do, and things to never do, while building this project. Read this before starting any new phase.

## 1. Security — never negotiable

- **Never trust price, quantity, or "payment successful" claims from the frontend.** Always recompute the order total server-side from the Product collection. A request can be edited in DevTools — your database is the only source of truth.
- **Razorpay Key Secret and Webhook Secret live only in backend `.env`.** Never in React code, never in Git, never in a client-side network request. If it ends up in the frontend JS bundle, anyone can read it via DevTools → Sources.
- **Shiprocket email/password/JWT token live only in the backend.** Treat them exactly like a bank login.
- **Verify the Razorpay signature (HMAC-SHA256) before marking any order confirmed.** A frontend "success" callback can be faked.
- **Verify webhook signatures too** — don't assume a POST to your webhook URL is really from Razorpay/Shiprocket just because the URL is right.
- **Check idempotency** — before processing a payment verification or webhook, check if that `razorpay_payment_id` was already processed. Network retries or double-clicks must never double-decrement stock or send duplicate confirmations.
- **Every admin API route checks the user's role on the backend**, independent of whether the frontend hides the admin menu. A hidden button is not security.
- **Never commit `.env` files.** Add to `.gitignore` from the very first commit.

## 2. Data integrity

- **Order, Payment, and Shipment each get an independent status field.** Never collapse them into one shared enum — see `architecture.md` for why.
- **Snapshot the address onto the Order at checkout time.** Never store a live pointer to `User.addresses` — if the customer edits/deletes that address later, old orders and shipping labels must not change retroactively.
- **Stock decrements must be atomic** (`Product.updateOne({ stock: { $gte: qty } }, { $inc: { stock: -qty } })`), never a separate read-then-write. Prevents overselling when two customers buy the last pack simultaneously.
- **Only decrement stock after payment is verified**, never at "add to cart" or "checkout initiated."
- **Wrap the stock update and order/payment status update in one MongoDB transaction** so they succeed or fail together.

## 3. Order-of-operations rules

- Order always starts at `PENDING_PAYMENT`. Never create an order as `CONFIRMED` before payment is verified.
- If Shiprocket shipment creation fails after payment succeeded: **do not lose the order or the money.** Mark Order `CONFIRMED`, Shipment `FAILED`, and surface it in the admin panel for manual retry. Never auto-refund just because shipping failed.
- If payment fails or the customer abandons the Razorpay popup: order stays `PENDING_PAYMENT`, nothing is deducted from stock, nothing is shipped.

## 4. What to avoid entirely

- Do not put any secret key, password, or token in frontend code, even "temporarily for testing."
- Do not build a full RBAC/multi-admin system for a solo operator — a single `role: ADMIN` check is enough for v1 (see `phases.md`).
- Do not build the full Returns/Refunds workflow before launch — handle the first returns manually and automate once volume justifies it.
- Do not use `express.json()` globally in a way that intercepts the webhook route before `express.raw()` can read the raw body — signature verification will silently always fail.
- Do not reuse Razorpay test keys in production, or vice versa.
- Do not skip the webhook in favor of "just the frontend callback" — you will silently lose orders whenever a customer's browser doesn't make it back to your site after paying.
- Do not add product weight/dimensions as an afterthought — Shiprocket needs accurate weight per variant to quote courier rates correctly; missing this breaks shipment creation.

## 5. Coding conventions

- One Mongoose model per file, matching the schema in `architecture.md`.
- Keep external API calls (Razorpay, Shiprocket) inside `/services`, never inline in route handlers — makes it easier to mock/test and to swap providers later if needed.
- Every backend route that mutates data validates that the resource belongs to the requesting user (or that the requester is an admin) before acting on it.
- Log raw incoming webhook payloads to their own collection before processing, so a bad event can always be replayed/debugged.

## 6. Marketing/compliance reminders (not code, but easy to forget)

- Meta Pixel must be installed and firing correctly before any ad spend begins.
- "100% Organic" as marketing language is fine; if the pack ever claims certified organic status, that requires actual NPOP/India Organic certification — don't let copy get ahead of paperwork.
- GST-compliant invoices need sequential numbering with no gaps — use an atomic counter collection, not `Order.count()`.
