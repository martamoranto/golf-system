# 🔐 Secrets Management Guide

Comprehensive guide for managing secrets, environment variables, and sensitive configuration data across development, staging, and production environments for Final Golf SaaS.

## 📋 Table of Contents

- [Overview](#overview)
- [Secret Categories](#secret-categories)
- [GitHub Secrets Setup](#github-secrets-setup)
- [Environment Configuration](#environment-configuration)
- [Secret Generation](#secret-generation)
- [Security Best Practices](#security-best-practices)
- [Rotation Procedures](#rotation-procedures)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

Final Golf SaaS uses a multi-layered secrets management approach:

- **GitHub Secrets**: CI/CD pipeline secrets and deployment credentials
- **Environment Variables**: Application configuration per environment
- **Runtime Secrets**: Database passwords, API keys, authentication tokens
- **Build Secrets**: Container registry credentials, deployment keys

### Security Principles

- ✅ **Principle of Least Privilege**: Secrets only where needed
- ✅ **Environment Isolation**: Separate secrets for each environment
- ✅ **Regular Rotation**: Automated and scheduled secret updates
- ✅ **Audit Logging**: Track secret usage and access
- ✅ **Encryption at Rest**: All secrets encrypted in storage
- ✅ **No Plain Text**: Never store secrets in code or logs

## 🏷️ Secret Categories

### 1. Infrastructure Secrets

**Purpose**: Database, Redis, object storage connections

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database
DATABASE_PASSWORD=secure_random_password

# Redis
REDIS_URL=redis://user:password@host:port
REDIS_PASSWORD=redis_auth_password

# Object Storage (MinIO/S3)
MINIO_ACCESS_KEY=minio_access_key
MINIO_SECRET_KEY=minio_secret_key
AWS_ACCESS_KEY_ID=aws_access_key
AWS_SECRET_ACCESS_KEY=aws_secret_key
```

### 2. Authentication Secrets

**Purpose**: User authentication, session management, JWT tokens

```bash
# NextAuth
NEXTAUTH_SECRET=nextauth_secret_minimum_32_characters
NEXTAUTH_URL=https://your-domain.com

# JWT Secrets (per service)
WEB_JWT_SECRET=web_app_jwt_secret_32_chars_min
API_JWT_SECRET=api_service_jwt_secret_32_chars_min
ADMIN_JWT_SECRET=admin_app_jwt_secret_32_chars_min

# OAuth Providers
GOOGLE_CLIENT_ID=google_oauth_client_id
GOOGLE_CLIENT_SECRET=google_oauth_client_secret
FACEBOOK_CLIENT_ID=facebook_oauth_client_id
FACEBOOK_CLIENT_SECRET=facebook_oauth_client_secret
```

### 3. Payment & Financial Secrets

**Purpose**: Payment processing, financial transactions

```bash
# PayMongo (Philippines)
PAYMONGO_SECRET_KEY=sk_test_paymongo_secret_key
PAYMONGO_PUBLIC_KEY=pk_test_paymongo_public_key
PAYMONGO_WEBHOOK_SECRET=paymongo_webhook_secret

# Stripe (International)
STRIPE_SECRET_KEY=sk_test_stripe_secret_key
STRIPE_PUBLIC_KEY=pk_test_stripe_public_key
STRIPE_WEBHOOK_SECRET=whsec_stripe_webhook_secret
```

### 4. External Service Secrets

**Purpose**: Third-party integrations, APIs

```bash
# Email Services
SENDGRID_API_KEY=sendgrid_api_key
POSTMARK_API_TOKEN=postmark_api_token

# SMS Services
TWILIO_ACCOUNT_SID=twilio_account_sid
TWILIO_AUTH_TOKEN=twilio_auth_token

# Push Notifications
FCM_SERVER_KEY=firebase_cloud_messaging_key
APNS_KEY_ID=apple_push_notification_key_id

# Analytics
GOOGLE_ANALYTICS_ID=google_analytics_tracking_id
MIXPANEL_TOKEN=mixpanel_project_token
```

### 5. CI/CD Secrets

**Purpose**: Deployment, container registry, automation

```bash
# Turborepo
TURBO_TOKEN=turborepo_remote_cache_token
TURBO_TEAM=turborepo_team_slug

# Container Registry
REGISTRY_USERNAME=container_registry_username
REGISTRY_PASSWORD=container_registry_password

# Deployment
DEPLOY_KEY=ssh_private_key_for_deployment
CLOUDFLARE_API_TOKEN=cloudflare_api_token
VERCEL_TOKEN=vercel_deployment_token
```

## 🏗️ GitHub Secrets Setup

### Repository Secrets Configuration

Navigate to `Repository Settings > Secrets and variables > Actions`

#### Core CI/CD Secrets

```bash
# Required for all environments
TURBO_TOKEN                    # Turborepo remote cache token (optional but recommended)
TURBO_TEAM                     # Turborepo team slug

# Container registry (if using Docker)
REGISTRY_USERNAME              # Container registry username
REGISTRY_PASSWORD              # Container registry token/password
```

#### Development Environment Secrets

```bash
# Not typically needed in CI/CD, but may be required for integration tests
DEV_DATABASE_URL              # Development database URL
DEV_REDIS_URL                 # Development Redis URL
```

#### Staging Environment Secrets

```bash
# Database & Cache
STAGING_DATABASE_URL          # postgresql://user:pass@staging-db.finalgolf.com:5432/finalgolf_staging
STAGING_REDIS_URL             # redis://user:pass@staging-redis.finalgolf.com:6379

# Authentication
STAGING_NEXTAUTH_SECRET       # Staging NextAuth secret (32+ chars)
STAGING_WEB_JWT_SECRET        # Web app JWT secret for staging
STAGING_API_JWT_SECRET        # API JWT secret for staging
STAGING_ADMIN_JWT_SECRET      # Admin JWT secret for staging

# Payment Providers (Test Mode)
STAGING_PAYMONGO_SECRET_KEY   # PayMongo test secret key
STAGING_PAYMONGO_PUBLIC_KEY   # PayMongo test public key
STAGING_STRIPE_SECRET_KEY     # Stripe test secret key
STAGING_STRIPE_PUBLIC_KEY     # Stripe test public key

# External Services (Test/Sandbox)
STAGING_SENDGRID_API_KEY      # SendGrid staging API key
STAGING_TWILIO_AUTH_TOKEN     # Twilio test credentials
```

#### Production Environment Secrets

```bash
# Database & Cache
PRODUCTION_DATABASE_URL       # postgresql://user:pass@prod-db.finalgolf.com:5432/finalgolf_prod
PRODUCTION_REDIS_URL          # redis://user:pass@prod-redis.finalgolf.com:6379

# Authentication
PRODUCTION_NEXTAUTH_SECRET    # Production NextAuth secret (32+ chars)
PRODUCTION_WEB_JWT_SECRET     # Web app JWT secret for production
PRODUCTION_API_JWT_SECRET     # API JWT secret for production
PRODUCTION_ADMIN_JWT_SECRET   # Admin JWT secret for production

# Payment Providers (Live Mode)
PRODUCTION_PAYMONGO_SECRET_KEY    # PayMongo live secret key
PRODUCTION_PAYMONGO_PUBLIC_KEY    # PayMongo live public key
PRODUCTION_STRIPE_SECRET_KEY      # Stripe live secret key
PRODUCTION_STRIPE_PUBLIC_KEY      # Stripe live public key
PRODUCTION_PAYMONGO_WEBHOOK_SECRET # PayMongo webhook verification
PRODUCTION_STRIPE_WEBHOOK_SECRET   # Stripe webhook verification

# External Services (Production)
PRODUCTION_SENDGRID_API_KEY       # SendGrid production API key
PRODUCTION_TWILIO_AUTH_TOKEN      # Twilio production credentials
PRODUCTION_FCM_SERVER_KEY         # Firebase Cloud Messaging key
PRODUCTION_GOOGLE_ANALYTICS_ID    # Google Analytics tracking ID
```

#### Deployment Platform Secrets

```bash
# AWS (if using)
AWS_ACCESS_KEY_ID             # AWS access key
AWS_SECRET_ACCESS_KEY         # AWS secret access key
AWS_REGION                    # AWS deployment region

# Vercel (if using)
VERCEL_TOKEN                  # Vercel deployment token
VERCEL_ORG_ID                 # Vercel organization ID
VERCEL_PROJECT_ID             # Vercel project ID

# CloudFlare (if using)
CLOUDFLARE_API_TOKEN          # CloudFlare API token
CLOUDFLARE_ZONE_ID            # CloudFlare zone ID

# Custom Deployment
DEPLOY_SSH_KEY                # SSH private key for deployment
DEPLOY_HOST                   # Deployment server hostname
DEPLOY_USER                   # Deployment server username
```

### Environment Variables (Non-Secret)

Navigate to `Repository Settings > Secrets and variables > Actions > Variables`

#### Staging Environment Variables

```bash
STAGING_WEB_URL=https://staging.finalgolf.com
STAGING_API_URL=https://staging-api.finalgolf.com
STAGING_COURSE_ADMIN_URL=https://staging-admin.finalgolf.com
STAGING_PLATFORM_ADMIN_URL=https://staging-platform.finalgolf.com
STAGING_ONSITE_PWA_URL=https://staging-pos.finalgolf.com
STAGING_APP_ENV=staging
STAGING_NODE_ENV=production
```

#### Production Environment Variables

```bash
PRODUCTION_WEB_URL=https://app.finalgolf.com
PRODUCTION_API_URL=https://api.finalgolf.com
PRODUCTION_COURSE_ADMIN_URL=https://admin.finalgolf.com
PRODUCTION_PLATFORM_ADMIN_URL=https://platform.finalgolf.com
PRODUCTION_ONSITE_PWA_URL=https://pos.finalgolf.com
PRODUCTION_APP_ENV=production
PRODUCTION_NODE_ENV=production
```

## 🔐 Secret Generation

### Secure Secret Generation Commands

#### Strong Passwords and Keys (32+ characters)

```bash
# NextAuth secrets, JWT secrets
openssl rand -base64 32

# Database passwords
openssl rand -base64 24

# API tokens and webhook secrets
openssl rand -hex 32

# UUID-based secrets
uuidgen | tr '[:upper:]' '[:lower:]' | tr -d '-'
```

#### Specific Secret Types

##### NextAuth Secrets

```bash
# Generate NextAuth secret (minimum 32 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

##### JWT Secrets

```bash
# Generate JWT signing secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

##### Database Passwords

```bash
# Generate secure database password
openssl rand -base64 32 | tr -d "=+/" | cut -c1-25
```

##### Webhook Secrets

```bash
# Generate webhook verification secret
openssl rand -hex 32
```

### Secret Strength Requirements

| Secret Type       | Minimum Length | Character Set          | Example                   |
| ----------------- | -------------- | ---------------------- | ------------------------- |
| NextAuth Secret   | 32 characters  | Base64                 | `kX9fHLnZYbGcQd2pV8jR...` |
| JWT Secret        | 64 characters  | Hex                    | `a1b2c3d4e5f6...`         |
| Database Password | 20 characters  | Alphanumeric + symbols | `Kz9!mN2@pL5#...`         |
| API Keys          | 32+ characters | Provider-specific      | Varies by service         |
| Webhook Secrets   | 32 characters  | Hex                    | `f4e3d2c1b0a9...`         |

## 🔄 Environment Configuration

### Local Development (.env files)

#### apps/web/.env.local

```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/finalgolf_dev"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev_nextauth_secret_32_characters_minimum"

# Redis
REDIS_URL="redis://localhost:6379"

# Payment (Test Mode)
PAYMONGO_SECRET_KEY="sk_test_..."
PAYMONGO_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLIC_KEY="pk_test_..."

# External Services (Development)
SENDGRID_API_KEY="development_key"
```

#### apps/api/.env.local

```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/finalgolf_dev"

# Authentication
JWT_SECRET="api_jwt_secret_64_characters_minimum_for_security"

# Redis
REDIS_URL="redis://localhost:6379"

# External APIs
TWILIO_ACCOUNT_SID="development_sid"
TWILIO_AUTH_TOKEN="development_token"
```

### Docker Compose Secrets

#### docker-compose.override.yml (for development)

```yaml
services:
  postgres:
    environment:
      POSTGRES_PASSWORD: dev_postgres_password

  redis:
    environment:
      REDIS_PASSWORD: dev_redis_password

  minio:
    environment:
      MINIO_ROOT_USER: dev_minio_user
      MINIO_ROOT_PASSWORD: dev_minio_password
```

## 🛡️ Security Best Practices

### 1. Secret Hygiene

#### Never Commit Secrets

```bash
# Add to .gitignore
.env
.env.local
.env.*.local
**/.env
**/.env.local

# Scan for accidentally committed secrets
git log -p | grep -i "password\|secret\|key" --color=always
```

#### Use Environment-Specific Secrets

```bash
# Different secrets per environment
DEV_DATABASE_URL="postgresql://localhost/dev"
STAGING_DATABASE_URL="postgresql://staging-host/staging"
PRODUCTION_DATABASE_URL="postgresql://prod-host/prod"
```

### 2. Access Control

#### Principle of Least Privilege

- Development: Access to dev secrets only
- Staging: Access to staging secrets only
- Production: Limited team access, additional approval required

#### GitHub Environment Protection

```yaml
# Production environment protection
environments:
  production:
    protection_rules:
      - required_reviewers: 2
      - wait_timer: 300 # 5 minutes
    deployment_branch_policy:
      protected_branches: true
```

### 3. Secret Monitoring

#### Audit Secret Access

- Monitor GitHub Actions logs for secret usage
- Track deployment frequency and patterns
- Alert on unusual secret access patterns

#### Detect Secret Leaks

```bash
# Use tools to scan for leaked secrets
npm install -g @gitguardian/ggshield
ggshield secret scan path/to/repository
```

### 4. Encryption Standards

#### At-Rest Encryption

- GitHub encrypts all repository secrets
- Use encrypted databases and storage
- Enable encryption on all external services

#### In-Transit Encryption

- Always use HTTPS/TLS for API calls
- Use encrypted database connections (SSL)
- Enable encryption for Redis connections

## 🔄 Rotation Procedures

### Scheduled Rotation Timeline

| Secret Type        | Rotation Frequency | Priority | Automation     |
| ------------------ | ------------------ | -------- | -------------- |
| Database passwords | Quarterly          | High     | Semi-automated |
| JWT secrets        | Quarterly          | High     | Manual         |
| API keys           | Bi-annually        | Medium   | Manual         |
| OAuth secrets      | Annually           | Medium   | Manual         |
| Webhook secrets    | Bi-annually        | Medium   | Manual         |

### Rotation Process

#### 1. Database Password Rotation

```bash
# 1. Generate new password
NEW_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/")

# 2. Update database user
psql -h production-db.finalgolf.com -U admin -c "ALTER USER finalgolf_user PASSWORD '$NEW_PASSWORD';"

# 3. Update GitHub secret
# Navigate to Settings > Secrets > PRODUCTION_DATABASE_URL
# Update connection string with new password

# 4. Deploy applications to pick up new secret
# Trigger production deployment

# 5. Verify connectivity
# Monitor application health checks
```

#### 2. NextAuth Secret Rotation

```bash
# 1. Generate new NextAuth secret
NEW_NEXTAUTH_SECRET=$(openssl rand -base64 32)

# 2. Update GitHub secret
# Settings > Secrets > PRODUCTION_NEXTAUTH_SECRET

# 3. Deploy web application
# This will invalidate all existing sessions

# 4. Notify users of session invalidation
# Optional: Send notification to users
```

#### 3. API Key Rotation

```bash
# 1. Generate new API key in external service
# (e.g., SendGrid, Twilio, Stripe dashboard)

# 2. Update GitHub secret with new key

# 3. Deploy affected services

# 4. Deactivate old API key in external service
# Wait 24-48 hours before deactivation
```

### Emergency Rotation

For compromised secrets, follow this emergency procedure:

1. **Immediate**: Deactivate compromised secret in external service
2. **Within 1 hour**: Generate and deploy new secret
3. **Within 24 hours**: Review access logs and assess impact
4. **Within 48 hours**: Update security protocols and documentation

## 🔍 Monitoring and Alerting

### Secret Usage Monitoring

#### GitHub Actions Monitoring

```bash
# Monitor workflow runs for secret-related failures
# Set up alerts for:
# - Authentication failures
# - Database connection errors
# - API key validation failures
```

#### Application Monitoring

```bash
# Monitor application logs for:
# - Database connection failures
# - Authentication service errors
# - Payment processing failures
# - External API failures
```

### Security Alerts

#### Automated Alerts

- Failed authentication attempts
- Unusual secret access patterns
- Expired certificates or tokens
- Suspicious deployment activity

#### Manual Reviews

- Quarterly secret audit
- Annual security assessment
- Post-incident secret review

## 🚨 Troubleshooting

### Common Secret-Related Issues

#### 1. Database Connection Failures

**Symptoms**: `Connection refused` or `Authentication failed`

**Diagnosis**:

```bash
# Test database connection
psql "postgresql://user:password@host:port/database" -c "SELECT version();"
```

**Solutions**:

- Verify DATABASE_URL format and encoding
- Check if password contains special characters needing URL encoding
- Confirm database user exists and has proper permissions
- Verify network connectivity and firewall rules

#### 2. NextAuth Authentication Issues

**Symptoms**: `[next-auth][error][JWT_SESSION_ERROR]`

**Diagnosis**:

```bash
# Check NextAuth configuration
# Verify NEXTAUTH_SECRET length (minimum 32 characters)
# Confirm NEXTAUTH_URL matches actual domain
```

**Solutions**:

- Regenerate NextAuth secret with proper length
- Ensure NEXTAUTH_URL uses HTTPS in production
- Check for special characters in secret that might cause parsing issues

#### 3. Payment Processing Failures

**Symptoms**: `Invalid API key` or `Webhook verification failed`

**Diagnosis**:

```bash
# Test payment API connection
curl -H "Authorization: Bearer $STRIPE_SECRET_KEY" https://api.stripe.com/v1/charges
```

**Solutions**:

- Verify API keys are for correct environment (test vs live)
- Check webhook secret matches provider configuration
- Confirm API keys have proper permissions
- Review payment provider documentation for changes

#### 4. External Service API Failures

**Symptoms**: `401 Unauthorized` or `403 Forbidden`

**Solutions**:

- Verify API key validity and expiration
- Check service-specific rate limits
- Confirm API permissions and scopes
- Review service status page for outages

### Debug Commands

#### Test Secret Connectivity

```bash
# Database
psql $DATABASE_URL -c "SELECT 1;"

# Redis
redis-cli -u $REDIS_URL ping

# External APIs (replace with actual endpoints)
curl -H "Authorization: Bearer $API_KEY" https://api.service.com/health
```

#### Validate Secret Format

```bash
# Check secret length
echo -n "$NEXTAUTH_SECRET" | wc -c

# Validate URL format
echo $DATABASE_URL | grep -E '^postgresql://.*'

# Test base64 encoding
echo "$JWT_SECRET" | base64 -d >/dev/null 2>&1 && echo "Valid base64" || echo "Invalid base64"
```

### Recovery Procedures

#### Complete Secret Reset

In case of widespread compromise:

1. **Generate all new secrets** using secure methods
2. **Update all GitHub secrets** in correct order
3. **Deploy to staging first** to validate configuration
4. **Deploy to production** during maintenance window
5. **Monitor all services** for connectivity issues
6. **Update documentation** with new rotation dates

#### Partial Secret Recovery

For individual secret issues:

1. **Identify affected services** and their dependencies
2. **Generate new secret** for specific service
3. **Update GitHub secret** and test in staging
4. **Deploy affected applications** only
5. **Verify service functionality** and connectivity

## 📚 Reference

### Secret Naming Conventions

```bash
# Environment prefix pattern
{ENVIRONMENT}_{SERVICE}_{TYPE}

# Examples
PRODUCTION_DATABASE_URL
STAGING_WEB_JWT_SECRET
DEV_SENDGRID_API_KEY
```

### Useful Tools

```bash
# Secret generation
openssl rand -base64 32        # Strong passwords
uuidgen                        # UUIDs
node -e "crypto.randomBytes()" # Node.js crypto

# Secret scanning
git-secrets                    # Git hook for secret detection
ggshield                       # GitGuardian CLI
truffleHog                     # Secret hunting tool
```

### External Resources

- [GitHub Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [OWASP Secret Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [12-Factor App Config](https://12factor.net/config)

---

**🔐 Security Notice**: This document contains guidance for handling sensitive information. Always follow your organization's security policies and regularly review access permissions.
