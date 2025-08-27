# 🏌️ Final Golf SaaS

A comprehensive B2B SaaS platform for golf courses featuring booking management, point of sale, resource management, and community marketplace.

## 🏗️ Monorepo Structure

This project uses PNPM workspaces with a clean monorepo architecture:

```
final-golf-saas/
├── apps/                    # Main applications
│   ├── customer/           # Customer web app (Next.js 14)
│   ├── course-admin/       # Course admin dashboard
│   ├── platform-admin/     # Platform admin interface
│   ├── onsite-pwa/         # Onsite staff PWA
│   └── api/                # API Gateway (Hono + tRPC)
├── packages/               # Shared packages
│   ├── database/           # Prisma client & utilities
│   ├── schemas/            # Zod validation schemas
│   ├── types/              # TypeScript types
│   ├── services/           # Business logic services
│   ├── auth/               # Authentication utilities
│   ├── trpc/              # tRPC router definitions
│   └── ui/                 # Shared UI components
├── services/               # Background services
│   ├── worker/             # Background job processing
│   ├── webhooks/           # PSP webhook handlers
│   ├── scheduler/          # Cron job scheduler
│   └── realtime/           # Socket.IO server
└── docs/                   # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.17.0
- PNPM >= 8.6.0
- PostgreSQL 15+
- Redis 6+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd final-golf-saas
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize database**
   ```bash
   pnpm db:migrate:dev
   pnpm db:seed
   ```

5. **Start development**
   ```bash
   pnpm dev
   ```

## 📋 Available Scripts

### Development
- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all packages and apps
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all code
- `pnpm type-check` - TypeScript type checking

### Database
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:migrate` - Run database migrations
- `pnpm db:seed` - Seed database with sample data
- `pnpm db:studio` - Open Prisma Studio

### Utilities
- `pnpm clean` - Clean all node_modules and build artifacts
- `pnpm format` - Format all code with Prettier

## 🏢 Architecture

### Technology Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Hono API Gateway, tRPC
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for sessions and real-time data
- **Queue**: BullMQ for background jobs
- **Auth**: NextAuth.js with social providers
- **Payments**: Multi-PSP (Stripe, PayMongo, Xendit)

### Key Features
- 🏌️ **Real-time Booking System** with slot locking
- 💳 **Multi-PSP Payment Processing**
- 🏪 **Point of Sale Integration**
- 👥 **Resource Management** (caddies, carts, lockers)
- 🎓 **Lesson & Coach Booking**
- 🛒 **Community Classifieds Marketplace**
- 📊 **Comprehensive Analytics & Reporting**
- 🏢 **Multi-tenant SaaS Architecture**

## 📚 Documentation

- [Project Structure](./docs/project-structure.md)
- [Coding Standards](./docs/coding-structure.md)
- [Feature Specifications](./docs/feature-specification-document.md)
- [Task Management](./docs/task.md)

## 🔧 Development Workflow

1. **Feature Development**: Create feature branches from `main`
2. **Testing**: Write tests for all new features
3. **Code Review**: Submit PRs for peer review
4. **Deployment**: Automated deployment via CI/CD

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🤝 Contributing

Please refer to our internal development guidelines for contribution standards and practices.

---

**Final Golf SaaS** - Revolutionizing golf course management through technology.