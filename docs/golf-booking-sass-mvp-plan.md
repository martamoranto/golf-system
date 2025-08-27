🏌️ Golf Booking SaaS — MVP Plan (Pilot v1)

Last updated: 26 Aug 2025

⸻

1) MVP Objective & Success Criteria

Objective: Launch a production‑ready pilot that enables a partner club to sell tee times online and on‑site (POS), accept payments, manage basic resources (caddies/carts), and run lightweight reporting. Classifieds (non‑ecommerce) and single‑session lessons are included to validate community and coaching demand.

Primary KPIs (first 30 days per club):
	•	Checkout success rate ≥ 85% (initiated → paid)
	•	Median time‑to‑book ≤ 90s (search → confirmation)
	•	≥ ₱X GMV processed (set with club at onboarding)
	•	Operational reliability: 99.9% API uptime; < 1% webhook failure after retries
	•	Adoption: ≥ 100 paid bookings; ≥ 10 classifieds listed; ≥ 5 lesson bookings

Secondary KPIs: refund processing lead time ≤ 24h, < 2% double‑booking incidents (goal: 0), support first‑response < 1h during business hours.

⸻

2) MVP Scope (What’s In vs Out)

In (Pilot v1)
	•	Marketplace (Golfers): discovery, real‑time tee‑time availability, booking & payment, confirmation emails/SMS, basic booking management (cancel/reschedule within policy), coach booking (single sessions), community classifieds (list + message; no checkout)
	•	Club Admin: tee sheet/slot creation, blackout rules, booking list, manual edit/reschedule/cancel, simple pricing (flat + weekday/weekend), caddy/cart inventory setup, basic reports
	•	Staff POS: PIN quick login, walk‑in bookings & F&B/Shop POS (basic), on‑site payment capture, receipt
	•	Caddy/Cart: roster, availability, assignment to bookings
	•	Loyalty: off (toggle exists but disabled in MVP)
	•	Payments: cards + e‑wallets + bank transfer (tokenized; webhooks + idempotency)
	•	Notifications: email/SMS for booking lifecycle
	•	HQ (SaaS): tenant provisioning, tier assignment, classifieds moderation queue, audit logs

Out (post‑pilot)
	•	Dynamic pricing engine, deep inventory costing, full tournament suite (real‑time leaderboard), corporate accounts, white‑label domains, loyalty & rewards accrual/redemption, advanced analytics, hotels integration, sponsorships/ad units.

⸻

3) Personas & Roles
	•	Golfer (Customer): browse, book, pay, manage bookings, post classifieds
	•	Club Admin: configure tee sheet, policies, pricing, manage bookings, reports
	•	Manager: oversee ops (caddies/F&B), moderate classifieds (if enabled)
	•	Staff (role‑based): Cashier (POS), Caddy Manager, Kitchen/Bar, Inventory
	•	Coach/Trainer: manage availability and see lesson bookings
	•	SaaS HQ: Super Admin (global control), Support Staff (assists clubs)

Role mapping is enforced via RBAC with tenant scoping and audit logs.

⸻

4) Core User Journeys & Acceptance Criteria

4.1 Golfer: Book Tee Time (Online)

Flow: Discover → Select slot → Add‑ons (caddy/cart/locker) → Pay → Confirmation

Acceptance Criteria:
	•	Shows real‑time slots with price and party size limits
	•	Prevents double booking via slot locking (120s hold)
	•	Applies flat/weekday/weekend pricing
	•	Supports payment via card/e‑wallet/bank transfer; handles webhook confirmation with idempotency key
	•	Sends confirmation email/SMS with itinerary and receipt link
	•	Allows cancel/reschedule within club policy windows
	•	Error cases handled: payment timeout, webhook retry, slot loss during checkout → clear message & return to availability

4.2 Staff Cashier: Walk‑in Booking & POS

Flow: PIN quick‑login → Create/attach booking → Accept on‑site payment → Issue receipt

Acceptance Criteria:
	•	PIN login rate‑limited, device‑bound short session; lockout after 5 failed attempts (10 min)
	•	Search available slots quickly; create walk‑in booking without full profile
	•	Record payment method; create ledger entry; printable/emailed receipt
	•	Works with intermittent connectivity (queued receipt if offline w/ later sync)

4.3 Club Admin: Manage Tee Sheet

Flow: Create tee blocks & slots → Blackouts → Adjust pricing → Monitor day view

Acceptance Criteria:
	•	Define blocks (date, start‑end, interval, capacity)
	•	Set blackout dates/times
	•	Set base price + weekday/weekend override
	•	Day view shows utilization; inline edit/cancel/reschedule
	•	Changes reflect in marketplace within ≤ 2s

