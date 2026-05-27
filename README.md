# Alankritha UI (Phase 1)

Premium luxury jewellery catalog frontend built with Next.js App Router, React, TypeScript, and Tailwind CSS.

## Scope

This implementation is **frontend only**:
- Product browsing
- Category listing and filters
- Product details
- WhatsApp enquiry CTAs

Not included:
- Backend APIs
- Auth
- Cart / checkout / payments
- Order management

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

## Project Structure

- app/ - routes and route-level loading states
- components/ - reusable UI components
- data/ - mock JSON data
- lib/ - pure utilities and data helpers
- styles/ - design tokens and motion utilities
- types/ - TypeScript domain contracts

## Routes

- / - Home page
- /category/[slug] - Product listing page
- /product/[slug] - Product details page
- /about
- /contact
- /lookbook

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Notes

- Mock JSON data powers all sections in Phase 1.
- WhatsApp message links are generated from product details.
- UI is mobile-first with a sticky mobile WhatsApp button and touch-friendly interactions.
