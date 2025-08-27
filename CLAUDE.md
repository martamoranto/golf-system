# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Final Golf SaaS is a comprehensive B2B SaaS platform for golf courses featuring booking management, point of sale, resource management, and community marketplace. Built as a monorepo using PNPM workspaces with Turborepo orchestration.

## Common Development Commands

### Development Workflow

```bash
# Start all applications in development mode
pnpm dev

# Start specific applications
pnpm dev:web          # Customer web app
pnpm dev:admin        # Course admin dashboard
pnpm dev:api          # API Gateway

# Start by category
pnpm dev:packages     # All shared packages
pnpm dev:services     # Background services
```

### Building & Testing

```bash
# Build entire project
pnpm build

# Build by category
pnpm build:packages   # Shared packages first
pnpm build:apps       # Main applications
pnpm build:services   # Background services

# Production build sequence
pnpm build:production

# Testing
pnpm test             # All tests
pnpm test:packages    # Package tests only
pnpm test:e2e         # End-to-end tests
pnpm test:coverage    # With coverage reports
```

### Code Quality

```bash
# Linting
pnpm lint             # All code
pnpm lint:fix         # Auto-fix issues
pnpm lint:packages    # Packages only

# Type checking
pnpm type-check       # All TypeScript
pnpm type-check:apps  # Applications only

# Formatting
pnpm format           # Format all files
pnpm format:check     # Check formatting
```

### Database Operations

```bash
# Setup database from scratch
pnpm db:setup         # Generate + migrate + seed

# Individual operations
pnpm db:generate      # Generate Prisma client
pnpm db:migrate:dev   # Run dev migrations
pnpm db:seed          # Populate sample data
pnpm db:studio        # Open Prisma Studio
pnpm db:refresh       # Reset + seed
```

### Docker Services

```bash
# Local development services (PostgreSQL, Redis, etc.)
pnpm services:up      # Start all services
pnpm services:down    # Stop all services
pnpm services:status  # Check service status
```

### Workspace Management

```bash
# Clean operations
pnpm clean            # Clean build artifacts
pnpm clean:all        # Full clean including node_modules
pnpm reset            # Clean + reinstall
pnpm reset:hard       # Full reset including lock file

# Health checks
pnpm doctor           # Full validation
pnpm check:health     # Workspace health
```

## Architecture & Structure

### Monorepo Layout

- **apps/**: Main applications (web, api, admin dashboards, PWA)
- **packages/**: Shared code (database, schemas, services, UI components, auth)
- **services/**: Background services (worker, webhooks, scheduler, realtime)
- **docs/**: Project documentation and specifications

### Key Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Hono API Gateway, tRPC for type-safe APIs
- **Database**: PostgreSQL with Prisma ORM
- **Cache/Queue**: Redis with BullMQ
- **Auth**: NextAuth.js
- **Payments**: Multi-PSP (Stripe, PayMongo, Xendit)

### Clean Architecture Pattern

The codebase follows a strict Single Source of Truth (SSOT) pattern:

1. **Database (Prisma)**: Storage SSOT - schema.prisma defines all data models
2. **Schemas (Zod)**: API I/O SSOT - validation schemas for all endpoints
3. **Types**: Derived from Zod schemas using `z.infer` (never duplicated)
4. **Services**: Framework-free business logic (pure functions, easily testable)
5. **tRPC**: Thin API layer that validates with Zod and calls services
6. **Hono**: API gateway that mounts tRPC endpoints

### Development Conventions

- **No business logic in API routes** - all logic lives in services packages
- **Multi-tenancy**: Every operation requires `orgId` context via tenant guards
- **Validation**: Use Zod schemas at API boundaries (`.input()` and `.output()`)
- **Error handling**: Throw domain errors in services, standardize in tRPC
- **Database**: Prefer soft deletes (`isActive=false`) over hard deletes
- **Dates**: Always return ISO strings at API boundaries
- **Pagination**: Cursor-based pagination using `id` field

### Package Dependencies

Packages have clear dependency hierarchy:

- `database` → base dependency (Prisma client)
- `schemas` → Zod validation schemas
- `types` → TypeScript types from schemas
- `services` → Business logic (depends on database, types)
- `trpc` → API layer (depends on schemas, services)

## Adding New Features

### New API Endpoint Checklist

1. **Database**: Add/modify Prisma model + run migration
2. **Schemas**: Define Zod schemas (`XOutput`, `CreateXInput`, `UpdateXInput`, etc.)
3. **Services**: Implement business logic functions (framework-free)
4. **tRPC Router**: Create router with input/output validation
5. **Types**: Export `z.infer` types if needed

### Workspace Package Naming

- Apps: `@gbs/web`, `@gbs/api`, etc.
- Packages: `@gbs/database`, `@gbs/schemas`, `@gbs/services`, etc.

## Development Environment

### Prerequisites

- Node.js >= 18.17.0
- PNPM >= 8.6.0
- PostgreSQL 15+
- Redis 6+

### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Setup environment with validation
pnpm env:setup

# Start dependencies
pnpm services:up

# Initialize database
pnpm db:setup
```

### Running Single Tests

```bash
# Run specific test file
pnpm --filter @gbs/services test products.test.ts

# Run tests in watch mode
pnpm test:watch

# Run specific app tests
pnpm --filter @gbs/web test
```

The project uses Turbo for intelligent caching and parallel execution - most commands will automatically determine optimal execution order and skip unchanged packages.
