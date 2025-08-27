# 🔧 Environment Variables Reference

Complete reference for all environment variables used across the Final Golf SaaS platform.

## 📋 Quick Setup Guide

### 1. Copy Environment Files

```bash
# Copy all .env.example files to .env files
find . -name ".env.example" -exec bash -c 'cp "$1" "${1%.example}"' _ {} \;

# Or individually for each app/service
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
cp services/worker/.env.example services/worker/.env
# ... etc for each service
```

### 2. Required Variables for Local Development

Minimum required variables to get started:

```env
# Database (all services)
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/final_golf_dev"

# Redis (all services)
REDIS_URL="redis://localhost:6379"

# JWT Secrets (API & Auth)
JWT_SECRET="development-jwt-secret-change-in-production"
NEXTAUTH_SECRET="development-secret-key-change-in-production"

# File Storage (MinIO)
S3_ENDPOINT="http://localhost:9000"
S3_ACCESS_KEY_ID="minioadmin"
S3_SECRET_ACCESS_KEY="minioadmin123"
```

### 3. Production Security Checklist

- [ ] Generate secure random secrets for all JWT/session keys
- [ ] Configure real SMTP credentials
- [ ] Set up production payment provider credentials
- [ ] Enable SSL/TLS for all database connections
- [ ] Configure proper CORS origins
- [ ] Set up monitoring and error tracking
- [ ] Configure backup and disaster recovery

---

## 🏗️ Architecture Overview

### Service Dependencies

```mermaid
graph TD
    A[Customer Web] --> B[API Gateway]
    C[Course Admin] --> B
    D[Platform Admin] --> B
    E[Onsite PWA] --> B

    B --> F[Database]
    B --> G[Redis]
    B --> H[File Storage]

    I[Worker] --> F
    I --> G

    J[Webhooks] --> F
    K[Scheduler] --> F
    L[Realtime] --> F
    L --> G
```

### Environment File Structure

```
apps/
├── web/.env.example                # Customer-facing web app
├── api/.env.example                # API gateway
├── onsite-pwa/.env.example         # On-site PWA
├── course-admin/.env.example       # Course administration
└── platform-admin/.env.example    # Platform administration

services/
├── worker/.env.example             # Background jobs
├── webhooks/.env.example           # Webhook handling
├── scheduler/.env.example          # Cron jobs
└── realtime/.env.example           # WebSocket service
```

---

## 📚 Variable Categories

### 🔐 Security Variables

| Variable              | Required | Description                              |
| --------------------- | -------- | ---------------------------------------- |
| `JWT_SECRET`          | ✅       | JWT signing secret (256-bit recommended) |
| `NEXTAUTH_SECRET`     | ✅       | NextAuth.js encryption secret            |
| `SESSION_SECRET`      | ✅       | Express session secret                   |
| `PAYMONGO_SECRET_KEY` | 💰       | PayMongo secret key (production)         |
| `STRIPE_SECRET_KEY`   | 💰       | Stripe secret key (international)        |
| `WEBHOOK_SECRET`      | ⚡       | Webhook signature verification           |

### 🗄️ Database Variables

| Variable                | Required | Description                  |
| ----------------------- | -------- | ---------------------------- |
| `DATABASE_URL`          | ✅       | PostgreSQL connection string |
| `DATABASE_POOL_MIN`     | ⚙️       | Minimum connection pool size |
| `DATABASE_POOL_MAX`     | ⚙️       | Maximum connection pool size |
| `DATABASE_POOL_TIMEOUT` | ⚙️       | Connection timeout (ms)      |

### 📡 Redis Variables

| Variable               | Required | Description                 |
| ---------------------- | -------- | --------------------------- |
| `REDIS_URL`            | ✅       | Redis connection string     |
| `REDIS_KEY_PREFIX`     | ⚙️       | Key prefix for namespacing  |
| `REDIS_SESSION_PREFIX` | ⚙️       | Session key prefix          |
| `REDIS_CACHE_TTL`      | ⚙️       | Default cache TTL (seconds) |

### 📁 File Storage Variables

| Variable               | Required | Description            |
| ---------------------- | -------- | ---------------------- |
| `S3_ENDPOINT`          | ✅       | S3-compatible endpoint |
| `S3_ACCESS_KEY_ID`     | ✅       | Storage access key     |
| `S3_SECRET_ACCESS_KEY` | ✅       | Storage secret key     |
| `S3_BUCKET_NAME`       | ✅       | Primary bucket name    |
| `S3_REGION`            | ✅       | Storage region         |

### 📧 Email Variables

| Variable        | Required | Description          |
| --------------- | -------- | -------------------- |
| `SMTP_HOST`     | 📨       | SMTP server host     |
| `SMTP_PORT`     | 📨       | SMTP server port     |
| `SMTP_USER`     | 📨       | SMTP username        |
| `SMTP_PASSWORD` | 📨       | SMTP password        |
| `SMTP_FROM`     | 📨       | Default sender email |

