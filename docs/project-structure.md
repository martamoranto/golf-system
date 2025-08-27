# Golf Superapp Project Structure

```
golf-superapp/
├── apps/
│   ├── customer/                 # Public Website / Customer App (Next.js)
│   │  ├─ package.json  .env.example  next.config.ts  tailwind.config.ts
│   │  └─ src/...
│   ├── onsite-pwa/               # Onsite PWA for walk-ins & live ops (Next.js PWA)
│   │  ├─ package.json  .env.example  public/manifest.json
│   │  └─ src/...
│   ├── course-admin/             # Per-course Admin (Next.js)
│   │  └─ src/...
│   ├── platform-admin/           # Super Admin / HQ (Next.js)
│   │  └─ src/...
│   └── api/                      # Hono API gateway (REST/tRPC bridge), auth, billing
│      ├─ package.json  .env.example  tsconfig.json
│      └─ src/
│         ├─ index.ts             # createHono(), middlewares, mount /trpc
│         ├─ context.ts           # auth/tenant/db injected into tRPC ctx
│         ├─ routes/
│         │  ├─ health.ts
│         │  └─ trpc.ts
│         └─ modules/             # optional thin controllers
│            └─ bookings.controller.ts
│
├── services/
│   ├── worker/                   # Background jobs (BullMQ/Inngest), emails, payouts
│   │  ├─ package.json  tsconfig.json
│   │  └─ src/{index.ts,queues/,jobs/,schedulers/}
│   ├── webhooks/                 # PSP webhooks (PayMongo/Stripe), SMS/email callbacks
│   │  └─ src/{index.ts,paymongo.ts,stripe.ts}
│   ├── scheduler/                # Cron schedules (reports, reminders, holds cleanup)
│   │  └─ src/{index.ts,crons/}
│   └── realtime/                 # Socket.IO server for tee-sheet & range board
│      └─ src/{index.ts,channels/}
│
├── packages/
│   ├── database/                 # Prisma schema, migrations, multi-tenant helpers
│   │  └─ src/{client.ts,tx.ts,seed/} + prisma/{schema.prisma,migrations/}
│   ├── schemas/                  # Zod request/response contracts (SSOT)
│   │  └─ src/{auth.schema.ts,booking.schema.ts,...,index.ts}
│   ├── trpc/                     # Routers + server/client adapters
│   │  └─ src/{server.ts,context.ts,router/_app.ts,router/*.ts,client.ts}
│   ├── ui/                       # ShadCN kit, tokens, Tailwind preset
│   ├── config/                   # tsconfig, eslint, prettier presets
│   ├── auth/                     # NextAuth/JWT, guards, RBAC helpers
│   ├── payments/                 # PayMongo/Stripe SDK wrapper, refunds
│   ├── notifications/            # react-email templates, SMS/push senders
│   ├── i18n/                     # Dictionaries and helpers
│   ├── shared/                   # Shared types, constants, utilities
│   ├── analytics/                # Event schemas, PostHog/GA adapters
│   └── docs/                     # PRD.md, SOPs, runbooks, API contracts
│
├── infra/
│   ├── docker/                   # Dockerfiles, docker-compose for local dev
│   ├── k8s/                      # Helm/manifests per app/service
│   ├── terraform/                # Cloud infra (VPC, DB, Redis, buckets, queues)
│   ├── github-actions/           # CI/CD composite actions
│   └── scripts/                  # seed, backfill, maintenance
│
├── .github/workflows/            # CI pipelines (lint/test/build/deploy)
├── turbo.json                    # Turborepo pipeline config
├── pnpm-workspace.yaml           # Workspaces definition
├── package.json                  # Root scripts (format, typecheck, dev, build)
└── PRD.md                        # Top-level PRD
```

## Project Overview

This is a monorepo structure for a golf superapp built using:
- **Turborepo** for monorepo management
- **PNPM** for package management
- **Next.js** for frontend applications
- **Hono** for API gateway
- **tRPC** for type-safe APIs
- **Prisma** for database management

## Architecture Components

### Apps
- **customer**: Public-facing customer website and app
- **onsite-pwa**: PWA for on-site operations and walk-ins
- **course-admin**: Per-course administration interface
- **platform-admin**: Super admin/headquarters interface
- **api**: Central API gateway with authentication and billing

### Services
- **worker**: Background job processing
- **webhooks**: Payment and notification webhook handlers
- **scheduler**: Cron job scheduling
- **realtime**: Real-time communication server

### Packages
Shared packages containing reusable business logic, UI components, and utilities for the entire application ecosystem.

### Infrastructure
DevOps and deployment configuration including Docker, Kubernetes, Terraform, and CI/CD pipelines.