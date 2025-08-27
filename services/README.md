# Services Directory

This directory contains background services and workers for the Final Golf SaaS platform.

## Planned Services

- **worker** - Background job processing with BullMQ
- **webhooks** - PSP webhook handlers (Stripe, PayMongo, etc.)
- **scheduler** - Cron job scheduler for automated tasks
- **realtime** - Socket.IO server for real-time updates

## Architecture

Services are independent Node.js applications that can be deployed separately:
- Each service has its own Docker container
- Services communicate via Redis queues and database events
- All services use shared packages from the workspace

## Structure

Each service should follow this structure:
```
services/
├── worker/
│   ├── package.json
│   ├── Dockerfile
│   ├── src/
│   │   ├── index.ts
│   │   ├── jobs/
│   │   └── queues/
│   └── ...
```

## Development

1. Navigate to service directory: `cd services/{service-name}`
2. Install dependencies: `pnpm install`
3. Start development: `pnpm dev`

## Deployment

Services are containerized and deployed independently using Docker and Kubernetes.