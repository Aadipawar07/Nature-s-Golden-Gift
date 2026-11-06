# Design System — Nature's Golden Gift

Based on the approved landing page direction (blueprint-grid, bracket-corner, mono-label aesthetic adapted from the reference file).

## 1. Color palette

| Token | Hex | Use |
|---|---|---|
| `beige` | `#F5EAD6` | Primary background (warm parchment) |
| `beigeCard` | `#EEE0C4` | Card backgrounds, slightly deeper than page bg |
| `beigeDeep` | `#E4CE9E` | Borders, dividers, subtle fills |
| `ink` | `#241708` | Primary text, dark section backgrounds |
| `inkSoft` | `#5C4A2E` | Secondary/body text |
| `turmeric` | `#E1A22B` | Primary brand accent — CTAs, highlights |
| `turmericDeep` | `#B8791A` | Hover states, emphasis text, gradient end |
| `turmericLight` | `#F0C36A` | Accents on dark backgrounds |
| `rust` | `#B65B2A` | Secondary accent — root/turmeric-cross-section tone |
| `forest` | `#3F5A3D` | Organic/certification-related accents (checkmarks, "verified" tags) |
| `line` | `#D9C39A` | Hairline borders |

**Usage rule:** `turmeric`/`turmericDeep` carries primary CTAs and brand emphasis. `forest` is reserved specifically for organic/trust/certification signals — don't dilute it by using it decoratively elsewhere. `rust` is the secondary accent for contrast (badges, "most loved" tags, gradient CTAs).

## 2. Typography

| Role | Font | Weight/style notes |
|---|---|---|
| Display / headings | **Fraunces** (serif, variable) | 450-600 weight for headings; italic for emphasis words within a headline (e.g. "from *within*") |
| Body / UI text | **Inter** | 400-600 weight; used for paragraphs, nav, buttons |
| Labels / data / mono accents | **IBM Plex Mono** | Uppercase, letter-spaced (`tracking-widest`) for eyebrows, badges, price tags, section labels |

**Google Fonts import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**Type scale (approx, desktop):**
- Hero H1: ~3.2rem, line-height 1.05
- Section H2: ~2.25rem
- Card H3: ~1.125-1.25rem
- Body: 1rem, line-height 1.6
- Mono labels: 0.7-0.75rem, uppercase, tracked out

## 3. Signature UI patterns

These are what make the site feel like *this* brand rather than a generic template — reuse them consistently across new pages.

- **Blueprint grid background** (`grid-bg-fine`): a faint 22px or 44px linear-gradient grid over the beige background. Applied to the whole page or dark sections for texture.
- **Bracket corners** (`.bracket`): corner brackets that fade in on hover on cards — signals "this is interactive/precise," used on every card (product, feature, testimonial, comparison).
- **Blob glows** (`.blob`): large blurred circular color washes (turmeric/rust) behind hero content, low opacity, for depth without clutter.
- **Marquee ticker**: dark full-width scrolling strip of mono, uppercase facts — used once per major page, near the top, for quick trust/fact signaling.
- **Mono uppercase eyebrows**: small tracked-out mono labels above section headings (e.g. "FROM ROOT TO JAR") — always mono, always uppercase, always paired with a serif H2 below it.
- **Card hover lift**: cards lift (`translateY(-8px)`) and rotate very slightly (`-0.3deg`) on hover, with a soft shadow — applied uniformly to product/feature/testimonial cards.
- **3D tilt on hero product**: the hero product image tilts in perspective following cursor position — reserved for the hero "stage," not overused elsewhere.
- **Stamp badge**: a slightly rotated, bordered pill badge (e.g. "100% ORGANIC · FSSAI LICENSED") — used sparingly, once per page near the top.

## 4. Component conventions

| Component | Style notes |
|---|---|
| Primary button | Gradient `turmeric → turmericDeep`, full-round (`rounded-full`), lifts on hover |
| Ghost button | Transparent, `border-2 border-ink/20`, inverts to solid ink on hover |
| Card | `beige`/`beigeCard` background, `border-2 border-ink/10`, `rounded-3xl`, bracket-corner hover |
| Badge/tag | Mono, uppercase, small, pill-shaped, low-opacity tinted background matching its semantic color (`forest` for organic, `turmericDeep` for "most loved") |
| Dark section | `bg-ink text-beige`, grid-bg overlay, used for "how it works" / process-style sequences and the problem-vs-solution contrast block |

## 5. Motion principles
- Reserve scroll-triggered reveal animation for content that is a genuine sequence (the sourcing process steps) — don't fade up every section, it reads as templated.
- Hover-based motion (tilt, lift, bracket-fade) is fine everywhere since it's user-initiated, not automatic.
- Respect `prefers-reduced-motion`: disable animations/transitions for users who request it.

## 6. Imagery
- Use real product photography (the pouch photos) wherever a product is shown — never placeholder/stock turmeric images once real photography exists.
- Compress all product images before embedding (target well under 100KB each at display size) to keep mobile load fast for ad traffic.
