#!/bin/bash
# Development Environment Setup Script
# Final Golf SaaS - Monorepo Development Setup

set -e

echo "🏌️ Final Golf SaaS - Development Setup"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check Node.js version
echo -e "${BLUE}Checking Node.js version...${NC}"
NODE_VERSION=$(node --version | sed 's/v//')
REQUIRED_NODE="18.17.0"

if [ "$(printf '%s\n' "$REQUIRED_NODE" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_NODE" ]; then
    echo -e "${RED}❌ Node.js version $NODE_VERSION is too old. Please install Node.js >= $REQUIRED_NODE${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js version $NODE_VERSION is compatible${NC}"

# Check pnpm
echo -e "${BLUE}Checking pnpm installation...${NC}"
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm is not installed. Installing pnpm...${NC}"
    npm install -g pnpm@latest
fi

PNPM_VERSION=$(pnpm --version)
echo -e "${GREEN}✅ pnpm version $PNPM_VERSION is installed${NC}"

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
pnpm install

# Generate database client (if database package exists)
echo -e "${BLUE}Setting up database...${NC}"
pnpm db:generate

echo ""
echo -e "${GREEN}🎉 Development environment setup complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Start development servers: ${GREEN}pnpm dev${NC}"
echo "  2. View available scripts: ${GREEN}pnpm run${NC}"
echo "  3. Open web app: ${GREEN}http://localhost:3000${NC}"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo "  ${GREEN}pnpm dev${NC}              - Start all development servers"
echo "  ${GREEN}pnpm dev:web${NC}          - Start only web app"
echo "  ${GREEN}pnpm build${NC}            - Build all packages"
echo "  ${GREEN}pnpm test${NC}             - Run all tests"
echo "  ${GREEN}pnpm clean${NC}            - Clean build artifacts"
echo "  ${GREEN}pnpm reset${NC}            - Reset and reinstall everything"
echo ""