### 💳 Payment Variables

| Variable                  | Required | Description              |
| ------------------------- | -------- | ------------------------ |
| `PAYMONGO_PUBLIC_KEY`     | 💰       | PayMongo publishable key |
| `PAYMONGO_SECRET_KEY`     | 💰       | PayMongo secret key      |
| `PAYMONGO_WEBHOOK_SECRET` | 💰       | PayMongo webhook secret  |
| `STRIPE_PUBLIC_KEY`       | 💰       | Stripe publishable key   |
| `STRIPE_SECRET_KEY`       | 💰       | Stripe secret key        |
| `STRIPE_WEBHOOK_SECRET`   | 💰       | Stripe webhook secret    |

### 📱 SMS Variables

| Variable             | Required | Description                     |
| -------------------- | -------- | ------------------------------- |
| `SEMAPHORE_API_KEY`  | 📲       | Semaphore SMS API key           |
| `TWILIO_ACCOUNT_SID` | 📲       | Twilio account SID              |
| `TWILIO_AUTH_TOKEN`  | 📲       | Twilio auth token               |
| `SMS_PROVIDER`       | 📲       | SMS provider (semaphore/twilio) |

---

## 🚀 Application-Specific Configuration

### Customer Web App (`apps/web`)

**Purpose**: Public-facing customer website and booking interface

**Key Features**:

- Customer booking flow
- Social authentication (Google, Facebook, Apple)
- Payment processing
- Guest booking capabilities

**Critical Variables**:

```env
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3001"
GOOGLE_CLIENT_ID=""
PAYMONGO_PUBLIC_KEY=""
```

### API Gateway (`apps/api`)

**Purpose**: Central API handling authentication, booking, and business logic

**Key Features**:

- tRPC API routes
- JWT authentication
- Payment webhook handling
- Multi-tenant data isolation

**Critical Variables**:

```env
PORT="3001"
JWT_SECRET="secure-random-secret"
CORS_ORIGINS="http://localhost:3000,..."
PAYMONGO_SECRET_KEY=""
```

### Onsite PWA (`apps/onsite-pwa`)

**Purpose**: On-site operations for walk-ins and live course management

**Key Features**:

- Offline capability
- POS integration
- Staff PIN authentication
- Real-time tee sheet updates

**Critical Variables**:

```env
NEXTAUTH_URL="http://localhost:3010"
ENABLE_OFFLINE_MODE="true"
STAFF_PIN_LENGTH=4
PAYMENT_TERMINAL_TYPE="simulator"
```

### Course Admin (`apps/course-admin`)

**Purpose**: Per-course administration and management dashboard

**Key Features**:

- Tee sheet management
- Staff management
- Reporting and analytics
- Inventory management

**Critical Variables**:

```env
NEXTAUTH_URL="http://localhost:3020"
ADMIN_ROLES="course_admin,course_manager"
MAX_BOOKING_DAYS_AHEAD=90
REPORT_CACHE_TTL_MINUTES=30
```

### Platform Admin (`apps/platform-admin`)

**Purpose**: Super admin dashboard for platform management

**Key Features**:

- Multi-tenant management
- Billing and subscriptions
- System monitoring
- Feature flag control

**Critical Variables**:

```env
NEXTAUTH_URL="http://localhost:3030"
SUPER_ADMIN_EMAIL=""
MFA_REQUIRED="true"
STRIPE_SECRET_KEY=""
```

---

## ⚙️ Service-Specific Configuration

### Worker Service (`services/worker`)

**Purpose**: Background job processing (emails, SMS, reports)

**Key Features**:

- Bull Queue job processing
- Email/SMS sending
- Report generation
- Payment processing

**Critical Variables**:

```env
QUEUE_REDIS_DB=1
EMAIL_QUEUE_CONCURRENCY=5
SMS_PROVIDER="semaphore"
ENABLE_SCHEDULED_JOBS="true"
```

### Webhooks Service (`services/webhooks`)

**Purpose**: Handle payment and external service webhooks

**Key Features**:

- PayMongo/Stripe webhook verification
- SMS status updates
- Email delivery notifications
- Real-time event forwarding

**Critical Variables**:

```env
PORT="3003"
PAYMONGO_WEBHOOK_SECRET=""
STRIPE_WEBHOOK_SECRET=""
WEBHOOK_TIMEOUT_SECONDS=30
```

### Scheduler Service (`services/scheduler`)

**Purpose**: Cron job scheduling and automated tasks

**Key Features**:

- Hold cleanup automation
- Booking reminders
- Report generation
- Data maintenance

**Critical Variables**:

