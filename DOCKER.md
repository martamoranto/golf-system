# 🐳 Final Golf SaaS - Docker Development Environment

Comprehensive containerized development environment with PostgreSQL, Redis, MinIO, and email testing.

## 🚀 Quick Start

### **Start Development Environment**
```bash
# Start all services
pnpm services:up
# or
pnpm docker:up

# Check service status
pnpm services:status

# View logs
pnpm docker:logs
```

### **Stop Environment**
```bash
# Stop all services
pnpm services:down
# or
pnpm docker:down
```

## 📋 Services Overview

| Service | Port | Purpose | Access |
|---------|------|---------|--------|
| **PostgreSQL 15** | 5432 | Primary database | `postgres:postgres123@localhost:5432/final_golf_dev` |
| **Redis 7** | 6379 | Caching & sessions | `redis://localhost:6379` |
| **MinIO** | 9000/9001 | S3-compatible storage | Console: http://localhost:9001 |
| **Mailhog** | 1025/8025 | Email testing | UI: http://localhost:8025 |
| **Adminer** | 8080 | Database admin | http://localhost:8080 |
| **Redis Commander** | 8081 | Redis admin | http://localhost:8081 |

## 🔧 Service Details

### **PostgreSQL 15**
- **Container**: `final-golf-postgres`
- **Database**: `final_golf_dev`
- **User**: `postgres`
- **Password**: `postgres123`
- **Extensions**: uuid-ossp, pg_stat_statements, pg_trgm, citext
- **Performance**: Optimized for development with 256MB shared buffers
- **Health Check**: Automatic readiness checks every 10s

**Connection Examples:**
```bash
# Using psql
psql -h localhost -U postgres -d final_golf_dev

# Connection string
postgresql://postgres:postgres123@localhost:5432/final_golf_dev
```

### **Redis 7**
- **Container**: `final-golf-redis`
- **Memory Limit**: 256MB with LRU eviction
- **Persistence**: RDB + AOF for development safety
- **Configuration**: Optimized for session storage and caching
- **Health Check**: Ping every 10s

**Connection Examples:**
```bash
# Using redis-cli
redis-cli -h localhost -p 6379

# Connection string
redis://localhost:6379
```

### **MinIO (S3-Compatible Storage)**
- **Container**: `final-golf-minio`
- **Console**: http://localhost:9001
- **API**: http://localhost:9000
- **Credentials**: `minioadmin / minioadmin123`
- **Buckets**: `golf-uploads` (private), `golf-public` (public)
- **Health Check**: Live endpoint monitoring

**Pre-configured Buckets:**
- `golf-uploads` - Private bucket for user uploads
- `golf-public` - Public bucket for static assets

### **Mailhog (Email Testing)**
- **Container**: `final-golf-mailhog`
- **SMTP**: localhost:1025
- **Web UI**: http://localhost:8025
- **Purpose**: Catch and display all outbound emails during development

### **Adminer (Database Admin)**
- **Container**: `final-golf-adminer`
- **URL**: http://localhost:8080
- **Login**: Use PostgreSQL credentials
- **Features**: Full database administration interface

### **Redis Commander (Redis Admin)**
- **Container**: `final-golf-redis-commander`
- **URL**: http://localhost:8081
- **Login**: `admin / admin123`
- **Features**: Redis key browsing and management

## 💾 Data Persistence

### **Named Volumes**
```yaml
# Persistent data storage
final-golf-postgres-data  # PostgreSQL data
final-golf-redis-data     # Redis persistence
final-golf-minio-data     # MinIO object storage
```

### **Volume Management**
```bash
# List volumes
docker volume ls | grep final-golf

# Inspect volume
docker volume inspect final-golf-postgres-data

# Remove all volumes (destructive)
pnpm docker:reset
```

## 🌐 Networking

### **Custom Network**
- **Network**: `final-golf-network` (bridge mode)
- **Subnet**: 172.20.0.0/16
- **Gateway**: 172.20.0.1

### **Container Communication**
Services can communicate using container names:
```typescript
// Example connections from app containers
const dbUrl = 'postgresql://postgres:postgres123@postgres:5432/final_golf_dev'
const redisUrl = 'redis://redis:6379'
const minioEndpoint = 'http://minio:9000'
const smtpHost = 'mailhog'
const smtpPort = 1025
```

## 🏥 Health Monitoring

### **Health Check Status**
```bash
# Check all service health
pnpm docker:health

# View detailed container status
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Monitor health in real-time
watch -n 5 'pnpm docker:health'
```

### **Health Check Endpoints**
- **PostgreSQL**: `pg_isready` command
- **Redis**: `PING` command
- **MinIO**: `/minio/health/live` endpoint
- **Mailhog**: Web UI availability
- **Adminer**: HTTP response check
- **Redis Commander**: HTTP response check

