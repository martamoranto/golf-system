# 🚀 CI/CD Pipeline Setup Guide

Complete setup guide for Final Golf SaaS CI/CD pipeline using GitHub Actions with comprehensive workflows, security scanning, and deployment automation.

## 📋 Table of Contents

- [Overview](#overview)
- [Workflow Architecture](#workflow-architecture)
- [Environment Configuration](#environment-configuration)
- [Secrets Management](#secrets-management)
- [Branch Protection Rules](#branch-protection-rules)
- [Deployment Environments](#deployment-environments)
- [Security Configuration](#security-configuration)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The CI/CD pipeline provides:

- **Continuous Integration**: Automated testing, linting, and quality checks
- **Continuous Deployment**: Automated deployments to staging and production
- **Security Scanning**: Dependency auditing and code security analysis
- **Performance Optimization**: Intelligent caching and parallel execution
- **Environment Management**: Staging and production environment automation

### Key Features

- ✅ **Zero-downtime deployments** with blue-green strategy
- ✅ **Comprehensive quality gates** (8-step validation cycle)
- ✅ **Intelligent caching** for PNPM and Turborepo
- ✅ **Security-first approach** with automated vulnerability scanning
- ✅ **Environment isolation** with proper secrets management
- ✅ **Rollback capability** for production deployments
- ✅ **Monitoring integration** with health checks and alerting

## 🏗️ Workflow Architecture

### Core Workflows

| Workflow                  | Trigger                   | Purpose                          | Duration |
| ------------------------- | ------------------------- | -------------------------------- | -------- |
| **CI Pipeline**           | PR/Push to main/develop   | Quality assurance and validation | ~15 min  |
| **Staging Deployment**    | Push to develop           | Deploy to staging environment    | ~20 min  |
| **Production Deployment** | Release tags              | Deploy to production environment | ~30 min  |
| **Security Scan**         | Schedule/Security changes | Vulnerability assessment         | ~15 min  |
| **Cache Cleanup**         | Weekly schedule           | Optimize GitHub Actions cache    | ~10 min  |

### Reusable Templates

- **Node.js Setup Template**: Standardized environment setup
- **Quality Check Template**: Linting, type checking, testing
- **Build & Deploy Template**: Build artifacts and deployment

### Workflow Dependencies

```mermaid
graph TD
    A[Code Push] --> B[CI Pipeline]
    B --> C{Branch?}
    C -->|develop| D[Staging Deployment]
    C -->|main| E[Quality Gates]
    F[Release Tag] --> G[Production Deployment]
    H[Schedule] --> I[Security Scan]
    H --> J[Cache Cleanup]

    B --> K[Quality Check Template]
    D --> L[Build & Deploy Template]
    G --> L
    K --> M[Node.js Setup Template]
    L --> M
```

## ⚙️ Environment Configuration

### Required Environment Variables

#### CI/CD Configuration

```bash
# Turborepo Remote Caching (Optional but Recommended)
TURBO_TOKEN=your_turborepo_token
TURBO_TEAM=your_team_slug

# GitHub Integration
GITHUB_TOKEN=automatically_provided_by_github
```

#### Application Environment Variables

##### Staging Environment

```bash
# Database
STAGING_DATABASE_URL=postgresql://user:pass@staging-db.finalgolf.com:5432/finalgolf_staging

# Authentication
STAGING_NEXTAUTH_SECRET=staging_nextauth_secret_32_characters_min
STAGING_NEXTAUTH_URL=https://staging.finalgolf.com

# Redis
STAGING_REDIS_URL=redis://staging-redis.finalgolf.com:6379

# Application URLs
STAGING_WEB_URL=https://staging.finalgolf.com
STAGING_API_URL=https://staging-api.finalgolf.com
STAGING_COURSE_ADMIN_URL=https://staging-admin.finalgolf.com
STAGING_PLATFORM_ADMIN_URL=https://staging-platform.finalgolf.com
STAGING_ONSITE_PWA_URL=https://staging-pos.finalgolf.com
```

##### Production Environment

```bash
# Database
PRODUCTION_DATABASE_URL=postgresql://user:pass@prod-db.finalgolf.com:5432/finalgolf_production

# Authentication
PRODUCTION_NEXTAUTH_SECRET=production_nextauth_secret_32_characters_min
PRODUCTION_NEXTAUTH_URL=https://app.finalgolf.com

# Redis
PRODUCTION_REDIS_URL=redis://prod-redis.finalgolf.com:6379

# Application URLs
PRODUCTION_WEB_URL=https://app.finalgolf.com
PRODUCTION_API_URL=https://api.finalgolf.com
PRODUCTION_COURSE_ADMIN_URL=https://admin.finalgolf.com
PRODUCTION_PLATFORM_ADMIN_URL=https://platform.finalgolf.com
PRODUCTION_ONSITE_PWA_URL=https://pos.finalgolf.com
```

## 🔐 Secrets Management

### GitHub Repository Secrets Setup

Navigate to `Settings > Secrets and variables > Actions` in your GitHub repository and add:

#### Core CI/CD Secrets

```bash
# Turborepo (Optional - for faster builds)
TURBO_TOKEN              # Your Turborepo token for remote caching
TURBO_TEAM               # Your team slug for Turborepo

# Container Registry (if using)
REGISTRY_USERNAME        # Container registry username
REGISTRY_PASSWORD        # Container registry password/token
```

#### Staging Environment Secrets

```bash
STAGING_DATABASE_URL     # Staging database connection string
STAGING_NEXTAUTH_SECRET  # NextAuth secret for staging (min 32 characters)
STAGING_REDIS_URL        # Staging Redis connection string
```

#### Production Environment Secrets

```bash
PRODUCTION_DATABASE_URL     # Production database connection string
PRODUCTION_NEXTAUTH_SECRET  # NextAuth secret for production (min 32 characters)
PRODUCTION_REDIS_URL        # Production Redis connection string
```

#### Deployment Secrets (Platform-specific)

```bash
# Add based on your deployment platform
DEPLOY_KEY               # SSH key or API token for deployment
AWS_ACCESS_KEY_ID        # If deploying to AWS
AWS_SECRET_ACCESS_KEY    # If deploying to AWS
CLOUDFLARE_API_TOKEN     # If using Cloudflare
```

### Environment Variables Setup

GitHub repository variables for environment-specific configuration:

#### Staging Variables

```bash
STAGING_WEB_URL=https://staging.finalgolf.com
STAGING_API_URL=https://staging-api.finalgolf.com
STAGING_COURSE_ADMIN_URL=https://staging-admin.finalgolf.com
STAGING_PLATFORM_ADMIN_URL=https://staging-platform.finalgolf.com
STAGING_ONSITE_PWA_URL=https://staging-pos.finalgolf.com
STAGING_DB_URL=https://staging-admin.finalgolf.com/database
```

#### Production Variables

```bash
PRODUCTION_WEB_URL=https://app.finalgolf.com
PRODUCTION_API_URL=https://api.finalgolf.com
PRODUCTION_COURSE_ADMIN_URL=https://admin.finalgolf.com
PRODUCTION_PLATFORM_ADMIN_URL=https://platform.finalgolf.com
PRODUCTION_ONSITE_PWA_URL=https://pos.finalgolf.com
```

### Secret Generation Commands

Use these commands to generate secure secrets:

```bash
# Generate NextAuth secrets (32+ characters)
openssl rand -base64 32

# Generate database passwords
openssl rand -base64 24

# Generate API tokens
openssl rand -hex 32
```

## 🛡️ Branch Protection Rules

### Main Branch Protection

Configure the following protection rules for the `main` branch:

#### Required Checks

- ✅ **CI Pipeline / Validate Workspace**
- ✅ **CI Pipeline / Lint & Format Check**
- ✅ **CI Pipeline / Type Check**
- ✅ **CI Pipeline / Run Tests**
- ✅ **CI Pipeline / Build Validation**
- ✅ **CI Pipeline / Security Audit**

#### Protection Settings

```yaml
# .github/branch-protection.yml (if using probot/settings)
branches:
  - name: main
    protection:
      required_status_checks:
        strict: true
        contexts:
          - "CI Pipeline / CI Summary"
      enforce_admins: false
      required_pull_request_reviews:
        required_approving_review_count: 2
        dismiss_stale_reviews: true
        require_code_owner_reviews: true
      restrictions:
        users: []
        teams: []
      required_linear_history: true
      allow_force_pushes: false
      allow_deletions: false
```

### Develop Branch Protection

Configure protection rules for the `develop` branch:

```yaml
- name: develop
  protection:
    required_status_checks:
      strict: true
      contexts:
        - "CI Pipeline / CI Summary"
    enforce_admins: false
    required_pull_request_reviews:
      required_approving_review_count: 1
      dismiss_stale_reviews: true
    allow_force_pushes: false
    allow_deletions: false
```

## 🌍 Deployment Environments

### Environment Setup

Create the following environments in GitHub (`Settings > Environments`):

#### 1. Staging Environment

- **Environment name**: `staging`
- **Deployment branches**: `develop` branch only
- **Environment secrets**: All `STAGING_*` secrets
- **Protection rules**: No approval required
- **Environment variables**: All `STAGING_*` variables

#### 2. Staging Database Environment

- **Environment name**: `staging-db`
- **Protection rules**: No approval required
- **Environment secrets**: `STAGING_DATABASE_URL`

#### 3. Production Environment

- **Environment name**: `production`
- **Deployment branches**: Tagged releases only
- **Protection rules**:
  - ✅ Required reviewers (2 approvals)
  - ✅ Wait timer (5 minutes)
- **Environment secrets**: All `PRODUCTION_*` secrets
- **Environment variables**: All `PRODUCTION_*` variables

#### 4. Production Database Environment

- **Environment name**: `production-db`
- **Protection rules**:
  - ✅ Required reviewers (2 approvals)
  - ✅ Wait timer (10 minutes)
- **Environment secrets**: `PRODUCTION_DATABASE_URL`

### Application-specific Environments

For each application, create specific environments:

```
staging-web
staging-api
staging-course-admin
staging-platform-admin
staging-onsite-pwa

production-web (protected)
production-api (protected)
production-course-admin (protected)
production-platform-admin (protected)
production-onsite-pwa (protected)
```

## 🔒 Security Configuration

### Security Scanning Schedule

The security scan workflow runs:

- **Weekly**: Every Monday at 3 AM UTC
- **On security-sensitive changes**: Package.json, lock files, Dockerfiles
- **Manual trigger**: Can be run on-demand

### Security Checks Included

1. **Dependency Vulnerability Scanning**
   - PNPM audit for known vulnerabilities
   - License compliance checking
   - High/Critical vulnerability blocking

2. **Code Security Analysis**
   - ESLint security rules
   - Hardcoded secrets detection
   - Dangerous function usage scanning
   - SQL injection pattern detection

3. **Infrastructure Security**
   - Docker security best practices
   - GitHub Actions workflow security
   - Environment configuration validation

### Security Response Process

When security issues are found:

1. **Critical Issues**: Block deployment, require immediate fix
2. **High Issues**: Create security tickets, schedule fix within 24h
3. **Medium Issues**: Create backlog items, fix within 1 week
4. **Low Issues**: Track for future improvement

## 🔧 Workflow Configuration

### Customizing Workflows

#### Environment-specific Customization

Create workflow files for specific needs:

```yaml
# .github/workflows/custom-deployment.yml
name: Custom Deployment

on:
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options: ["staging", "production"]
      component:
        type: string
        description: "Component to deploy"

jobs:
  deploy:
    uses: ./.github/workflows/_template-build-deploy.yml
    with:
      environment: ${{ github.event.inputs.environment }}
      component-name: ${{ github.event.inputs.component }}
      component-type: "app"
      docker-build: true
```

#### Quality Gates Customization

Modify quality thresholds in workflow files:

```yaml
# In CI workflow
coverage-threshold: "85" # Increase coverage requirement
lint-max-warnings: "0" # Zero tolerance for warnings
```

### Performance Optimization

#### Caching Strategy

The workflows implement multi-level caching:

1. **PNPM Store Cache**: Dependency installation cache
2. **Node.js Module Cache**: Built-in Node.js caching
3. **Turborepo Cache**: Build and test result caching
4. **Docker Layer Cache**: Container build optimization

#### Parallel Execution

Workflows use parallel execution where possible:

- **Build Matrix**: Packages, apps, and services build in parallel
- **Test Matrix**: Unit and integration tests run concurrently
- **Quality Checks**: Lint, type-check, and test run in parallel

## 📊 Monitoring and Alerting

### Workflow Monitoring

Monitor workflow performance through:

- **GitHub Actions dashboard**
- **Workflow run history and trends**
- **Cache hit rates and performance**
- **Deployment success rates**

### Alert Configuration

Set up alerts for:

- **Failed deployments**
- **Security scan failures**
- **Performance degradation**
- **Cache miss rates**

### Performance Metrics

Track key metrics:

- **Build time trends**
- **Test execution time**
- **Deployment frequency**
- **Mean time to recovery (MTTR)**
- **Change failure rate**

## 🚨 Troubleshooting

### Common Issues and Solutions

#### 1. Dependency Installation Failures

**Symptoms**: PNPM install fails with lockfile errors

**Solutions**:

```bash
# Clear GitHub Actions cache
# Re-run workflow with cache cleanup
# Update pnpm-lock.yaml locally and commit
```

#### 2. Type Check Failures

**Symptoms**: TypeScript compilation errors in CI

**Solutions**:

```bash
# Ensure Prisma client generation
pnpm run db:generate

# Check local TypeScript version matches CI
pnpm install

# Run type check locally
pnpm run type-check
```

#### 3. Test Failures in CI

**Symptoms**: Tests pass locally but fail in CI

**Solutions**:

- Check environment variable differences
- Verify test database setup
- Review timezone-related issues
- Check for race conditions in parallel tests

#### 4. Docker Build Failures

**Symptoms**: Docker image build fails in CI

**Solutions**:

- Verify Dockerfile exists and is valid
- Check build context and file paths
- Ensure all build dependencies are included
- Review Docker build arguments

#### 5. Deployment Failures

**Symptoms**: Deployment steps fail

**Solutions**:

- Verify environment secrets are correctly set
- Check deployment target accessibility
- Review health check endpoints
- Validate environment variable configuration

### Debug Workflow Runs

Enable debug logging by adding repository secret:

```bash
ACTIONS_STEP_DEBUG=true
ACTIONS_RUNNER_DEBUG=true
```

### Manual Workflow Triggers

Most workflows support manual triggering for debugging:

```bash
# Trigger CI manually
gh workflow run ci.yml

# Trigger security scan
gh workflow run security-scan.yml --field scan_type=comprehensive

# Trigger cache cleanup
gh workflow run cache-cleanup.yml --field cleanup_type=aggressive
```

## 📈 Best Practices

### Development Workflow

1. **Feature Development**:
   - Create feature branch from `develop`
   - CI pipeline validates changes on PR
   - Merge to `develop` triggers staging deployment

2. **Release Process**:
   - Create release branch from `develop`
   - Final testing and bug fixes
   - Merge to `main` and create release tag
   - Tag triggers production deployment

3. **Hotfix Process**:
   - Create hotfix branch from `main`
   - Critical fixes and testing
   - Deploy directly to production
   - Merge back to `develop` and `main`

### Security Best Practices

1. **Secret Management**:
   - Use GitHub secrets for sensitive data
   - Rotate secrets regularly (quarterly)
   - Use environment-specific secrets
   - Never log secrets in workflow output

2. **Dependency Management**:
   - Keep dependencies updated
   - Review security advisories weekly
   - Use lock files for reproducible builds
   - Monitor license compliance

3. **Access Control**:
   - Use least-privilege access
   - Require code reviews for changes
   - Protect main/develop branches
   - Use environment protection rules

### Performance Best Practices

1. **Optimize Build Times**:
   - Use parallel execution
   - Implement effective caching
   - Minimize Docker layers
   - Use build matrices efficiently

2. **Resource Management**:
   - Monitor workflow costs
   - Clean up old caches regularly
   - Use appropriate timeouts
   - Optimize test execution

## 🎯 Next Steps

After setting up the CI/CD pipeline:

1. **Configure Repository Settings**:
   - Set up branch protection rules
   - Add required secrets and variables
   - Create deployment environments

2. **Validate Workflows**:
   - Test CI pipeline with a sample PR
   - Validate staging deployment
   - Perform security scan

3. **Team Training**:
   - Train team on workflow usage
   - Establish deployment procedures
   - Set up monitoring and alerting

4. **Continuous Improvement**:
   - Monitor performance metrics
   - Gather team feedback
   - Optimize workflow performance
   - Update documentation

---

**📚 Related Documentation**:

- [Environment Variables Guide](ENVIRONMENT_VARIABLES.md)
- [Git Workflow Guide](GIT_WORKFLOW.md)
- [Branch Protection Setup](BRANCH_PROTECTION.md)

**🛟 Support**: For CI/CD pipeline issues, create an issue with the `ci-cd` label and include workflow run links and error messages.