```env
ENABLE_CRON_JOBS="true"
CRON_TIMEZONE="Asia/Manila"
HOLD_CLEANUP_CRON="*/5 * * * *"
BOOKING_REMINDER_CRON="0 */6 * * *"
```

### Realtime Service (`services/realtime`)

**Purpose**: WebSocket server for real-time updates

**Key Features**:

- Live tee sheet updates
- Real-time booking notifications
- Multi-instance support via Redis
- Room-based messaging

**Critical Variables**:

```env
PORT="3002"
REDIS_ADAPTER_DB=4
MAX_CONNECTIONS=10000
LIVE_TEESHEET_ENABLED="true"
```

---

## 🔒 Security Best Practices

### Development vs Production

| Aspect           | Development       | Production              |
| ---------------- | ----------------- | ----------------------- |
| **JWT Secrets**  | Simple strings OK | 256-bit random required |
| **Database**     | Local Docker      | Managed service + SSL   |
| **File Storage** | Local MinIO       | AWS S3/CloudFlare R2    |
| **Monitoring**   | Console logging   | Sentry/DataDog required |
| **HTTPS**        | Not required      | Enforced everywhere     |

### Secret Management

```bash
# Generate secure random secrets
openssl rand -base64 32  # For JWT secrets
openssl rand -base64 64  # For webhook secrets

# Environment-specific files
.env.development
.env.staging
.env.production
```

### Environment Validation

Each service should validate required environment variables on startup:

```typescript
// Example validation
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET", "REDIS_URL"];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

---

## 🚨 Common Issues & Troubleshooting

### Database Connection Issues

```env
# Ensure proper connection string format
DATABASE_URL="postgresql://user:password@host:port/database"

# Connection pool settings for high load
DATABASE_POOL_MAX=20
DATABASE_POOL_TIMEOUT=30000
```

### Redis Connection Issues

```env
# For Redis Cluster
REDIS_URL="redis://localhost:6379/0"

# For Redis Sentinel
REDIS_URL="redis+sentinel://localhost:26379/mymaster"
```

### Payment Webhook Issues

```env
# Ensure webhook URLs are publicly accessible
PAYMONGO_WEBHOOK_URL="https://yourdomain.com/webhooks/paymongo"

# Use ngrok for local development
PAYMONGO_WEBHOOK_URL="https://abc123.ngrok.io/webhooks/paymongo"
```

### File Upload Issues

```env
# Increase upload limits
MAX_FILE_SIZE="10485760"  # 10MB
ALLOWED_FILE_TYPES="image/jpeg,image/png,application/pdf"

# Ensure proper S3 permissions
S3_BUCKET_POLICY="public-read"  # For public assets only
```

---

## 📊 Monitoring Variables

### Error Tracking

```env
# Sentry configuration
SENTRY_DSN="https://key@sentry.io/project"
SENTRY_ENVIRONMENT="production"
SENTRY_SAMPLE_RATE=0.1

# Custom error tracking
ERROR_WEBHOOK_URL=""
ALERT_EMAIL=""
```

### Performance Monitoring

```env
# Application performance
ENABLE_METRICS="true"
METRICS_PORT="9090"
SLOW_QUERY_THRESHOLD_MS=1000

# Resource limits
NODE_OPTIONS="--max-old-space-size=2048"
MAX_MEMORY_USAGE_MB=1536
```

### Health Checks

```env
# Health check configuration
ENABLE_HEALTH_CHECKS="true"
HEALTH_CHECK_TIMEOUT=5000
HEALTH_CHECK_INTERVAL_SECONDS=30
```

---

## 🎛️ Feature Flags

### Application Features

```env
# Customer app features
NEXT_PUBLIC_FEATURE_SOCIAL_LOGIN="true"
NEXT_PUBLIC_FEATURE_GUEST_BOOKING="true"
NEXT_PUBLIC_FEATURE_LOYALTY_PROGRAM="false"

# Admin features
NEXT_PUBLIC_FEATURE_MULTI_COURSE="false"
NEXT_PUBLIC_FEATURE_DYNAMIC_PRICING="false"
NEXT_PUBLIC_FEATURE_TOURNAMENT_MODE="false"
```

### Service Features

```env
# Worker service features
ENABLE_SCHEDULED_JOBS="true"
AUTO_PROCESS_REFUNDS="false"
EMAIL_QUEUE_ENABLED="true"

# Realtime features
LIVE_TEESHEET_ENABLED="true"
PUSH_NOTIFICATIONS_ENABLED="true"
LIVE_CHAT_ENABLED="false"
```

---

**Legend:**

- ✅ Required for basic functionality
- ⚙️ Optional configuration
- 💰 Required for payment processing
- 📨 Required for email functionality
- 📲 Required for SMS functionality
- ⚡ Required for webhook processing