## 📊 Logging & Monitoring

### **View Logs**
```bash
# All services
pnpm docker:logs

# Specific service
pnpm docker:logs postgres
pnpm docker:logs redis
pnpm docker:logs minio

# Follow logs in real-time
docker-compose logs -f --tail=100
```

### **Performance Monitoring**
```bash
# Container resource usage
docker stats

# PostgreSQL performance
docker exec final-golf-postgres psql -U postgres -d final_golf_dev -c "SELECT * FROM pg_stat_statements LIMIT 10;"

# Redis info
docker exec final-golf-redis redis-cli info
```

## 🛠️ Development Workflows

### **Daily Development**
```bash
# Start environment
pnpm services:up

# Start your apps
pnpm dev

# View email testing
open http://localhost:8025

# Database admin
open http://localhost:8080
```

### **Database Operations**
```bash
# Run migrations
pnpm db:migrate:dev

# Seed database
pnpm db:seed

# Database studio (Prisma)
pnpm db:studio

# Database admin (Adminer)
open http://localhost:8080
```

### **File Storage Testing**
```bash
# MinIO console
open http://localhost:9001

# Upload test file via API
curl -X PUT \
  -H "Content-Type: application/octet-stream" \
  --data-binary @test-file.jpg \
  http://minioadmin:minioadmin123@localhost:9000/golf-uploads/test-file.jpg
```

## 🚨 Troubleshooting

### **Common Issues**

#### **Services Won't Start**
```bash
# Check Docker is running
docker info

# Check port conflicts
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis
lsof -i :9000  # MinIO

# View detailed logs
docker-compose logs postgres
```

#### **Database Connection Issues**
```bash
# Test PostgreSQL connection
docker exec final-golf-postgres pg_isready -U postgres

# Test from host
psql -h localhost -U postgres -d final_golf_dev

# Check PostgreSQL logs
pnpm docker:logs postgres
```

#### **Redis Connection Issues**
```bash
# Test Redis connection
docker exec final-golf-redis redis-cli ping

# Test from host
redis-cli -h localhost ping

# Check Redis logs
pnpm docker:logs redis
```

#### **MinIO Access Issues**
```bash
# Check MinIO health
curl http://localhost:9000/minio/health/live

# Reset MinIO admin password
docker exec final-golf-minio mc admin user add local newuser newpassword

# Check MinIO logs
pnpm docker:logs minio
```

### **Performance Issues**
```bash
# Check container resource usage
docker stats

# Restart specific service
docker-compose restart postgres

# Restart all services
pnpm docker:restart
```

### **Reset Everything**
```bash
# Nuclear option - removes all data
pnpm docker:reset

# Then restart fresh
pnpm services:up
```

## 🔒 Security Considerations

### **Development Security**
- Default passwords are used for convenience in development
- Services are exposed on localhost only
- No authentication required for most services

### **Production Changes Needed**
- Change all default passwords
- Enable Redis authentication
- Configure proper MinIO access keys
- Set up SSL/TLS certificates
- Restrict network access
- Enable PostgreSQL SSL

## 📈 Performance Tuning

### **PostgreSQL Tuning**
Current settings optimized for development:
- `shared_buffers = 256MB`
- `max_connections = 200`
- `effective_cache_size = 1GB`

### **Redis Tuning**
Current settings:
- `maxmemory = 256MB`
- `maxmemory-policy = allkeys-lru`
- Persistence enabled for safety

### **MinIO Tuning**
- Default settings suitable for development
- Consider increasing memory for production

## 🧪 Testing Integration

### **Database Testing**
```bash
# Create test database
docker exec final-golf-postgres createdb -U postgres final_golf_test

# Run tests with test database
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/final_golf_test pnpm test
```

### **Email Testing**
```bash
# Send test email
curl -X POST http://localhost:1025/api/v1/messages

# View emails in browser
open http://localhost:8025
```

### **File Upload Testing**
```bash
# Test MinIO upload
curl -X PUT -T test.jpg http://minioadmin:minioadmin123@localhost:9000/golf-uploads/test.jpg
```

---

## 💡 Pro Tips

1. **Use container names** for internal service communication
2. **Check health status** before debugging connection issues
3. **Use named volumes** to persist data between container restarts
4. **Monitor logs** during development for early issue detection
5. **Reset data** when schema changes significantly
6. **Use Adminer** for database inspection and queries
7. **Use Mailhog** to test all email workflows without spam
8. **Use MinIO console** to manage file uploads and permissions

---

**Remember**: This is a development environment. Production deployments require additional security, monitoring, and performance configurations.