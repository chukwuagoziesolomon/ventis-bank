# MidwesternBank — a fully animated digital banking UI (Next.js)

A complete, mobile-responsive banking web app built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

## What's included

- **Landing page** — animated hero, feature grid, CTA
- **Sign up** — multi-step animated flow (details → password → success)
- **Log in** — with show/hide password
- **Dashboard overview** — animated balance counters, weekly spend chart, recent activity
- **Send money** — form → review → sending → success, fully animated
- **Receive money** — account details, scannable QR code, copy-to-clipboard, native share
- **Transactions** — searchable, filterable history
- **Cards** — create virtual/physical cards, freeze/unfreeze, spend progress, delete
- **Settings** — profile, security (2FA toggle), notification preferences
- Fully responsive sidebar/topbar shell with a mobile drawer menu

This runs entirely on the frontend with realistic **mock data** stored in `localStorage`, so you can click through every flow (login, sending money, creating cards) without a backend. Login/signup accept any input — there's no real authentication server.

## Getting started

You'll need [Node.js](https://nodejs.org) 18.18+ installed.

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev

# 3. Open the app
# http://localhost:3000
```

To try the demo flow immediately, click **Get started** or **Log in** — any name/email/password will work, since this is a frontend-only demo.

## Project structure

```
app/
  page.tsx                 → landing page
  login/page.tsx
  signup/page.tsx
  dashboard/
    layout.tsx              → auth guard + shell
    page.tsx                → overview
    send/page.tsx
    receive/page.tsx
    transactions/page.tsx
    cards/page.tsx
    settings/page.tsx
components/                 → shared UI (BankCard, Sidebar/shell, Modal, charts, etc.)
lib/
  store.tsx                 → app state (mock auth, accounts, cards, transactions)
  mock-data.ts               → seed data
  types.ts
  utils.ts
```

## Connecting a real backend

Everything that touches data lives in `lib/store.tsx`. To wire this up to a real API:

1. Replace the `login`/`signup` functions with real calls to your auth provider (e.g. NextAuth, Clerk, or your own API), and store a session token instead of a mock user.
2. Replace `sendMoney`, `createCard`, `toggleFreezeCard`, and `deleteCard` with API calls to your banking backend, and update state from the response instead of computing it locally.
3. Remove the `localStorage` persistence in `StoreProvider` once your backend is the source of truth.

## Customizing the design

Colors, fonts, and radii are defined as design tokens in `tailwind.config.ts` (see `colors.ink`, `colors.gold`, `colors.teal`) and `app/layout.tsx` (fonts: Fraunces for display, Inter for body, IBM Plex Mono for figures).

## Notes

- The QR code on the Receive page is generated via a public QR image API at render time and requires an internet connection in the browser.
- This is a design/demo build, not a production banking system — before handling real money or personal data you'd need real authentication, encryption, compliance (PCI-DSS, KYC/AML), and a licensed banking backend.
