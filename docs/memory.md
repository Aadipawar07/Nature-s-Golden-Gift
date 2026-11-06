# Project Memory — Nature's Golden Gift

Living status doc. Update this at the end of every work session so you (or your AI coding assistant) can pick up exactly where you left off without re-explaining context. Keep entries short and factual.

**Last updated:** 2026-09-19

---

## Where these docs live
All six planning docs (`prd.md`, `architecture.md`, `rules.md`, `phases.md`, `design.md`, `memory.md`) belong in a `/docs` folder at the repo root, outside `/frontend` and `/backend` — see `architecture.md` §5.1 for the exact layout. Commit them to Git normally.

## Business setup — completed
- [x] Domain registered
- [x] Trademark registered
- [x] Stock and packaging ready
- [x] FSSAI license
- [x] Udyam registration
- [x] MSME registration
- [x] GST number (under father's name)
- [x] Product decision: turmeric powder, 3 pack sizes — confirmed as **100g / 200g / 500g** (corrected from an earlier 250g guess once real packaging photos showed 200gm printed on the actual pouch)

## Planning docs — completed
- [x] `prd.md` — requirements defined
- [x] `architecture.md` — stack + schema + API contract + full multi-page folder structure + page/route map (updated 2026-09-19)
- [x] `rules.md` — security/data rules drafted
- [x] `phases.md` — phased build plan drafted (Phase 0-7)
- [x] `design.md` — color/type/UI pattern system drafted (reflects the bracket/blueprint aesthetic — see open decision below re: which design direction is final)
- [x] Page list finalized: 8 customer pages + 5 legal/contact + 3 admin screens required for launch; full breakdown in `architecture.md` §5.3

## Design — in progress, two directions currently coexist (see open decision)
- [x] Landing page v1 (parchment/gold, original)
- [x] Landing page v2 (blueprint-grid/bracket aesthetic, adapted from a reference file)
- [x] Landing page v3 (v2 upgraded: richer premium palette — deeper ink, metallic gold gradient, jewel-tone emerald; added trust badges, 30-day freshness guarantee, live stock/dispatch signals, sticky mobile buy bar)
- [x] A separate 82-page **Master Specification PDF** was provided (`Natures-Golden-Gift-Master-Specificationpdf.pdf`), containing its own complete, more rigorous design system (light ivory field, gold restricted to ≤15% of pixels, glassmorphism, warm-tinted shadows, Fraunces/Inter typography, exact color tokens) plus a full 25-document spec (DB schema, API contract, RBAC, webhooks, CRM, etc.) that matches and extends what's in these six docs
- [x] Built one homepage strictly to the Master Spec's tokens (`natures-golden-gift-spec-homepage.html`) as a separate exercise — deliberately omits testimonials/certifications per the spec's own "don't render a claim you can't back yet" rule

## ⚠️ Open decision — needs resolving before frontend build starts
Two design directions exist and haven't been reconciled:
1. **Bracket/blueprint/mono aesthetic** (v1→v2→v3, most recently refined) — bolder, more saturated gold, thick borders, marquee ticker
2. **Master Spec aesthetic** (ivory/restrained-gold, glassmorphism, cinematic 3D via React Three Fiber) — lighter, more corporate-premium, comes with its own 82-page technical spec covering the whole backend too

`design.md` currently documents direction #1. Before Copilot/the coding assistant starts building real components, decide which direction is canonical — or explicitly merge them — and update `design.md` accordingly so it doesn't contradict what actually gets built.

## Development — not started (scaffolding prompt ready, not yet run)
- [ ] **Next immediate step:** a GitHub Copilot prompt was prepared to scaffold the folder/file structure only (no logic) — matches `architecture.md` §5. Not yet executed.
- [ ] Once scaffolded: paste in the chosen HTML mockup (from the open decision above) to convert into actual Navbar.jsx/Home.jsx/etc. components
- [ ] Phase 0: Backend scaffold, MongoDB connection, models, JWT auth, frontend scaffold + deploy pipeline
- [ ] Phase 1: Product/cart/checkout logic (no payment)
- [ ] Phase 2: Razorpay integration (create-order, verify, webhook)
- [ ] Phase 3: Shiprocket integration (order create, AWB, tracking webhook)
- [ ] Phase 4: Minimal admin panel
- [ ] Phase 5: Compliance pages, Meta Pixel, WhatsApp, invoicing
- [ ] Phase 6: Soft launch
- [ ] Phase 7: Paid ad push

## Known open decisions (not yet locked in)
- **Which design direction is canonical** (see flagged section above) — the most pressing open item
- Final pricing per pack size (placeholders used in mockups: ₹149 / ₹329 / ₹599 in the bracket-aesthetic version; ₹149 / ₹269 / ₹599 in the Master Spec version)
- Real product photography beyond the 3 current pack renders (may need lifestyle/usage shots later)
- Auth approach confirmed as JWT + bcrypt (Firebase Auth considered, not required for v1) — note the Master Spec PDF assumes Firebase Auth instead; reconcile if that spec is adopted
- Packaging label text has typos across current mockups ("Anti-Inflaminestay," "Cegnitise Support," etc.) — flagged, not yet corrected with packaging designer
- Navbar finalized as: Home · Shop · About · Contact · Cart (About folds in "Our Story"; Sourcing is a secondary page, not in the nav)

## Currently being worked on
*(Update this section every session — delete the placeholder once real work starts)*
- Nothing yet — planning and design-exploration phase. Next session should either resolve the design-direction decision above, or go straight to running the Copilot scaffolding prompt if the bracket-aesthetic v3 is chosen as final.

## Session log
*(Add one line per session, most recent on top)*
- **2026-09-19** — Read the 82-page Master Specification PDF; built a homepage strictly to its design tokens. Upgraded landing page v2→v3 with premium colors and conversion elements (guarantee, stock signals, sticky buy bar). Finalized the required page/route list. Wrote a GitHub Copilot prompt to scaffold folder structure only (not yet run). Updated `architecture.md` with the full multi-page folder structure and page map; flagged the two-design-direction conflict for resolution.
- **2026-09-06** — Drafted all six planning docs (prd/architecture/rules/phases/design/memory). No code written yet.