4.4 Caddy/Cart Assignment

Flow: Configure roster/fleet → Auto/Manual assign to bookings → Track status

Acceptance Criteria:
	•	Add caddies with status (available, assigned, off)
	•	Register carts (available, in use, maintenance)
	•	Auto‑assignment follows availability; manual override allowed; all actions audited

4.5 Classifies (Non‑Ecommerce)

Flow: Golfer posts item → Club/HQ moderation → Listing live → Buyer sends message → Seller replies (email relay)

Acceptance Criteria:
	•	Required fields: title, category, condition, price (optional), description, photos
	•	Moderation queue with approve/reject & reason
	•	Public viewable listing; internal messaging (no buyer emails exposed)
	•	Club can toggle classifieds ON/OFF

4.6 Coach Booking (Single Session)

Flow: Browse coaches → Select time → Pay → Confirmation

Acceptance Criteria:
	•	Coach availability calendar; per‑session price
	•	Book & pay as standalone or alongside tee booking
	•	Coach and student receive schedule & reminders

4.7 Reschedule/Cancel/Refund

Acceptance Criteria:
	•	Policy windows per club: e.g., free cancel ≥ 24h, fee otherwise
	•	Refund ledger entries recorded; webhook to PSP; status visible to staff
	•	Prevent negative invoice totals; idempotent refund processing

⸻

5) Business Rules & Policies
	•	Booking Window: configurable per club (e.g., 14–60 days out)
	•	Party Size: defaults to 4, configurable per slot
	•	Add‑ons: caddy/cart/locker contingent on availability; priced per unit
	•	Payments: tokenized; we store PSP IDs only
	•	Cancellations: grace window & fee matrix per club; reschedule allowed if inventory exists
	•	No‑Shows: marked by staff; fee can be recorded manually (MVP)
	•	Classifieds: prohibited items list; expiry (e.g., 30 days); re‑post allowed
	•	Staff PIN: 4–6 digits, hashed; rotation every 90 days recommended

⸻

6) Architecture (High‑Level)
	•	Frontend: Next.js apps (Marketplace, Club Admin), Tailwind + shadcn/ui
	•	Backend API: Hono (Node), tRPC (typed contracts), Zod validation
	•	Data: PostgreSQL (Prisma ORM), Redis (locks, queues)
	•	Async: Job queue for webhooks, notifications, receipts (retry with backoff)
	•	Auth: Email/password + social for golfers; PIN for staff; JWT sessions; RBAC per tenant
	•	Observability: Central logs, traces, metrics dashboards; alerting
	•	Infra: Docker compose (dev), containerized services (prod), object storage for media

6.1 Monorepo Layout

apps/
  web-marketplace/
  web-club-admin/
  api/
packages/
  ui/
  schemas/
  trpc/
  auth/
  database/
  types/
  config/
infra/
  docker/
  terraform/

6.2 Key ADRs (summary)
	•	ADR‑001 Tenancy: single DB with tenant_id + guards; per‑tenant backups
	•	ADR‑002 Auth: NextAuth (golfer); staff PIN short‑lived sessions + rate limiting
	•	ADR‑003 Payments: PSP (Stripe/Xendit/PayMongo) via webhooks; ledger & idempotency keys
	•	ADR‑004 Realtime: Redis pub/sub for slot locks; optimistic UI + authoritative server checks
	•	ADR‑005 Notifications: provider‑agnostic; outbox pattern; retries
	•	ADR‑006 Observability: OpenTelemetry; error budgets & SLOs
	•	ADR‑007 Security: RBAC; audit trails; PII encryption at rest

⸻

7) Data Model (v0 — MVP Tables)
	•	Tenant(id, name, tier, settings)
	•	User(id, tenantId, email, authProvider, phone, name)
	•	StaffProfile(id, userId, role, pinHash, active)
	•	Course(id, tenantId, name, address, timezone)
	•	TeeBlock(id, courseId, date, startTime, endTime, intervalMin)
	•	TeeTimeSlot(id, blockId, teeTime, capacity, priceBase, priceType)
	•	Booking(id, tenantId, userId?, slotId, status, totalAmount, currency)
	•	BookingItem(id, bookingId, type[caddy|cart|locker|lesson], qty, price)
	•	Payment(id, bookingId, psp, pspPaymentId, status, amount, method)
	•	Refund(id, paymentId, pspRefundId, status, amount, reason)
	•	LedgerEntry(id, tenantId, type[charge|refund|payout], refId, amount)
	•	Caddy(id, tenantId, name, status)
	•	Cart(id, tenantId, label, status)
	•	Coach(id, tenantId, name, bio, rate)
	•	CoachAvailability(id, coachId, start, end)
	•	Lesson(id, bookingId, coachId, start, end, status)
	•	PosOrder(id, tenantId, staffId, status, total), PosOrderItem(id, orderId, sku, qty, price)
	•	InventoryItem(id, tenantId, sku, name, stock), StockTxn(id, itemId, delta, reason)
	•	ClassifiedListing(id, tenantId, userId, title, category, description, price?, status, expiresAt)
	•	ListingMessage(id, listingId, fromUserId, toUserId, body)
	•	AuditLog(id, tenantId, actorId, action, entity, before?, after?)
	•	Notification(id, tenantId, type[email|sms], to, template, payload, status)

