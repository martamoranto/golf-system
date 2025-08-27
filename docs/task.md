# 🏌️ Golf Booking SaaS - Complete Task List (Revised with Clean Architecture)

## Phase 0: Foundation & Monorepo Setup (Week 1)

### 0.1 Monorepo Initialization

- [x] **0.1.1** Initialize PNPM workspace
  - Create pnpm-workspace.yaml with apps/* and packages/* patterns
  - Configure dependency hoisting strategy
  - Set strict peer dependencies configuration
  - Setup shared dependencies at root level

- [x] **0.1.2** Configure Turborepo
  - Create turbo.json with pipeline definitions
  - Setup dev pipeline with proper task dependencies
  - Configure build pipeline with caching
  - Setup test, lint, and typecheck pipelines
  - Configure remote caching for CI/CD

- [x] **0.1.3** TypeScript Configuration
  - Create tsconfig.base.json at root
  - Setup path aliases for all packages (@gbs/*)
  - Configure strict mode and compiler options
  - Create individual tsconfig.json files extending base
  - Setup tsconfig.build.json for production builds

- [x] **0.1.4** Root package scripts
  - Setup development scripts for parallel execution
  - Configure build scripts with proper ordering
  - Add database management scripts (generate, migrate, seed)
  - Setup testing and linting scripts
  - Add cleanup and reset scripts

### 0.2 Development Environment

- [ ] **0.2.1** Docker Compose Setup
  - Configure PostgreSQL 15 container with health checks
  - Setup Redis container with persistence volume
  - Add MinIO container for S3-compatible storage
  - Configure Mailhog for email testing
  - Setup networking between containers
  - Create volume mappings for data persistence

- [ ] **0.2.2** Environment Configuration
  - Create .env.example templates for all apps
  - Document all required environment variables
  - Setup environment validation scripts
  - Configure local development defaults
  - Create environment setup documentation

- [ ] **0.2.3** Git Configuration
  - Initialize repository with comprehensive .gitignore
  - Setup Husky for git hooks
  - Configure commitlint for conventional commits
  - Setup lint-staged for pre-commit checks
  - Create branch protection rules documentation

- [ ] **0.2.4** CI/CD Foundation
  - Setup GitHub Actions workflow structure
  - Configure dependency caching
  - Create reusable workflow templates
  - Setup environment secrets management
  - Configure deployment triggers

## Phase 1: Core Packages Setup (Week 1-2)

### 1.1 Database Package (`packages/database`)

- [ ] **1.1.1** Prisma Setup
  - Install Prisma and Prisma Client dependencies
  - Copy provided schema.prisma file
  - Configure database connection string
  - Setup Prisma generate and migration scripts
  - Configure Prisma Studio for development

- [ ] **1.1.2** Database Client Singleton (`src/index.ts`)
  - Create singleton PrismaClient instance
  - Configure connection pooling settings
  - Add query logging for development
  - Implement global error handling
  - Setup graceful shutdown handlers
  - Export db instance for services

- [ ] **1.1.3** Transaction Helpers (`src/tx.ts`)
  - Implement transaction wrapper with retry logic
  - Configure serializable isolation helpers
  - Add deadlock detection and retry mechanism
  - Setup transaction timeout configurations
  - Create rollback error handlers

- [ ] **1.1.4** Tenant Isolation Middleware (`src/middleware.ts`)
  - Create Prisma middleware for automatic tenant filtering
  - Implement tenant context injection
  - Add tenant validation checks
  - Setup cross-tenant query prevention
  - Create tenant override utilities for admin

- [ ] **1.1.5** Seed Data System (`src/seed/`)
  - Create comprehensive seed data for demo tenant
  - Generate 14-day tee sheet with realistic slots
  - Create sample users with different roles
  - Add demo bookings with various statuses
  - Setup sample inventory and POS data
  - Generate classified listings samples
  - Create coach profiles with availability

### 1.2 Schemas Package (`packages/schemas`)

- [ ] **1.2.1** Common Schema Components (`common.ts`)
  - Define reusable ID validators (CUID, UUID)
  - Create email and phone validators with regex
  - Setup money/decimal validators with precision
  - Define datetime validators with timezone support
  - Create pagination schema with cursor support
  - Add common error response schemas

- [ ] **1.2.2** Auth Schemas (`auth.ts`)
  - Customer registration schema with validation rules
  - Email/password login schema
  - Social auth callback schemas (Google, Facebook, Apple)
  - Staff PIN login schema with course context
  - Token refresh schema
  - Password reset request/confirm schemas
  - Session validation schemas
  - Role-based permission schemas

- [ ] **1.2.3** Booking Schemas (`booking.ts`)
  - Availability check input/output schemas
  - Slot selection with capacity validation
  - Multi-step booking creation schemas
  - Participant information schemas
  - Add-on selection schemas (caddy, cart, locker)
  - Booking confirmation schemas
  - Cancellation request schemas with reason
  - Reschedule request with availability check
  - Booking list/filter schemas

- [ ] **1.2.4** Payment Schemas (`payment.ts`)
  - Payment intent creation schemas
  - Payment method selection schemas
  - Payment confirmation with PSP data
  - Webhook payload validation schemas
  - Refund request schemas (full/partial)
  - Payment status query schemas
  - Receipt generation schemas
  - Ledger entry schemas

- [ ] **1.2.5** Tee Sheet Schemas (`teesheet.ts`)
  - Tee block creation with time validation
  - Slot generation configuration schemas
  - Blackout date/time range schemas
  - Pricing configuration schemas
  - Bulk update operation schemas
  - Day/week/month view query schemas
  - Utilization report schemas

- [ ] **1.2.6** Resource Schemas (`resource.ts`)
  - Resource creation schemas for each type
  - Status update schemas with validation
  - Assignment request schemas
  - Availability query schemas
  - Bulk assignment schemas
  - Resource utilization report schemas

- [ ] **1.2.7** POS Schemas (`pos.ts`)
  - Walk-in booking schemas
  - POS order creation schemas
  - Inventory item schemas with SKU
  - Stock transaction schemas
  - Cash reconciliation schemas
  - Receipt printing schemas

- [ ] **1.2.8** Coach & Lesson Schemas (`coach.ts`)
  - Coach profile schemas
  - Availability slot schemas
  - Lesson booking schemas
  - Lesson status update schemas
  - Student progress schemas

- [ ] **1.2.9** Classified Schemas (`classified.ts`)
  - Listing creation with category validation
  - Photo upload schemas
  - Moderation action schemas
  - Message thread schemas
  - Search filter schemas

- [ ] **1.2.10** Admin & Reporting Schemas (`admin.ts`)
  - Tenant management schemas
  - User role assignment schemas
  - Report parameter schemas
  - Export format schemas
  - Audit log query schemas

### 1.3 Types Package (`packages/types`)

- [ ] **1.3.1** Derive Types from Schemas
  - Generate TypeScript types from all Zod schemas
  - Create type export index files
  - Setup automatic type generation scripts
  - Document type usage patterns
  - Create type guard utilities

### 1.4 Services Package (`packages/services`)

- [ ] **1.4.1** Auth Service (`auth.ts`)
  - Implement customer registration with email verification
  - Create login service with JWT generation
  - Implement social auth provider integrations
  - Create staff PIN authentication with rate limiting
  - Build token refresh mechanism
  - Implement password reset flow
  - Add session management utilities
  - Create RBAC permission checking

- [ ] **1.4.2** Booking Service (`booking.ts`)
  - `checkAvailability()` - Query real-time slot availability
  - `createBookingHold()` - Create 120-second Redis slot lock
  - `confirmBooking()` - Convert hold to confirmed booking
  - `getBookingById()` - Retrieve full booking details
  - `listUserBookings()` - Paginated user bookings
  - `cancelBooking()` - Cancel with policy enforcement
  - `rescheduleBooking()` - Move to new slot
  - `markNoShow()` - Mark and release resources
  - `addParticipants()` - Add to existing booking
  - `updateAddOns()` - Modify resources

- [ ] **1.4.3** Reservation Service (`reservation.ts`)
  - `holdSlot()` - Atomic Redis slot locking
  - `releaseSlot()` - Release expired holds
  - `extendHold()` - Extend during checkout
  - `checkSlotCapacity()` - Real-time availability
  - `bulkCheckAvailability()` - Multiple slot check
  - `getSlotsByDateRange()` - Filtered slot query
  - `blockSlots()` - Admin slot blocking

- [ ] **1.4.4** Payment Service (`payment.ts`)
  - PSP abstraction layer implementation
  - `createPaymentIntent()` - Initialize payment
  - `confirmPayment()` - Process payment confirmation
  - `handleWebhook()` - Process PSP webhooks
  - `processRefund()` - Handle refund requests
  - `retryFailedPayment()` - Retry mechanism
  - `generateReceipt()` - Create receipts
  - `createLedgerEntry()` - Record transactions

- [ ] **1.4.5** TeeSheet Service (`teesheet.ts`)
  - `createTeeBlock()` - Generate time blocks
  - `generateSlots()` - Create bookable slots
  - `applyBlackouts()` - Block unavailable times
  - `updatePricing()` - Modify slot prices
  - `bulkUpdateSlots()` - Mass operations
  - `calculateUtilization()` - Usage metrics
  - `detectConflicts()` - Prevent double-booking

- [ ] **1.4.6** Resource Service (`resource.ts`)
  - `createResource()` - Add new resources
  - `updateResourceStatus()` - Status management
  - `assignResource()` - Attach to booking
  - `checkResourceAvailability()` - Query available
  - `releaseResources()` - Free on cancellation
  - `swapResource()` - Change assignment
  - `getResourceUtilization()` - Usage reports

- [ ] **1.4.7** POS Service (`pos.ts`)
  - `createQuickBooking()` - Walk-in bookings
  - `processOrder()` - Handle POS orders
  - `capturePayment()` - Process payments
  - `updateInventory()` - Stock management
  - `generateReceipt()` - Create receipts
  - `reconcileCash()` - Daily reconciliation

- [ ] **1.4.8** Coach Service (`coach.ts`)
  - `manageCoachProfile()` - Profile CRUD
  - `setAvailability()` - Schedule management
  - `bookLesson()` - Create lesson booking
  - `checkScheduleConflict()` - Prevent overlaps
  - `cancelLesson()` - Cancel with notification
  - `getCoachSchedule()` - View calendar

- [ ] **1.4.9** Classified Service (`classified.ts`)
  - `createListing()` - Post new item
  - `moderateListing()` - Approve/reject
  - `sendMessage()` - Inter-user messaging
  - `searchListings()` - Filter and search
  - `expireListings()` - Auto-expiration
  - `flagContent()` - Report inappropriate

- [ ] **1.4.10** Notification Service (`notification.ts`)
  - `sendEmail()` - Email delivery
  - `sendSMS()` - SMS delivery
  - `queueNotification()` - Queue management
  - `trackDelivery()` - Delivery status
  - `retryFailed()` - Retry logic
  - `processTemplates()` - Template engine

- [ ] **1.4.11** Analytics Service (`analytics.ts`)
  - `generateBookingMetrics()` - Booking analytics
  - `calculateRevenue()` - Financial metrics
  - `getUtilizationStats()` - Usage analytics
  - `segmentCustomers()` - Customer analysis
  - `analyzeTrends()` - Trend detection

### 1.5 Auth Package (`packages/auth`)

- [ ] **1.5.1** NextAuth Configuration (`nextauth.ts`)
  - Setup NextAuth with custom Prisma adapter
  - Configure credential provider for email/password
  - Setup OAuth providers (Google, Facebook, Apple)
  - Implement JWT strategy with custom claims
  - Configure session handling with tenant context
  - Setup secure cookies and CSRF protection

- [ ] **1.5.2** NextAuth Callbacks (`callbacks.ts`)
  - Implement jwt callback for token customization
  - Create session callback for tenant/role injection
  - Setup signIn callback for validation
  - Implement redirect callback for role routing
  - Add events for audit logging

- [ ] **1.5.3** Custom Auth Pages (`pages/`)
  - Create custom signin page
  - Build registration page
  - Implement error page
  - Add verify-request page
  - Create new-user onboarding

- [ ] **1.5.4** JWT Management (`jwt.ts`)
  - Token generation with custom claims
  - Token validation middleware
  - Refresh token implementation
  - Token expiration handling
  - Blacklist management

- [ ] **1.5.5** PIN Authentication (`pin-auth.ts`)
  - PIN hashing with argon2
  - Rate limiting implementation (5 attempts)
  - Device binding logic
  - Lockout mechanism (10 minutes)
  - PIN rotation system (90 days)

- [ ] **1.5.6** RBAC System (`rbac.ts`)
  - Permission matrix definitions
  - Role inheritance logic
  - Permission checking utilities
  - Dynamic permission loading
  - Permission caching

- [ ] **1.5.7** Session Management (`session.ts`)
  - Redis session storage
  - Session validation
  - Device tracking
  - Concurrent session limits
  - Session termination

### 1.6 tRPC Package (`packages/trpc`)

- [ ] **1.6.1** tRPC Server Setup (`server/trpc.ts`)
  - Initialize tRPC with typed context
  - Setup error formatter
  - Configure middleware stack
  - Add request logging
  - Implement rate limiting

- [ ] **1.6.2** Context Creation (`server/context.ts`)
  - Extract auth from request
  - Inject tenant context
  - Add database connection
  - Setup request ID
  - Add user session

- [ ] **1.6.3** Auth Router (`server/routers/auth.ts`)
  - `auth.register` - Customer registration
  - `auth.login` - Email/password login
  - `auth.socialLogin` - OAuth login
  - `auth.pinLogin` - Staff PIN login
  - `auth.refresh` - Token refresh
  - `auth.logout` - Session termination
  - `auth.resetPassword` - Password reset
  - `auth.verifyEmail` - Email verification

- [ ] **1.6.4** Booking Router (`server/routers/booking.ts`)
  - **Public procedures:**
    - `booking.checkAvailability` - Get available slots
    - `booking.getCalendarView` - Month availability
    - `booking.createHold` - Create slot hold
    - `booking.extendHold` - Extend hold time
  - **Authenticated procedures:**
    - `booking.create` - Create booking
    - `booking.confirm` - Confirm with payment
    - `booking.list` - User's bookings
    - `booking.get` - Single booking details
    - `booking.cancel` - Cancel booking
    - `booking.reschedule` - Change slot
    - `booking.updateParticipants` - Edit guests
    - `booking.updateAddOns` - Modify resources
  - **Admin procedures:**
    - `booking.admin.list` - All bookings
    - `booking.admin.create` - Manual booking
    - `booking.admin.update` - Edit any
    - `booking.admin.forceCancel` - Override cancel
    - `booking.admin.markNoShow` - No-show marking
    - `booking.admin.bulkUpdate` - Mass operations

- [ ] **1.6.5** TeeSheet Router (`server/routers/teesheet.ts`)
  - `teesheet.createBlock` - Add time blocks
  - `teesheet.updateSlots` - Modify slots
  - `teesheet.setBlackout` - Block dates
  - `teesheet.updatePricing` - Change prices
  - `teesheet.getDayView` - Daily schedule
  - `teesheet.getWeekView` - Weekly view
  - `teesheet.bulkOperations` - Mass updates

- [ ] **1.6.6** Payment Router (`server/routers/payment.ts`)
  - `payment.createIntent` - Initialize payment
  - `payment.confirm` - Confirm payment
  - `payment.getStatus` - Check status
  - `payment.requestRefund` - Initiate refund
  - `payment.getReceipt` - Get receipt
  - `payment.listTransactions` - Transaction history

- [ ] **1.6.7** Resource Router (`server/routers/resource.ts`)
  - `resource.listCaddies` - Available caddies
  - `resource.listCarts` - Available carts
  - `resource.assign` - Assign to booking
  - `resource.release` - Free resource
  - `resource.updateStatus` - Change status
  - `resource.getUtilization` - Usage stats

- [ ] **1.6.8** POS Router (`server/routers/pos.ts`)
  - `pos.quickBooking` - Walk-in booking
  - `pos.createOrder` - New POS order
  - `pos.processPayment` - Capture payment
  - `pos.getInventory` - Stock levels
  - `pos.updateInventory` - Stock adjustment
  - `pos.dailyReconciliation` - Cash reconcile

- [ ] **1.6.9** Coach Router (`server/routers/coach.ts`)
  - `coach.list` - Available coaches
  - `coach.getAvailability` - Schedule slots
  - `coach.bookLesson` - Book session
  - `coach.cancelLesson` - Cancel session
  - `coach.getSchedule` - Coach calendar

- [ ] **1.6.10** Classified Router (`server/routers/classified.ts`)
  - `classified.create` - Post listing
  - `classified.list` - Browse listings
  - `classified.search` - Search items
  - `classified.moderate` - Approve/reject
  - `classified.sendMessage` - Contact seller
  - `classified.getMessages` - Message thread

- [ ] **1.6.11** Admin Router (`server/routers/admin.ts`)
  - `admin.dashboard.getMetrics` - KPI data
  - `admin.users.list` - User management
  - `admin.users.updateRole` - Role assignment
  - `admin.reports.generate` - Create reports
  - `admin.settings.update` - System config
  - `admin.audit.getLogs` - Audit trail

### 1.7 UI Package (`packages/ui`)

- [ ] **1.7.1** Component Library Setup
  - Initialize Shadcn/ui configuration
  - Setup Tailwind CSS with custom config
  - Create design token system
  - Configure component exports
  - Setup Storybook for components

- [ ] **1.7.2** Core Components
  - Form components with validation
  - Data tables with sorting/filtering
  - Modal/dialog system
  - Navigation components
  - Loading states and skeletons
  - Toast notifications

- [ ] **1.7.3** Domain-Specific Components
  - Booking calendar widget
  - Tee sheet grid component
  - Time slot picker
  - Payment form component
  - Resource availability display
  - Score card component

- [ ] **1.7.4** Mobile-Optimized Components
  - Touch-friendly inputs
  - Swipe gestures
  - Mobile navigation
  - PWA install prompt
  - Offline indicators

## Phase 2: API Gateway & Background Services (Week 2-3)

### 2.1 API Gateway (`apps/api`)

- [ ] **2.1.1** Hono Server Setup (`src/index.ts`)
  - Initialize Hono application
  - Configure middleware stack
  - Setup error handling
  - Add request/response logging
  - Configure security headers

- [ ] **2.1.2** tRPC Integration (`src/routes/trpc.ts`)
  - Mount tRPC router via fetch adapter
  - Configure batch requests
  - Setup WebSocket support
  - Add request context passing
  - Configure CORS

- [ ] **2.1.3** NextAuth Integration (`src/routes/auth/[...nextauth].ts`)
  - Setup NextAuth API routes
  - Configure providers per app
  - Add custom callbacks
  - Setup JWT handling
  - Configure session management

- [ ] **2.1.4** REST API Bridge (`src/routes/v1/`)
  - Create REST endpoints for external integrations
  - `/v1/bookings` - Booking operations
  - `/v1/availability` - Slot queries
  - `/v1/payments` - Payment webhooks
  - `/v1/resources` - Resource management
  - Add OpenAPI documentation

- [ ] **2.1.5** Middleware Stack (`src/middleware/`)
  - JWT validation middleware
  - Tenant extraction middleware
  - Rate limiting per endpoint
  - Request ID generation
  - Audit logging middleware

### 2.2 Worker Service (`services/worker`)

- [ ] **2.2.1** Queue Setup (`src/queues/`)
  - Initialize BullMQ with Redis
  - Configure queue settings
  - Setup job retry policies
  - Implement dead letter queues
  - Add queue monitoring

- [ ] **2.2.2** Email Jobs (`src/jobs/email.ts`)
  - Booking confirmation emails
  - 24-hour reminders
  - Cancellation notifications
  - Password reset emails
  - Receipt emails
  - Lesson confirmations

- [ ] **2.2.3** SMS Jobs (`src/jobs/sms.ts`)
  - Booking reminders
  - PIN codes delivery
  - Urgent notifications
  - Confirmation codes

- [ ] **2.2.4** Cleanup Jobs (`src/jobs/cleanup.ts`)
  - Expired hold cleanup
  - Old session cleanup
  - Temporary file cleanup
  - Audit log archiving
  - Notification cleanup

- [ ] **2.2.5** Report Jobs (`src/jobs/reports.ts`)
  - Daily booking reports
  - Revenue summaries
  - Utilization reports
  - Customer analytics
  - Export generation

### 2.3 Webhook Service (`services/webhooks`)

- [ ] **2.3.1** PSP Webhook Handlers (`src/handlers/`)
  - PayMongo webhook receiver
  - Stripe webhook receiver
  - Signature verification
  - Event deduplication
  - Response formatting

- [ ] **2.3.2** Event Processing (`src/processors/`)
  - Payment success processor
  - Payment failure handler
  - Refund event handler
  - Dispute handler
  - Webhook retry logic

### 2.4 Scheduler Service (`services/scheduler`)

- [ ] **2.4.1** Cron Job Setup
  - Initialize node-cron
  - Configure job definitions
  - Setup job locking with Redis
  - Add job monitoring
  - Implement error handling

- [ ] **2.4.2** Scheduled Tasks (`src/tasks/`)
  - Send booking reminders (daily at 9am)
  - Generate daily reports (midnight)
  - Clean expired holds (every 5 minutes)
  - Check membership expiration (daily)
  - Archive old data (weekly)

### 2.5 Realtime Service (`services/realtime`)

- [ ] **2.5.1** Socket.IO Setup (`src/index.ts`)
  - Initialize Socket.IO server
  - Configure authentication middleware
  - Setup room management
  - Implement event handlers
  - Add connection tracking

- [ ] **2.5.2** Realtime Events (`src/events/`)
  - Tee sheet updates broadcast
  - Slot availability changes
  - Booking status updates
  - POS order notifications
  - Admin alerts

## Phase 3: Customer Application (Week 3-4)

### 3.1 Customer Web App (`apps/customer`)

- [ ] **3.1.1** Next.js 14 App Setup
  - Initialize with App Router
  - Configure TypeScript
  - Setup Tailwind CSS
  - Add SEO configuration
  - Configure environment variables

- [ ] **3.1.2** NextAuth Integration
  - Setup SessionProvider in layout
  - Configure auth middleware
  - Create protected routes
  - Add auth API routes
  - Implement social login buttons

- [ ] **3.1.3** Public Pages (`app/(public)/`)
  - Landing page with course discovery
  - Course listing with filters
  - Course detail pages
  - Pricing information
  - Contact/About pages

- [ ] **3.1.4** Auth Pages (`app/auth/`)
  - Custom login page
  - Registration with validation
  - Forgot password flow
  - Email verification
  - Social auth callbacks

- [ ] **3.1.5** Booking Flow (`app/booking/`)
  - Date selection calendar
  - Time slot picker with availability
  - Party size and participants
  - Add-ons selection (caddy/cart/locker)
  - Payment checkout
  - Confirmation page

- [ ] **3.1.6** Customer Dashboard (`app/dashboard/`)
  - Dashboard overview
  - Upcoming bookings list
  - Booking history
  - Cancel/reschedule interface
  - Receipts and invoices
  - Profile management

- [ ] **3.1.7** Coach Booking (`app/coaches/`)
  - Coach listing page
  - Coach profiles
  - Availability calendar
  - Lesson booking flow
  - Lesson history

- [ ] **3.1.8** Classifieds (`app/marketplace/`)
  - Browse listings
  - Category filtering
  - Search functionality
  - Listing details
  - Create listing form
  - Image upload
  - Messaging system

- [ ] **3.1.9** Mobile Optimization
  - Responsive layouts
  - Touch interactions
  - PWA manifest
  - Service worker
  - Offline support

## Phase 4: Admin Applications (Week 4-5)

### 4.1 Course Admin App (`apps/course-admin`)

- [ ] **4.1.1** Admin Dashboard (`app/dashboard/`)
  - Today's overview widget
  - Booking summary cards
  - Revenue metrics
  - Utilization charts
  - Recent activities

- [ ] **4.1.2** Tee Sheet Management (`app/teesheet/`)
  - Interactive calendar view
  - Drag-drop slot management
  - Bulk operations toolbar
  - Blackout date picker
  - Real-time updates
  - Pricing configuration

- [ ] **4.1.3** Booking Management (`app/bookings/`)
  - Booking list with filters
  - Booking detail modal
  - Edit/cancel interface
  - Manual booking form
  - Walk-in booking
  - No-show marking

- [ ] **4.1.4** Resource Management (`app/resources/`)
  - Caddy roster
  - Cart fleet status
  - Locker assignments
  - Resource calendar
  - Maintenance tracking

- [ ] **4.1.5** Customer Management (`app/customers/`)
  - Customer list
  - Customer profiles
  - Booking history
  - Communication log
  - Membership status

- [ ] **4.1.6** Reports (`app/reports/`)
  - Revenue reports
  - Utilization analytics
  - Customer analytics
  - Export functionality
  - Custom report builder

- [ ] **4.1.7** Settings (`app/settings/`)
  - Course configuration
  - Pricing rules
  - Policies editor
  - Staff management
  - Feature toggles

### 4.2 Platform Admin App (`apps/platform-admin`)

- [ ] **4.2.1** Super Admin Dashboard
  - Platform metrics
  - Tenant overview
  - System health
  - Activity monitoring
  - Revenue tracking

- [ ] **4.2.2** Tenant Management
  - Tenant list
  - Onboarding wizard
  - Tier management
  - Feature controls
  - Billing management

- [ ] **4.2.3** Moderation Tools
  - Classified review queue
  - Approval interface
  - Bulk actions
  - Content reporting
  - Moderation history

### 4.3 Onsite PWA (`apps/onsite-pwa`)

- [ ] **4.3.1** PWA Setup
  - Next.js PWA configuration
  - Service worker
  - Offline functionality
  - App manifest
  - Install prompts

- [ ] **4.3.2** Staff PIN Login
  - PIN entry keypad
  - Quick login flow
  - Role-based routing
  - Session management

- [ ] **4.3.3** POS Interface
  - Quick booking form
  - Payment capture
  - Receipt generation
  - Daily reconciliation

- [ ] **4.3.4** F&B/Shop Module
  - Product catalog
  - Order management
  - Cart functionality
  - Payment processing
  - Inventory updates

## Phase 5: Testing & Quality Assurance (Week 6-7)

### 5.1 Unit Testing

- [ ] **5.1.1** Service Layer Tests
  - Booking service tests
  - Payment processing tests
  - Auth flow tests
  - Resource allocation tests
  - Pricing calculation tests

- [ ] **5.1.2** Schema Validation Tests
  - Input validation tests
  - Error message tests
  - Edge case tests
  - Transformation tests

### 5.2 Integration Testing

- [ ] **5.2.1** API Testing
  - tRPC procedure tests
  - Auth middleware tests
  - Rate limiting tests
  - Tenant isolation tests
  - Webhook processing tests

- [ ] **5.2.2** Database Testing
  - Transaction tests
  - Constraint validation
  - Migration tests
  - Query performance

### 5.3 E2E Testing

- [ ] **5.3.1** Critical User Flows
  - Complete booking flow
  - Payment processing
  - Cancellation flow
  - Admin operations
  - POS transactions

### 5.4 Performance Testing

- [ ] **5.4.1** Load Testing
  - Concurrent booking tests
  - API response times
  - Database performance
  - Real-time updates

## Phase 6: Deployment & Launch (Week 8-10)

### 6.1 Infrastructure Setup

- [ ] **6.1.1** Cloud Resources
  - Database provisioning
  - Redis setup
  - Object storage
  - CDN configuration
  - Domain setup

- [ ] **6.1.2** Container Deployment
  - Docker images
  - Kubernetes setup
  - Service deployments
  - Load balancing

### 6.2 Monitoring & Observability

- [ ] **6.2.1** Logging & Metrics
  - Centralized logging
  - Performance monitoring
  - Error tracking
  - Custom dashboards
  - Alert configuration

### 6.3 Security & Compliance

- [ ] **6.3.1** Security Hardening
  - Security audit
  - Penetration testing
  - PII encryption
  - Access controls
  - Compliance checks

### 6.4 Documentation & Training

- [ ] **6.4.1** Documentation
  - API documentation
  - Admin guides
  - User manuals
  - Video tutorials
  - Troubleshooting guides

### 6.5 Launch Preparation

- [ ] **6.5.1** Pilot Launch
  - Partner onboarding
  - Staff training
  - Test transactions
  - Monitoring setup
  - Feedback collection

- [ ] **6.5.2** Public Launch
  - Marketing activation
  - Support coverage
  - Performance monitoring
  - Issue resolution
  - Success tracking

## Success Metrics

- [ ] Checkout success rate ≥ 85%
- [ ] Booking completion time ≤ 90 seconds
- [ ] API uptime 99.9%
- [ ] Zero double-booking incidents
- [ ] 100+ bookings in first 30 days
- [ ] Support response < 1 hour