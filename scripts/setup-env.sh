#!/bin/bash
# Environment Setup Script for Final Golf SaaS
# Sets up environment files with development defaults

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored output
log() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Check if we're in the correct directory
if [ ! -f "package.json" ] || [ ! -d "apps" ]; then
    log $RED "❌ Please run this script from the project root directory"
    exit 1
fi

log $BLUE "🔧 Final Golf SaaS - Environment Setup"
log $BLUE "====================================="

# Function to copy env file if it doesn't exist
setup_env_file() {
    local service_path=$1
    local env_name=$2
    
    if [ -d "$service_path" ]; then
        if [ -f "$service_path/.env.example" ]; then
            if [ ! -f "$service_path/$env_name" ]; then
                cp "$service_path/.env.example" "$service_path/$env_name"
                log $GREEN "✅ Created $service_path/$env_name"
            else
                log $YELLOW "⚠️  $service_path/$env_name already exists, skipping"
            fi
        else
            log $YELLOW "⚠️  $service_path/.env.example not found"
        fi
    else
        log $YELLOW "⚠️  Service directory $service_path not found"
    fi
}

log $BLUE "\n📋 Setting up environment files..."

# Setup app environment files
log $PURPLE "Setting up application environments:"
setup_env_file "apps/web" ".env.local"
setup_env_file "apps/api" ".env"
setup_env_file "apps/onsite-pwa" ".env.local"
setup_env_file "apps/course-admin" ".env.local"
setup_env_file "apps/platform-admin" ".env.local"

# Setup service environment files
log $PURPLE "\nSetting up service environments:"
setup_env_file "services/worker" ".env"
setup_env_file "services/webhooks" ".env"
setup_env_file "services/scheduler" ".env"
setup_env_file "services/realtime" ".env"

# Create root environment file for Docker Compose
if [ ! -f ".env" ]; then
    if [ -f ".env.docker" ]; then
        cp ".env.docker" ".env"
        log $GREEN "✅ Created root .env from .env.docker"
    else
        log $YELLOW "⚠️  .env.docker not found, creating basic .env"
        cat > .env << EOF
# Final Golf SaaS - Root Environment Configuration
NODE_ENV=development

# Docker Compose Configuration
COMPOSE_PROJECT_NAME=final-golf-saas
COMPOSE_FILE=docker-compose.yml

# Database Configuration
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/final_golf_dev

# Redis Configuration  
REDIS_URL=redis://localhost:6379

# MinIO Configuration
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin123
EOF
        log $GREEN "✅ Created basic root .env"
    fi
else
    log $YELLOW "⚠️  Root .env already exists, skipping"
fi

log $BLUE "\n🔍 Validating environment configuration..."

# Run environment validation if Node.js script exists
if [ -f "scripts/validate-env.js" ]; then
    if command -v node &> /dev/null; then
        node scripts/validate-env.js
    else
        log $YELLOW "⚠️  Node.js not found, skipping validation"
    fi
else
    log $YELLOW "⚠️  Validation script not found"
fi

log $BLUE "\n🎯 Next Steps:"
log $WHITE "============="
log $GREEN "1. 🚀 Start Docker services:"
log $WHITE "   pnpm services:up"

log $GREEN "\n2. 🔑 Generate secure secrets for production:"
log $WHITE "   node scripts/validate-env.js --generate-secrets"

log $GREEN "\n3. ✏️  Update environment variables:"
log $WHITE "   • Payment provider keys (PayMongo, Stripe)"
log $WHITE "   • OAuth client secrets (Google, Facebook)"
log $WHITE "   • SMTP configuration for emails"
log $WHITE "   • SMS provider credentials"

log $GREEN "\n4. 📖 Read the documentation:"
log $WHITE "   • docs/ENVIRONMENT_VARIABLES.md - Complete reference"
log $WHITE "   • DOCKER.md - Docker setup guide"

log $GREEN "\n5. 🔍 Validate configuration:"
log $WHITE "   npm run env:validate"

log $BLUE "\n✅ Environment setup completed!"
log $WHITE "You can now start developing with 'pnpm dev'"