# 🚀 Environment Setup Guide

Quick setup guide for Final Golf SaaS development environment.

## 🏁 Quick Start

### 1. Run Setup Script
```bash
# Automated environment setup
pnpm env:setup
```

This script will:
- ✅ Copy all `.env.example` files to appropriate `.env` files
- ✅ Create basic root `.env` configuration
- ✅ Validate environment configuration
- ✅ Provide next steps guidance

### 2. Start Docker Services
```bash
# Start all infrastructure services
pnpm services:up
```

### 3. Generate Production Secrets
```bash
# Generate secure random secrets for production
pnpm env:generate-secrets
```

### 4. Validate Configuration
```bash
# Validate all environment variables
pnpm env:validate
```

---

## 📁 Environment Files Structure

After setup, you'll have these environment files:

```
Final Golf/
├── .env                              # Root Docker Compose config
├── apps/
│   ├── web/.env.local               # Customer web app
│   ├── api/.env                     # API gateway
│   ├── onsite-pwa/.env.local        # On-site PWA
│   ├── course-admin/.env.local      # Course admin dashboard
│   └── platform-admin/.env.local   # Platform admin dashboard
└── services/
    ├── worker/.env                  # Background worker
    ├── webhooks/.env                # Webhook service
    ├── scheduler/.env               # Cron scheduler
    └── realtime/.env                # WebSocket service
```

---

## 🔧 Manual Setup (Alternative)

If you prefer manual setup or the automated script doesn't work:

### Step 1: Copy Environment Templates
```bash
# Copy all .env.example files
find . -name ".env.example" -exec bash -c 'cp "$1" "${1%.example}"' _ {} \;

# Or copy specific files
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
cp services/worker/.env.example services/worker/.env
# ... repeat for each service
```

### Step 2: Configure Required Variables
Edit each `.env` file and set these minimum required variables:

```env
# Database (all services)
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/final_golf_dev"

# Redis (all services)
REDIS_URL="redis://localhost:6379"

# JWT Secrets (API & NextAuth)
JWT_SECRET="development-jwt-secret-change-in-production"
NEXTAUTH_SECRET="development-secret-key-change-in-production"

# File Storage (MinIO for development)
S3_ENDPOINT="http://localhost:9000"
S3_ACCESS_KEY_ID="minioadmin"
S3_SECRET_ACCESS_KEY="minioadmin123"
S3_BUCKET_NAME="golf-uploads"
S3_REGION="us-east-1"
```

### Step 3: Application-Specific URLs
Update these URLs for each Next.js app:

```env
# apps/web/.env.local
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3001"

# apps/onsite-pwa/.env.local  
NEXTAUTH_URL="http://localhost:3010"
NEXT_PUBLIC_API_URL="http://localhost:3001"

# apps/course-admin/.env.local
NEXTAUTH_URL="http://localhost:3020"
NEXT_PUBLIC_API_URL="http://localhost:3001"

# apps/platform-admin/.env.local
NEXTAUTH_URL="http://localhost:3030"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

---

## 🔍 Environment Validation

### Automated Validation
```bash
# Run comprehensive environment validation
pnpm env:validate

# Generate secure secrets for production
pnpm env:generate-secrets
```

### Manual Validation Checklist

#### ✅ Required Variables Present
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `REDIS_URL` - Redis connection string
- [ ] `JWT_SECRET` - JWT signing secret (32+ chars)
- [ ] `NEXTAUTH_SECRET` - NextAuth encryption secret (32+ chars)

#### ✅ Service-Specific Configuration
- [ ] **API Gateway**: `PORT`, `CORS_ORIGINS`
- [ ] **WebSocket Service**: `PORT`, `MAX_CONNECTIONS`
- [ ] **Worker Service**: Queue configuration
- [ ] **Webhook Service**: Webhook secrets

#### ✅ Security Check
- [ ] All secrets are 32+ characters long
- [ ] No development placeholders in production
- [ ] Webhook secrets configured for external services
- [ ] CORS origins properly set

---

## 🔐 Production Configuration

### Security Checklist
- [ ] Generate secure random secrets using `pnpm env:generate-secrets`
- [ ] Replace all development defaults
- [ ] Configure real payment provider credentials
- [ ] Set up SMTP for email functionality
- [ ] Enable SSL/TLS for database connections
- [ ] Configure monitoring (Sentry, etc.)

### Required Production Services
1. **PostgreSQL Database** - Managed database service (AWS RDS, Neon, etc.)
2. **Redis Cache** - Redis service (AWS ElastiCache, Upstash, etc.)
3. **File Storage** - S3-compatible storage (AWS S3, CloudFlare R2, etc.)
4. **Email Service** - SMTP provider (SendGrid, AWS SES, etc.)
5. **Payment Processing** - PayMongo and/or Stripe accounts

### Environment-Specific Files
```bash
# Different environments
.env.development     # Development overrides
.env.staging        # Staging environment
.env.production     # Production secrets (never commit!)
```

---

## 🚨 Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Test database connection
psql postgresql://postgres:postgres123@localhost:5432/final_golf_dev

# Check Docker services
pnpm services:status
```

#### Redis Connection Errors  
```bash
# Test Redis connection
redis-cli -u redis://localhost:6379 ping

# Check Redis service
docker logs gbs-redis
```

#### Permission Errors
```bash
# Fix script permissions
chmod +x scripts/setup-env.sh
chmod +x scripts/docker-dev.sh
```

#### Port Conflicts
```bash
# Check what's using ports
lsof -i :3000  # Web app
lsof -i :3001  # API
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis
lsof -i :9000  # MinIO
```

### Getting Help

1. **Check Documentation**: 
   - `docs/ENVIRONMENT_VARIABLES.md` - Complete variable reference
   - `DOCKER.md` - Docker setup guide
   
2. **Validate Configuration**:
   ```bash
   pnpm env:validate
   ```

3. **Check Service Health**:
   ```bash
   pnpm services:status
   pnpm docker:health
   ```

---

## 📚 Additional Resources

- [Environment Variables Reference](./ENVIRONMENT_VARIABLES.md) - Complete reference for all variables
- [Docker Setup Guide](../DOCKER.md) - Docker service configuration
- [Development Setup](../README.md) - General development setup
- [Project Structure](./project-structure.md) - Understanding the monorepo structure

---

**Next Steps**: After environment setup, run `pnpm dev` to start all development servers!