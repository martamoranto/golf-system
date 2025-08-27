# Apps Directory

This directory contains all the main applications in the Final Golf SaaS monorepo.

## Planned Applications

- **customer** - Customer-facing web application (Next.js 14)
- **course-admin** - Course administration dashboard
- **platform-admin** - Platform super admin interface  
- **onsite-pwa** - Onsite staff PWA for POS operations
- **api** - API Gateway with Hono and tRPC integration

## Structure

Each app should follow this structure:
```
apps/
├── customer/
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── src/
│   └── ...
```

## Getting Started

1. Navigate to the app directory: `cd apps/{app-name}`
2. Install dependencies: `pnpm install`
3. Start development: `pnpm dev`