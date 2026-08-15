# Design brief — TaskLoop (working name)

Paste everything below into a fresh Claude conversation (or any AI design tool) to get visual design direction, mockups, or a second opinion on the system implemented in this repo.

---

## The product

A small practice/learning project that copies the *core loop* of a task marketplace — think Airtasker, but not a clone, and not a real product. No production concerns (payments, reviews, moderation, notifications, compliance) — just enough to demonstrate the flow end-to-end and be pleasant to use.

**Core loop:** Post a task → get offers → pick one → mark it done.

**Users:** A single account type that can act as both requester (posts tasks, accepts offers) and provider (browses tasks, submits offers). No admin/roles system.

## Tone & audience

Built for one person learning full-stack dev (Next.js + Supabase), used casually by them and maybe a couple of friends testing it. The design should feel like a **real, confident small product** — not a bootcamp exercise — while staying simple enough to hand-build without a component library. Friendly, clean, a little warm. Not corporate-SaaS-blue, not neon-startup.

## Suggested identity

- **Name:** TaskLoop (references the "loop" of post → offer → accept → complete). Easy to swap.
- **Palette:** warm neutral base (stone/zinc) + a single confident accent (indigo/violet) for primary actions and links; amber for "in progress/assigned," emerald for "completed," so status is scannable at a glance without reading the label.
- **Type:** Geist Sans (already bundled via `next/font`) — clean, modern, geometric-humanist. No need to add another typeface.

## Pages to design

1. **Home / Browse** (`/`) — list of open tasks. Doubles as the "home page"; no separate marketing landing page needed.
2. **Sign in** (`/login`)
3. **Sign up** (`/signup`)
4. **Dashboard** (`/dashboard`) — three sections: tasks you posted, tasks assigned to you, tasks you've offered on.
5. **Post a task** (`/tasks/new`) — title, description, budget.
6. **Task detail** (`/tasks/[id]`) — task info, status, list of offers, offer form (if eligible), accept/complete actions.
7. Shared **nav/header** across all pages.

## Data / status vocabulary (drives badges & copy)

- Task status: `open → assigned → completed`
- Offer status: `active` / accepted / not selected

## What NOT to design

Payments, reviews/ratings, messaging, notifications, admin tools, categories, maps/location, photo attachments, realtime updates, multi-step onboarding. Keep every page to what's needed to demonstrate the core loop.

## Constraints for whoever implements it

- Next.js 16 App Router, React 19, Tailwind CSS 4, Supabase (Auth + Postgres).
- Server Actions for all mutations (already wired up) — this brief is about visual/UI design, not data flow.
- Should hold together as a small, coherent design system (consistent buttons, inputs, cards, badges) rather than one-off styling per page.
