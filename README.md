<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Geist+Mono&weight=600&size=32&duration=3000&pause=800&color=C4866C&center=true&vCenter=true&width=600&lines=Intimera+%F0%9F%8C%BF;Private+Wellness+Sanctuary;AI-Powered+Couples+Platform" alt="Intimera" />

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Geist+Mono&size=16&duration=2000&pause=1000&color=A8A29E&center=true&vCenter=true&width=500&lines=Learn.+Practice.+Grow+Together." alt="tagline" />

<br/><br/>

[![CI](https://img.shields.io/github/actions/workflow/status/your-org/intimera/ci.yml?branch=main&style=for-the-badge&logo=github&logoColor=white&label=CI&color=1a1a2e)](https://github.com/your-org/intimera/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-c4866c?style=for-the-badge)](LICENSE)

<br/>

[![Live Demo](https://img.shields.io/badge/%F0%9F%8C%BF_Visit_Intimera-intimera.app-c4866c?style=for-the-badge)](https://intimera.app)

</div>

---

## 👋 About

```yaml
name: Intimera
tagline: A science-backed, AI-enhanced intimate wellness platform for couples
mission: Help couples learn, practice, and grow together in a safe, private space

features:
  - 🤖  AI Wellness Advisor  — empathetic RAG-powered chat, streamed responses
  - 📚  Content Library      — expert-curated articles with progress tracking
  - 🧘  Guided Exercises     — interactive couples exercises with step wizards
  - 💬  Community Forum      — anonymous, topic-based peer support
  - 💑  Couple Space         — shared notes, check-ins, connection health charts
  - 🔒  Privacy-First        — AES-256-GCM encryption on all sensitive data
  - 🌍  Multilingual         — en, ar (RTL), es, fr

compliance:
  - GDPR Article 20 (data portability export)
  - CCPA (right to deletion with cascade)
  - WCAG 2.2 AA accessibility
```

---

## 🧰 Tech Stack

<div align="center">

### Core

[![Next.js](https://img.shields.io/badge/Next.js_16-App_Router-000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)

### Database & Auth

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-Sessions-7c3aed?style=flat-square)](https://better-auth.com/)

### AI & Payments

[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=flat-square&logo=openai&logoColor=white)](https://openai.com/)
[![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI-Streaming-000?style=flat-square&logo=vercel)](https://sdk.vercel.ai/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-008CDD?style=flat-square&logo=stripe&logoColor=white)](https://stripe.com/)

### Styling & UI

[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Components-18181b?style=flat-square)](https://ui.shadcn.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-ff0055?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)

### DevOps & Quality

[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?style=flat-square&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![Vitest](https://img.shields.io/badge/Vitest-Testing-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-45ba4b?style=flat-square&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Biome](https://img.shields.io/badge/Biome-Lint%2FFormat-60a5fa?style=flat-square)](https://biomejs.dev/)

</div>

---

## 🚀 Getting Started

### Prerequisites

```bash
node >= 22
postgresql (or Neon account)
stripe account
openai api key
```

### Installation

```bash
# 1. Clone
git clone https://github.com/your-org/intimera.git && cd intimera

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Fill in your values (see Environment Variables section below)

# 4. Push database schema
npm run db:push

# 5. Seed initial data
npm run db:seed

# 6. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) ✨

---

## 🔐 Environment Variables

```env
# ── Database (Neon) ──────────────────────────────────────────
DATABASE_URL="postgresql://user:pass@host/neondb?sslmode=require"
DIRECT_URL="postgresql://user:pass@host/neondb?sslmode=require"

# ── Authentication ────────────────────────────────────────────
BETTER_AUTH_SECRET="generate-a-32-char-secret"
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# ── Encryption (AES-256-GCM) ──────────────────────────────────
# Generate: openssl rand -hex 32
ENCRYPTION_KEY="your-64-char-hex-key"

# ── AI ────────────────────────────────────────────────────────
OPENAI_API_KEY="sk-..."

# ── Stripe ────────────────────────────────────────────────────
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PREMIUM_MONTHLY_PRICE_ID="price_..."
STRIPE_PREMIUM_YEARLY_PRICE_ID="price_..."
STRIPE_COUPLES_MONTHLY_PRICE_ID="price_..."
STRIPE_COUPLES_YEARLY_PRICE_ID="price_..."

# ── Email (Resend) ────────────────────────────────────────────
RESEND_API_KEY=""

# ── Analytics (PostHog) ───────────────────────────────────────
NEXT_PUBLIC_POSTHOG_KEY=""
NEXT_PUBLIC_POSTHOG_HOST="https://eu.i.posthog.com"

# ── App ───────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL="https://intimera.app"
```

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run analyze` | Bundle analysis (`ANALYZE=true`) |
| `npm run typecheck` | TypeScript strict check |
| `npm run lint` | Biome lint |
| `npm run test` | Unit tests (Vitest) |
| `npm run test:coverage` | Unit tests with coverage report |
| `npm run test:e2e` | E2E tests (Playwright) |
| `npm run ci` | Typecheck + unit tests (CI shortcut) |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:seed` | Seed database with initial data |

---

## 🗂️ Project Structure

```
intimera/
├── .github/
│   └── workflows/
│       ├── ci.yml          # Lint → Typecheck → Vitest → Playwright
│       └── deploy.yml      # Vercel production deploy on main push
│
├── messages/               # i18n translation files
│   ├── en.json             # English (default, no URL prefix)
│   ├── ar.json             # Arabic — RTL layout
│   ├── es.json             # Spanish
│   └── fr.json             # French
│
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Prisma migration history
│   └── seed.ts             # Database seeder
│
└── src/
    ├── app/
    │   ├── (app)/          # Authenticated app routes
    │   ├── (auth)/         # Login / Register / Forgot password
    │   ├── (admin)/        # Admin panel (ADMIN role only)
    │   ├── (marketing)/    # Public landing & pricing pages
    │   └── api/            # API routes (chat, og, webhooks, data)
    ├── actions/            # Next.js Server Actions
    ├── components/         # React components
    ├── i18n/               # next-intl routing & config
    └── lib/
        ├── auth.ts         # Better Auth config
        ├── db.ts           # Prisma client
        ├── dal/            # Data Access Layer (cached queries)
        ├── seo/            # JSON-LD helpers
        ├── types/          # Client-safe type aliases
        └── utils/          # rate-limit, crypto, cn helpers
```

---

## 🔒 Security

```yaml
encryption:
  algorithm: AES-256-GCM
  fields: [AI messages, couple notes, check-in notes]
  key_rotation: manual (env var rotation)

security_headers:
  - Content-Security-Policy: strict; no inline scripts
  - Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy: camera=(), microphone=(), geolocation=()

rate_limiting:
  auth_endpoints: 5 req / 15 min (brute-force protection)
  ai_advisor_free: 5 req / day
  ai_advisor_premium: 500 req / day
  community_posts: 10 posts / hour

xss_protection:
  - DOMPurify sanitization on all user-generated HTML
  - Tiptap output allowlisted (no script/iframe tags)
```

---

## 🌍 Internationalization

| Locale | Language | Direction | URL |
|--------|----------|-----------|-----|
| `en` | English | LTR | `/dashboard` |
| `ar` | Arabic | **RTL** | `/ar/dashboard` |
| `es` | Español | LTR | `/es/dashboard` |
| `fr` | Français | LTR | `/fr/dashboard` |

Powered by [`next-intl`](https://next-intl-docs.vercel.app/) with `localePrefix: "as-needed"`.

---

## 🛡️ Admin Panel

Access: `/admin/*` — requires `Role.ADMIN` (enforced server-side)

| Route | Features |
|---|---|
| `/admin/analytics` | MAU, conversions, AI sessions, popular content |
| `/admin/content` | Publish / unpublish / delete library articles |
| `/admin/users` | Role management, Stripe customer links |
| `/admin/moderation` | Approve / reject flagged community posts |

---

## 📊 GitHub Stats

<div align="center">

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=your-username&show_icons=true&theme=dark&bg_color=0a0a0a&title_color=c4866c&icon_color=c4866c&text_color=a8a29e&border_color=292524&hide_border=false)

![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=your-username&layout=compact&theme=dark&bg_color=0a0a0a&title_color=c4866c&text_color=a8a29e&border_color=292524)

</div>

---

## 🤝 Contributing

```bash
# 1. Fork the repo
# 2. Create your feature branch
git checkout -b feat/your-feature

# 3. Make changes, then run quality checks
npm run ci

# 4. Commit using conventional commits
git commit -m "feat: add your feature"

# 5. Push and open a PR
git push origin feat/your-feature
```

All PRs must pass the full CI pipeline (lint → typecheck → Vitest → Playwright) before merge.

---

## 📄 License

MIT © [Intimera](https://intimera.app)

---

<div align="center">

*Built with ❤️ for couples who want to grow together*

</div>
