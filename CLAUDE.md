# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Next dev server on http://localhost:3000
npm run build         # Production build
npm run start         # Serve the production build
npm run lint          # next lint (next + jsx-a11y)
npm run typecheck     # tsc --noEmit (strict)
npm run format        # prettier --write src/**
npm run format:check  # prettier --check src/**
```

There is no test suite. `npm run typecheck` and `npm run lint` are the only correctness gates. Husky runs `lint-staged` (eslint --fix + prettier) on `pre-commit`.

## Environment

Copy `.env.example` to `.env.local`. Env vars are validated by Zod in [src/lib/env.ts](src/lib/env.ts) at import time — an invalid env crashes the process on startup.

- `GEMINI_API_KEY` — optional. When absent, `/api/gemini/advisor` returns `FALLBACK_ADVISOR_REPLY` instead of failing.
- `LEADS_ADMIN_TOKEN` — optional. When absent, `/api/leads` returns 503 (it never falls back to unauthenticated access).
- `NEXT_PUBLIC_APP_URL` — used by `metadataBase` in the root layout.

## Architecture

**Framework**: Next.js 15 App Router, React 19, TypeScript strict with `noUncheckedIndexedAccess` and `noImplicitReturns`. Path alias `@/*` → `./src/*`. Tailwind v4 via `@tailwindcss/postcss`.

**Directory roles** (do not mix):
- `src/app/` — routes, layouts, and API route handlers. Pages are Server Components by default.
- `src/features/<area>/` — page-bound feature code (the big interactive sections rendered by `src/app/<area>/page.tsx`). These are typically `"use client"` and contain the wizard/dashboard logic.
- `src/components/layouts/` and `src/components/ui/` — cross-feature shared components (Navbar, Footer, AdvisorChat, etc.).
- `src/lib/` — server-side primitives (`env`, `gemini-client`, `leads-repo`, `rate-limit`). Importing these in client components will pull Node APIs into the bundle — keep them on the server side.
- `src/data/mock-data.ts` — static catalog content (services, case studies, blog posts) imported by features.
- `src/types/index.ts` — single shared domain-type module (`Service`, `CaseStudy`, `BlogPost`, `LeadRecord`, etc.).

**API routes** (`src/app/api/*/route.ts`) follow a uniform pattern that should be preserved when adding new endpoints:
1. `export const runtime = "nodejs"` (the leads repo uses `node:fs`).
2. Per-IP rate limit via `rateLimit(key, { limit, windowMs })` returning 429 with `Retry-After` on exhaustion.
3. `req.json()` wrapped in try/catch → 400 on invalid JSON.
4. Zod `safeParse` of the body → 400 with `flatten().fieldErrors` on failure.
5. Business logic, with errors logged and surfaced as Spanish-language messages (all user-facing strings in this repo are Spanish).

**Stateful subsystems — both are single-process only**:
- [src/lib/leads-repo.ts](src/lib/leads-repo.ts) persists leads to `data/leads.json` and serializes writes with a per-process promise-chain mutex. Multi-instance deployments must swap this for a real DB.
- [src/lib/rate-limit.ts](src/lib/rate-limit.ts) is an in-memory fixed-window limiter. Multi-instance deployments must swap for Redis/Upstash.

**Anti-spam contract** ([src/app/api/contact/route.ts](src/app/api/contact/route.ts)): the `hpField` honeypot. If present (any length > 0), respond with HTTP 200 `{ success: true, leadId: null }` — never 400 — so bots get no signal that they were detected. Do not change this to an error response.

**Gemini integration** ([src/lib/gemini-client.ts](src/lib/gemini-client.ts)): uses `@google/genai` with the real `gemini-2.0-flash` model. The string `gemini-3.5-flash` does not exist as a model id — do not "fix" the name to it. The client is cached per-process and returns `null` when no API key is set, which the advisor route handles via `FALLBACK_ADVISOR_REPLY` rather than erroring.

**Security headers** are configured globally in [next.config.mjs](next.config.mjs) (`X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, restrictive `Permissions-Policy`). `poweredByHeader` is off. Remote images are restricted to `images.unsplash.com` and `www.transparenttextures.com` — add new hosts to `remotePatterns` before using them with `next/image`.
