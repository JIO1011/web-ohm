# OhmRoyal — Next.js 15

Sitio corporativo de OhmRoyal migrado de Vite+React+Express a **Next.js 15 (App Router)** con TypeScript strict, Tailwind v4, Server Components y validación Zod en los Route Handlers.

## Prerrequisitos

- Node.js ≥ 20
- npm / pnpm / yarn

## Setup

```bash
cp .env.example .env.local
# edita GEMINI_API_KEY y LEADS_ADMIN_TOKEN
npm install
npm run dev
```

App en [http://localhost:3000](http://localhost:3000).

## Scripts

| comando | qué hace |
| --- | --- |
| `npm run dev` | servidor de desarrollo |
| `npm run build` | build de producción |
| `npm run start` | sirve el build |
| `npm run lint` | ESLint (next + jsx-a11y) |
| `npm run typecheck` | TypeScript en modo strict |
| `npm run format` | Prettier escribe |
| `npm run format:check` | Prettier verifica |

## Rutas

- `/` — Home
- `/servicios` — catálogo de servicios + dashboard interactivo
- `/trabajo` — casos de estudio + telemetría
- `/nosotros` — equipo y certificaciones
- `/blog` — listado
- `/blog/[slug]` — artículo individual (SSR)
- `/calcular-proyecto` — wizard (Diseñar → Agendar → Enviar)

## API

- `POST /api/contact` — registra un lead (Zod-validado, rate-limit, honeypot anti-bot)
- `GET /api/leads` — **protegido** con `Authorization: Bearer $LEADS_ADMIN_TOKEN`
- `POST /api/gemini/advisor` — chat con Crysta (rate-limit por IP)
- `GET /api/health` — health check

## Mejoras aplicadas vs. el repo original

1. **Sin código fósil**: `app/applet/` y scripts de migración descartados.
2. **Modelo Gemini real** (`gemini-2.0-flash`) en lugar del inexistente `gemini-3.5-flash`.
3. **TypeScript strict** + `noUncheckedIndexedAccess` + `noImplicitReturns`.
4. **Tipos explícitos** en helpers (sin `any`).
5. **Wizard del Contact**: el textarea del pliego ya no se sobrescribe al cambiar opciones. El usuario decide cuándo regenerar la plantilla.
6. **Honeypot anti-spam** en lugar de "5+3".
7. `/api/leads` protegida por header secreto.
8. **Rate-limit** en API routes + Zod en cada body + cabeceras de seguridad en `next.config`.
9. Clases Tailwind inválidas (`brand-555`, `slate-705`, etc.) normalizadas a la paleta real.
10. ESLint + Prettier + lint-staged + Husky.

## Estructura

```
src/
  app/                routes + layouts + api
  components/
    layouts/          Navbar, Footer
    ui/               AdvisorChat, InfiniteMarquee
  features/
    home/ services/ work/ about/ blog/ contact/
  lib/                gemini-client, leads-repo, rate-limit
  data/               contenidos estáticos
  types/              dominio (Service, CaseStudy, BlogPost, ...)
```
