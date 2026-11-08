# Design System — Nature's Golden Gift

The storefront uses a light ivory foundation, restrained gold accents, dark ink
typography, Fraunces headings, and Inter body/UI text. Raw values live in
`apps/storefront/src/styles/tokens.css`; Tailwind references those variables.

## Tokens

The token file defines the gold, cream, ink, leaf, semantic status, gradients,
warm shadows, radii, motion, container, and z-index scales from the approved
Phase 01 design direction. Gold is reserved for CTAs, prices, and small
accents. The old blueprint grids, brackets, marquees, orb art, and mono font
have been removed.

Fonts are self-hosted through `@fontsource-variable/fraunces` and
`@fontsource-variable/inter`.

## UI primitives

Product imagery always goes through `ProductImage` and falls back to the neutral
`ImagePlaceholder`. The storefront component system includes the planned
Button, Input, Select, Badge, Modal, Drawer, Toast, Skeleton, Tabs, Accordion,
Breadcrumb, Pagination, QuantitySelector, and PriceDisplay primitives as they
are implemented. Interactive controls must retain visible focus, keyboard
operation, and reduced-motion behavior.

## Motion and content

Motion uses the shared easing and duration tokens and honors
`prefers-reduced-motion`. Owner-supplied facts are centralized in
`src/config/site.js`; absent values are not rendered as invented copy.