⸻

8) API Contracts (Selected)

All requests/responses validated with Zod; types generated for UI via tRPC.

Availability
	•	GET /availability?courseId&date → { slots: [{slotId, teeTime, capacity, price}] }

Booking
	•	POST /booking/create { slotId, players, addons[] } → { bookingId, holdExpiresAt }
	•	POST /booking/confirm { bookingId, paymentToken } → { status: 'paid', receiptUrl }
	•	POST /booking/cancel { bookingId } → { status } (policy enforced)
	•	POST /booking/reschedule { bookingId, toSlotId } → { status }

POS
	•	POST /pos/login { pin } → { staffSessionToken, role }
	•	POST /pos/walkin { slotId|teeTime, partySize, paymentMethod } → { bookingId, receiptUrl }

Caddy/Cart
	•	POST /caddy/assign { bookingId, caddyId } → { status }
	•	POST /cart/assign { bookingId, cartId } → { status }

Coaches
	•	GET /coaches?courseId → list; GET /coaches/availability?coachId&date
	•	POST /lessons/book { coachId, start, end, paymentToken }

Classifieds
	•	POST /listings { title, category, description, price?, photos[] }
	•	POST /listings/:id/moderate { status: approved|rejected, reason? }
	•	POST /listings/:id/message { body }

Admin: Tee Sheet
	•	POST /teeblocks { courseId, date, start, end, interval }
	•	POST /slots/price { slotId|blockId, priceBase, priceType }
	•	POST /blackouts { courseId, ranges[] }

⸻

9) Notifications & Templates
	•	Booking Confirmation (Email/SMS): course, date/time, party size, add‑ons, receipt URL, manage‑booking link
	•	Reminder (T‑24h): arrival time, dress code/house rules (club text block)
	•	Reschedule/Cancel: new details or policy notice + refund status
	•	Lesson Confirmation/Reminder: coach, time, location
	•	Classifieds: listing approved/rejected; new message received

Outbox table + worker retries (5x exponential backoff). Provider fallbacks.

⸻

10) Analytics & Events

Key events: search_performed, slot_viewed, booking_started, booking_paid, booking_failed, booking_rescheduled, booking_canceled, pos_login_success, pos_sale_completed, caddy_assigned, lesson_booked, listing_created, listing_approved.

Dashboards: GMV, conversion funnel, error rates, webhook retries, utilization by hour.

⸻

11) Security, Privacy, Compliance
	•	RBAC per tenant; least privilege
	•	PIN Security: hashed (bcrypt/argon2), rate limit, lockouts, device‑bound sessions
	•	PII: encrypt sensitive fields at rest; rotate keys
	•	Payments: SAQ‑A scope; no raw card data stored; idempotent webhooks
	•	Audit Logs: all admin/staff actions, auth events, policy overrides
	•	Data Privacy: align with PH DPA 2012 principles (notice, consent, purpose limitation)

⸻

12) QA Plan (Test Matrix)
	•	Functional: happy path flows for 4.1–4.7; edge cases (slot loss, retry webhooks, partial refund)
	•	Performance: p95 < 400ms read APIs; p95 < 800ms booking commit; tee‑sheet refresh < 2s
	•	Security: authZ checks, PIN brute force, IDOR attempts, SQLi/XSS
	•	Resilience: kill PSP webhook for 5m (retry works), Redis down (degraded but safe)
	•	Compatibility: mobile Safari/Chrome; low bandwidth modes

⸻

13) Environments & Deployment
	•	Envs: dev, staging, prod
	•	Infra: Postgres + Redis (managed), object storage for images, CDN for static
	•	CI/CD: lint, typecheck, unit/integration tests, DB migrations gated by approval
	•	Feature Flags: classifieds, lessons, caddy auto‑assign, SMS vendor switch
	•	Backups: nightly DB backups + PITR; restore drill before go‑live

⸻

