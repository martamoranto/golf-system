#!/bin/bash
# Docker Development Environment Management Script
# Final Golf SaaS - Docker Compose Management

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

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log $RED "❌ Docker is not running. Please start Docker Desktop first."
        exit 1
    fi
}

# Function to check if docker-compose is available
check_compose() {
    if ! command -v docker-compose &> /dev/null; then
        if ! docker compose version &> /dev/null; then
            log $RED "❌ Docker Compose is not available. Please install Docker Compose."
            exit 1
        else
            COMPOSE_CMD="docker compose"
        fi
    else
        COMPOSE_CMD="docker-compose"
    fi
}

# Function to show service status
show_status() {
    log $BLUE "📊 Final Golf SaaS - Service Status"
    log $BLUE "=================================="
    
    $COMPOSE_CMD ps
    
    echo ""
    log $PURPLE "🔗 Service URLs:"
    echo "  🐘 PostgreSQL:     localhost:5432 (postgres/postgres123)"
    echo "  📦 Redis:          localhost:6379"
    echo "  🗄️  MinIO Console:  http://localhost:9001 (minioadmin/minioadmin123)"
    echo "  🗄️  MinIO API:      http://localhost:9000"
    echo "  📧 Mailpit:        http://localhost:8025"
    echo "  🎛️  Adminer:        http://localhost:8082"
    echo "  📊 RedisInsight:    http://localhost:8081"
}

# Function to show logs
show_logs() {
    local service=$1
    if [ -z "$service" ]; then
        log $BLUE "📜 Showing logs for all services..."
        $COMPOSE_CMD logs -f --tail=50
    else
        log $BLUE "📜 Showing logs for $service..."
        $COMPOSE_CMD logs -f --tail=50 $service
    fi
}

# Function to start services
start_services() {
    log $BLUE "🚀 Starting Final Golf SaaS development environment..."
    
    # Create necessary directories
    mkdir -p docker/postgres/init
    mkdir -p docker/redis
    mkdir -p docker/minio/policies
    
    # Start services
    $COMPOSE_CMD up -d
    
    log $GREEN "✅ Services started successfully!"
    
    # Wait for services to be healthy
    log $YELLOW "⏳ Waiting for services to be ready..."
    sleep 10
    
    # Check health status
    check_health
    
    show_status
}

# Function to stop services
stop_services() {
    log $YELLOW "🛑 Stopping Final Golf SaaS development environment..."
    $COMPOSE_CMD down
    log $GREEN "✅ Services stopped successfully!"
}

# Function to restart services
restart_services() {
    log $YELLOW "🔄 Restarting Final Golf SaaS development environment..."
    $COMPOSE_CMD restart
    log $GREEN "✅ Services restarted successfully!"
    show_status
}

# Function to check service health
check_health() {
    log $BLUE "🏥 Health Check Status:"
    log $BLUE "======================"
    
    # Check PostgreSQL
    if docker exec gbs-postgres pg_isready -U postgres -d final_golf_dev > /dev/null 2>&1; then
        log $GREEN "✅ PostgreSQL: Healthy"
    else
        log $RED "❌ PostgreSQL: Unhealthy"
    fi
    
    # Check Redis
    if docker exec gbs-redis redis-cli ping > /dev/null 2>&1; then
        log $GREEN "✅ Redis: Healthy"
    else
        log $RED "❌ Redis: Unhealthy"
    fi
    
    # Check MinIO
    if docker exec gbs-minio curl -f http://localhost:9000/minio/health/live > /dev/null 2>&1; then
        log $GREEN "✅ MinIO: Healthy"
    else
        log $RED "❌ MinIO: Unhealthy"
    fi
    
    # Check Mailpit
    if curl -f http://localhost:8025 > /dev/null 2>&1; then
        log $GREEN "✅ Mailpit: Healthy"
    else
        log $RED "❌ Mailpit: Unhealthy"
    fi
}

# Function to reset all data
reset_data() {
    log $YELLOW "⚠️  This will delete all database data, Redis cache, and MinIO files!"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log $YELLOW "🗑️  Resetting all data..."
        $COMPOSE_CMD down -v
        docker volume prune -f
        log $GREEN "✅ All data reset successfully!"
        log $BLUE "Run '$0 up' to start fresh services."
    else
        log $BLUE "❌ Data reset cancelled."
    fi
}

# Function to setup MinIO buckets
setup_minio() {
    log $BLUE "🗄️  Setting up MinIO buckets..."
    
    # Wait for MinIO to be ready
    sleep 5
    
    # Create buckets using MinIO client
    docker exec gbs-minio mc alias set local http://localhost:9000 minioadmin minioadmin123
    docker exec gbs-minio mc mb local/golf-uploads --ignore-existing
    docker exec gbs-minio mc mb local/golf-public --ignore-existing
    
    # Set bucket policies
    docker exec gbs-minio mc anonymous set public local/golf-public
    
    log $GREEN "✅ MinIO buckets configured successfully!"
}

# Function to show usage
show_help() {
    log $BLUE "🏌️ Final Golf SaaS - Docker Development Environment"
    log $BLUE "=================================================="
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  up, start       Start all services"
    echo "  down, stop      Stop all services"
    echo "  restart         Restart all services"
    echo "  status          Show service status and URLs"
    echo "  logs [service]  Show logs (all services or specific service)"
    echo "  health          Check service health status"
    echo "  reset           Reset all data (destructive)"
    echo "  setup-minio     Setup MinIO buckets and policies"
    echo "  help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 up           # Start all services"
    echo "  $0 logs redis   # Show Redis logs"
    echo "  $0 health       # Check all service health"
}

# Main execution
main() {
    check_docker
    check_compose
    
    case "${1:-help}" in
        "up"|"start")
            start_services
            setup_minio
            ;;
        "down"|"stop")
            stop_services
            ;;
        "restart")
            restart_services
            ;;
        "status")
            show_status
            ;;
        "logs")
            show_logs $2
            ;;
        "health")
            check_health
            ;;
        "reset")
            reset_data
            ;;
        "setup-minio")
            setup_minio
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

main "$@"