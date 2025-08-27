# Packages Directory

This directory contains all shared packages and libraries used across the Final Golf SaaS monorepo.

## Planned Packages

- **database** - Prisma client and database utilities (`@gbs/database`)
- **schemas** - Zod validation schemas (`@gbs/schemas`)
- **types** - Shared TypeScript types (`@gbs/types`)
- **services** - Business logic services (`@gbs/services`)
- **auth** - Authentication utilities (`@gbs/auth`)
- **trpc** - tRPC router definitions (`@gbs/trpc`)
- **ui** - Shared UI components with Shadcn/ui (`@gbs/ui`)

## Naming Convention

All packages use the `@gbs/` scope (Golf Booking SaaS).

## Structure

Each package should follow this structure:
```
packages/
├── database/
│   ├── package.json
│   ├── src/
│   │   ├── index.ts
│   │   └── ...
│   └── ...
```

## Development

- Packages are automatically linked within the workspace
- Use `pnpm --filter @gbs/package-name command` to run commands in specific packages
- All packages should export their main functionality from `src/index.ts`