14) Seed Data & Fixtures
	•	Seed 1 demo club with:
	•	14‑day tee sheet, weekday/weekend prices
	•	8 caddies, 10 carts, 20 lockers
	•	2 coaches + availability
	•	10 inventory items (for POS)
	•	5 sample classifieds
	•	Demo users: golfer, club admin, staff (pins), coach

⸻

15) Rollout & Pilot Plan
	1.	Week 0: Contract + data capture (pricing, policies, club copy)
	2.	Week 1–2: Club configuration + staff training (90‑min), sandbox transactions
	3.	Soft Launch (Week 3): limited booking window; close monitoring; daily stand‑ups
	4.	Public Launch (Week 4): press + email to members; monitor KPIs; weekly review
	5.	Post‑30 Days: Pilot report; sign‑off & roadmap for Phase 2

Runbooks: payment stuck, double booking dispute, refund not returned, POS offline.

⸻

16) Timeline & Work Plan (8–10 Weeks)

Phase 0 (Week 1): Monorepo, auth, tenancy, audit, CI/CD, seed

Phase 1 (Weeks 2–3): Availability, booking, payments, notifications

Phase 2 (Week 4): Admin tee sheet, pricing, blackouts, reports v1

Phase 3 (Weeks 5–6): POS + caddy/cart assignment

Phase 4 (Weeks 7–8): Lessons (single session) + Classifieds + hardening

Phase 5 (Weeks 9–10): UAT, load/resilience tests, DR drill, docs & training

⸻

17) Epics → Stories (Backlog Extract)
	•	E1 Booking Core
	•	S1 Availability query + slot locks
	•	S2 Create booking (hold) + pricing calc
	•	S3 Payment intent + confirm + webhook idempotency
	•	S4 Cancel/reschedule with policy engine
	•	S5 Notifications (email/SMS) + templates
	•	E2 Admin Tee Sheet
	•	S1 Tee blocks CRUD + slot generation
	•	S2 Blackouts & day view
	•	S3 Price overrides (weekday/weekend)
	•	S4 Booking list + inline edit
	•	E3 POS & Resources
	•	S1 Staff PIN auth service
	•	S2 POS walk‑in booking + receipt
	•	S3 Caddy roster + assign
	•	S4 Cart registry + status board
	•	E4 Lessons & Coaches
	•	S1 Coach profiles + availability CRUD
	•	S2 Lesson booking flow + notifications
	•	E5 Classifieds
	•	S1 Listing CRUD + media upload
	•	S2 Moderation queue + messaging
	•	E6 Platform
	•	S1 RBAC policies + audit log
	•	S2 Observability (logs/traces/metrics)
	•	S3 Backups & DR drill

⸻

18) Risks & Mitigations
	•	Double bookings under load: server‑side locks + serializable tx; retries
	•	Webhook failures: outbox + retries + manual replay tool
	•	PIN abuse: rate limiting, lockouts, device binding, audit trails
	•	PSP downtime: graceful degradation (record unpaid booking; email link to pay when back)
	•	Club policy complexity: start with fixed templates; custom rules post‑pilot
	•	Data privacy breaches: encrypt PII, least privilege, regular key rotation

⸻

19) Assumptions (to validate with pilot clubs)
	•	Clubs accept weekday/weekend pricing only for MVP
	•	SMS sender IDs supported in their region
	•	Classifieds allowed under club terms; moderation time ≤ 24h
	•	Coaches manage their own availability via admin portal

⸻

20) Definition of Done (DoD)
	•	Feature behind flag; unit + integration tests passing
	•	API types and Zod schemas exported; UI typed end‑to‑end
	•	Accessibility pass (keyboard nav, contrast, labels)
	•	Observability hooks added; runbook updated
	•	Docs: README for app + ADR updated; screenshots for admin

⸻

21) Appendices

21.1 Email/SMS Copy (samples)
	•	Booking Confirmation (Email): Subject: “You’re booked at {{course}} — {{date}} {{time}}” …
	•	Reminder (SMS): “Reminder: {{course}} tee‑time {{time}} tomorrow. Arrive 20 min early. Manage: {{link}}”
	•	POS Receipt: includes booking ref, add‑ons, payment method, tax lines (if any)

21.2 Feature Flags
	•	ff_classifieds, ff_lessons_single, ff_caddy_auto_assign, ff_sms_provider_b

21.3 Env Vars (illustrative)
	•	DATABASE_URL, REDIS_URL, PSP_SECRET, JWT_SECRET, SMTP_URL, SMS_API_KEY, TENANT_DOMAIN

⸻

Owner: Product (MVP Lead)
Engineering: API, Frontend (Marketplace/Admin), Platform
Design: UX flows + UI kit
Support: Pilot club training, L1 runbooks

This plan is the working truth for the pilot. Any changes are proposed via PR with a short ADR update.