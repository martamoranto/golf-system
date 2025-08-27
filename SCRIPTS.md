# 🚀 Final Golf SaaS - Script Reference

Comprehensive script reference for the Final Golf SaaS monorepo development workflow.

## 🏃‍♂️ Development Scripts

### **Core Development**
```bash
# Start all development servers in parallel
pnpm dev

# Start specific applications
pnpm dev:web          # Web customer app
pnpm dev:admin        # Admin dashboard
pnpm dev:api          # API gateway

# Start by workspace type
pnpm dev:packages     # All packages in watch mode
pnpm dev:services     # All background services
pnpm dev:all          # Everything (same as pnpm dev)
```

### **Selective Development**
```bash
# Start only specific packages
pnpm --filter @gbs/web dev
pnpm --filter @gbs/shared dev
pnpm --filter @gbs/ui dev
```

## 🏗️ Build Scripts

### **Production Builds**
```bash
# Build all packages with proper dependency ordering
pnpm build

# Build with explicit ordering (packages → apps → services)
pnpm build:production

# Build specific workspace types
pnpm build:packages   # Build all packages first
pnpm build:apps       # Build applications
pnpm build:services   # Build background services
```

### **Incremental & Affected Builds**
```bash
# Build only packages affected by changes since last commit
pnpm build:affected

# Build specific TypeScript project
npx tsc --build tsconfig.build.json
```

### **Production Deployment**
```bash
# Start production servers
pnpm start

# Start specific apps in production
pnpm start:web
pnpm start:admin
pnpm start:api
```

## 🧪 Testing Scripts

### **Test Execution**
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage reports
pnpm test:coverage

# Test specific workspace types
pnpm test:packages
pnpm test:apps

# Test only affected packages
pnpm test:affected
```

### **Test Types**
```bash
# End-to-end testing
pnpm test:e2e

# Integration testing
pnpm test:integration

# Unit testing (default with pnpm test)
```

## 🔍 Quality Assurance Scripts

### **Linting & Formatting**
```bash
# Lint all code
pnpm lint

# Auto-fix linting issues
pnpm lint:fix

# Lint specific workspace types
pnpm lint:packages
pnpm lint:apps
pnpm lint:affected

# Format all code
pnpm format

# Check formatting without fixing
pnpm format:check

# Format specific workspace types
pnpm format:packages
pnpm format:apps
```

### **Type Checking**
```bash
# Type-check all packages
pnpm type-check

# Type-check in parallel
pnpm type-check:all

# Type-check specific workspace types
pnpm type-check:packages
pnpm type-check:apps
```

## 🗄️ Database Management Scripts

### **Core Database Operations**
```bash
# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Run migrations in development with prompts
pnpm db:migrate:dev

# Reset database and run all migrations
pnpm db:migrate:reset

# Push schema changes to database (dev only)
pnpm db:push
```

### **Database Setup & Seeding**
```bash
# Set up database from scratch (generate + migrate + seed)
pnpm db:setup

# Refresh with fresh data (reset + seed)
pnpm db:refresh

# Seed database with sample data
pnpm db:seed

# Reset database completely
pnpm db:reset

# Open Prisma Studio
pnpm db:studio
```

## 🧹 Cleanup & Reset Scripts

### **Incremental Cleanup**
```bash
# Clean build artifacts only
pnpm clean:build

# Clean node_modules in root only
pnpm clean:deps

# Clean Turbo cache
pnpm clean:cache

# Clean dist and .next directories
pnpm clean:dist

# Standard clean (build + deps)
pnpm clean
```

### **Complete Reset**
```bash
# Clean everything and reinstall
pnpm reset

# Nuclear option: delete everything including lock file
pnpm reset:hard

# Clean all node_modules recursively
pnpm clean:modules

# Clean everything
pnpm clean:all
```

## ⚙️ CI/CD Scripts

### **Continuous Integration**
```bash
# Validate entire codebase (CI pipeline)
pnpm ci:validate

# Individual CI steps
pnpm ci:lint        # Lint with CI cache
pnpm ci:type-check  # Type-check with CI cache
pnpm ci:test        # Test with CI cache  
pnpm ci:build       # Build with CI cache
```

### **Git Hooks**
```bash
# Pre-commit hook (runs automatically)
pnpm pre-commit

# Pre-push hook (runs automatically)  
pnpm pre-push
```

## 🔧 Workspace Management Scripts

### **Workspace Information**
```bash
# List all workspace packages with paths
pnpm workspace:info

# Check for outdated dependencies
pnpm workspace:outdated

# Update all dependencies to latest
pnpm workspace:update
```

### **Health & Diagnostics**
```bash
# Run development environment setup
pnpm setup

# Validate workspace configuration
pnpm validate

# Check dependency health
pnpm check:deps

# Complete health check
pnpm check:health

# Full system diagnostic
pnpm doctor
```

## 📦 Package Management Scripts

### **Publishing & Versioning**
```bash
# Create changeset for version bumps
pnpm changeset

# Version packages based on changesets
pnpm version-packages

# Build and publish packages
pnpm release
```

### **Installation Hooks**
```bash
# Runs automatically after pnpm install
pnpm postinstall

# Runs during git setup
pnpm prepare
```

## 🎯 Usage Examples

### **New Developer Onboarding**
```bash
git clone <repository>
cd final-golf-saas
pnpm setup              # Install deps and setup environment
pnpm dev                # Start development servers
```

### **Daily Development Workflow**
```bash
pnpm dev:web            # Start only web app
pnpm test:watch         # Run tests in watch mode
pnpm lint:fix           # Fix any linting issues
pnpm type-check         # Validate TypeScript
```

### **Before Committing**
```bash
pnpm lint:fix           # Fix linting issues
pnpm format             # Format code
pnpm test               # Run tests
pnpm type-check         # Validate types
pnpm build              # Ensure build works
```

### **CI/CD Pipeline**
```bash
pnpm install --frozen-lockfile
pnpm ci:validate        # Runs lint + type-check + test + build
```

### **Troubleshooting**
```bash
pnpm doctor             # Full system health check
pnpm reset              # Clean slate restart
pnpm validate           # Check workspace configuration
pnpm check:deps         # Analyze dependencies
```

### **Database Development**
```bash
pnpm db:setup           # Initial setup
pnpm db:migrate:dev     # Create and run migrations
pnpm db:seed            # Add sample data
pnpm db:studio          # Visual database browser
pnpm db:refresh         # Fresh data for testing
```

## 🚨 Common Issues & Solutions

### **Build Issues**
```bash
# Clear caches and rebuild
pnpm clean:cache && pnpm build

# Reset dependencies
pnpm reset

# Check for TypeScript errors
pnpm type-check
```

### **Development Server Issues**
```bash
# Kill all Node processes
pkill -f node

# Clean and restart
pnpm clean && pnpm dev
```

### **Database Issues**
```bash
# Reset database
pnpm db:reset && pnpm db:setup

# Regenerate client
pnpm db:generate
```

---

**💡 Pro Tips**:
- Use `pnpm --filter <package>` to run commands on specific packages
- Add `--parallel` to Turbo commands for better performance
- Use `--affected` flags to only process changed code
- Run `pnpm doctor` regularly to catch issues early
- Use `pnpm validate` after making configuration changes