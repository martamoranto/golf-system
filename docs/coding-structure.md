# GBS — Clean SSOT (Single Source of Truth) with **Prisma → Zod → Services → tRPC → Hono**

> Minimal, predictable, and **clean**. All business logic lives in **services**, all validation in **schemas**, and the API is a thin **tRPC** layer mounted on **Hono**.  
> **DB is the SSOT for storage**, **Zod schemas are the SSOT for API I/O**. Types are **derived**—never duplicated.

---

## Monorepo Layout (minimal)

```
gbs/
├─ apps/
│  └─ api/
│     └─ src/
│        ├─ routes/trpc.ts         # fetch adapter
│        ├─ app.ts                 # Hono app
│        └─ index.ts               # server entry
│
├─ packages/
│  ├─ database/
│  │  ├─ prisma/
│  │  │  └─ schema.prisma          # DB SSOT
│  │  └─ src/index.ts              # PrismaClient singleton (db)
│  │
│  ├─ schemas/                     # Zod contracts (API I/O SSOT)
│  │  └─ product.ts
│  │
│  ├─ types/                       # Types derived from schemas
│  │  └─ product.ts
│  │
│  ├─ services/                    # Framework-free business logic
│  │  └─ products.ts
│  │
│  └─ trpc/
│     └─ server/
│        ├─ context.ts
│        ├─ trpc.ts
│        └─ routers/
│           ├─ products.ts
│           └─ index.ts
│
├─ pnpm-workspace.yaml
└─ tsconfig.base.json
```

---

## 1) **Database (Prisma)** — Storage SSOT

```prisma
// packages/database/prisma/schema.prisma
model Product {
  id          String   @id @default(cuid())
  orgId       String
  name        String
  priceCents  Int      @default(0)
  isActive    Boolean  @default(true)
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([orgId, name])
  @@index([orgId, isActive])
}
```

```ts
// packages/database/src/index.ts
import { PrismaClient } from "@prisma/client";
export const db = new PrismaClient();
```

---

## 2) **Schemas (Zod)** — API I/O SSOT

```ts
// packages/schemas/product.ts
import { z } from "zod";

export const cuid = z.string().cuid();

export const ProductOutput = z.object({
  id: cuid,
  orgId: cuid,
  name: z.string().min(1),
  priceCents: z.number().int().nonnegative(),
  isActive: z.boolean(),
  description: z.string().max(2000).nullable().optional(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export const CreateProductInput = z.object({
  name: z.string().min(1),
  priceCents: z.number().int().nonnegative().default(0),
  isActive: z.boolean().optional().default(true),
  description: z.string().max(2000).optional(),
});

export const UpdateProductInput = z.object({
  id: cuid,
  name: z.string().min(1).optional(),
  priceCents: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
  description: z.string().max(2000).optional().nullable(),
});

export const GetProductInput = z.object({ id: cuid });

export const ListProductsInput = z.object({
  search: z.string().trim().optional(),     // by name (contains)
  isActive: z.boolean().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  cursor: cuid.optional(),                   // simple cursor by id
});

export const ListProductsOutput = z.object({
  items: z.array(ProductOutput),
  nextCursor: cuid.nullable(),
});
```

---

## 3) **Types (Derived from Schemas)** — No duplicates

```ts
// packages/types/product.ts
import { z } from "zod";
import {
  ProductOutput as _ProductOutput,
  CreateProductInput as _CreateProductInput,
  UpdateProductInput as _UpdateProductInput,
  GetProductInput as _GetProductInput,
  ListProductsInput as _ListProductsInput,
  ListProductsOutput as _ListProductsOutput,
} from "@gbs/schemas/product";

export type ProductOutput      = z.infer<typeof _ProductOutput>;
export type CreateProductInput = z.infer<typeof _CreateProductInput>;
export type UpdateProductInput = z.infer<typeof _UpdateProductInput>;
export type GetProductInput    = z.infer<typeof _GetProductInput>;
export type ListProductsInput  = z.infer<typeof _ListProductsInput>;
export type ListProductsOutput = z.infer<typeof _ListProductsOutput>;
```

> You can also import `z.infer` directly from `@gbs/schemas/*` in apps to skip the `@gbs/types` package if you prefer fewer packages.

---

## 4) **Services (Business Logic)** — Framework-free, testable

```ts
// packages/services/products.ts
import { db } from "@gbs/database";
import type {
  CreateProductInput,
  UpdateProductInput,
  ProductOutput,
  ListProductsInput,
  ListProductsOutput,
} from "@gbs/types";

function toOutput(row: any): ProductOutput {
  return {
    id: row.id,
    orgId: row.orgId,
    name: row.name,
    priceCents: row.priceCents,
    isActive: row.isActive,
    description: row.description ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function createProduct(opts: {
  orgId: string;
  input: CreateProductInput;
}): Promise<ProductOutput> {
  const row = await db.product.create({
    data: { orgId: opts.orgId, ...opts.input },
  });
  return toOutput(row);
}

export async function getProduct(opts: {
  orgId: string;
  id: string;
}): Promise<ProductOutput | null> {
  const row = await db.product.findFirst({
    where: { id: opts.id, orgId: opts.orgId },
  });
  return row ? toOutput(row) : null;
}

export async function listProducts(opts: {
  orgId: string;
  query: ListProductsInput;
}): Promise<ListProductsOutput> {
  const where: any = { orgId: opts.orgId };
  if (opts.query.isActive !== undefined) where.isActive = opts.query.isActive;
  if (opts.query.search)
    where.name = { contains: opts.query.search, mode: "insensitive" };

  const take = opts.query.limit ?? 20;
  const cursor = opts.query.cursor ? { id: opts.query.cursor } : undefined;

  const rows = await db.product.findMany({
    where,
    take: take + 1,                // fetch one extra to know if there is next page
    ...(cursor ? { cursor, skip: 1 } : {}),
    orderBy: { id: "asc" },
  });

  let nextCursor: string | null = null;
  if (rows.length > take) {
    const next = rows.pop()!;
    nextCursor = next.id;
  }

  return { items: rows.map(toOutput), nextCursor };
}

export async function updateProduct(opts: {
  orgId: string;
  input: UpdateProductInput;
}): Promise<ProductOutput> {
  // ensure it belongs to org
  const found = await db.product.findFirst({
    where: { id: opts.input.id, orgId: opts.orgId },
    select: { id: true },
  });
  if (!found) throw new Error("NOT_FOUND");

  const row = await db.product.update({
    where: { id: opts.input.id },
    data: {
      name: opts.input.name ?? undefined,
      priceCents: opts.input.priceCents ?? undefined,
      isActive: opts.input.isActive ?? undefined,
      description: opts.input.description ?? undefined,
    },
  });
  return toOutput(row);
}

export async function deleteProduct(opts: {
  orgId: string;
  id: string;
}): Promise<void> {
  // hard delete (or soft-delete via isActive=false)
  const found = await db.product.findFirst({
    where: { id: opts.id, orgId: opts.orgId },
    select: { id: true },
  });
  if (!found) throw new Error("NOT_FOUND");

  await db.product.delete({ where: { id: opts.id } });
}
```

---

## 5) **tRPC (Thin API)** — Validates with Zod, calls services

```ts
// packages/trpc/server/context.ts
import { db } from "@gbs/database";

// Minimal auth stub — replace with @gbs/auth
async function getAuthFromRequest(req: Request) {
  // resolve user/org from cookie/header/session/JWT
  return { userId: "u_123", orgId: "o_123", role: "ADMIN" } as
    | { userId: string; orgId: string; role: string }
    | null;
}

export async function createContext({ req }: { req: Request }) {
  const session = await getAuthFromRequest(req);
  return { db, session };
}
export type Context = Awaited<ReturnType<typeof createContext>>;
```

```ts
// packages/trpc/server/trpc.ts
import { initTRPC } from "@trpc/server";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const authed = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) throw new Error("UNAUTHORIZED");
  return next({ ctx });
});

export const tenantGuard = t.middleware(({ ctx, next }) => {
  const orgId = ctx.session?.orgId;
  if (!orgId) throw new Error("NO_TENANT");
  return next({ ctx: { ...ctx, orgId } });
});
```

```ts
// packages/trpc/server/routers/products.ts
import { z } from "zod";
import { router, authed, tenantGuard } from "../trpc";
import {
  ProductOutput,
  CreateProductInput,
  UpdateProductInput,
  GetProductInput,
  ListProductsInput,
  ListProductsOutput,
} from "@gbs/schemas/product";
import {
  createProduct,
  getProduct,
  listProducts,
  updateProduct,
  deleteProduct,
} from "@gbs/services/products";

export const productsRouter = router({
  create: authed.use(tenantGuard)
    .input(CreateProductInput)
    .output(ProductOutput)
    .mutation(async ({ ctx, input }) => {
      return createProduct({ orgId: ctx.orgId, input });
    }),

  get: authed.use(tenantGuard)
    .input(GetProductInput)
    .output(ProductOutput.nullable())
    .query(async ({ ctx, input }) => {
      return getProduct({ orgId: ctx.orgId, id: input.id });
    }),

  list: authed.use(tenantGuard)
    .input(ListProductsInput)
    .output(ListProductsOutput)
    .query(async ({ ctx, input }) => {
      return listProducts({ orgId: ctx.orgId, query: input });
    }),

  update: authed.use(tenantGuard)
    .input(UpdateProductInput)
    .output(ProductOutput)
    .mutation(async ({ ctx, input }) => {
      return updateProduct({ orgId: ctx.orgId, input });
    }),

  delete: authed.use(tenantGuard)
    .input(z.object({ id: z.string().cuid() }))
    .output(z.void())
    .mutation(async ({ ctx, input }) => {
      await deleteProduct({ orgId: ctx.orgId, id: input.id });
    }),
});
```

```ts
// packages/trpc/server/routers/index.ts
import { router, publicProcedure } from "../trpc";
import { productsRouter } from "./products";

export const appRouter = router({
  health: publicProcedure.query(() => "pong"),
  products: productsRouter,
});
export type AppRouter = typeof appRouter;
```

---

## 6) **API Server (Hono)** — Just mount tRPC

```ts
// apps/api/src/routes/trpc.ts
import { Hono } from "hono";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@gbs/trpc/server/routers";
import { createContext } from "@gbs/trpc/server/context";

export const trpc = new Hono();

trpc.all("/v1/trpc/*", (c) =>
  fetchRequestHandler({
    endpoint: "/v1/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext: () => createContext({ req: c.req.raw }),
  })
);
```

```ts
// apps/api/src/app.ts
import { Hono } from "hono";
import { trpc } from "./routes/trpc";

export function buildApp() {
  const app = new Hono();
  app.get("/healthz", (c) => c.json({ ok: true }));
  app.route("/", trpc);
  return app;
}
```

```ts
// apps/api/src/index.ts
import { buildApp } from "./app";
const app = buildApp();

export default {
  port: 3001,
  fetch: app.fetch,
};
```

---

## 7) Why this is **SSOT** (and clean)

- **DB SSOT**: Prisma schema defines storage truth.  
- **API I/O SSOT**: Zod schemas define inputs/outputs.  
- **Types**: Derived from Zod; no duplicate interfaces.  
- **Services**: Contain all business logic, reusable in jobs/CLI.  
- **tRPC**: Thin, only validates and calls services.  
- **Hono**: Only mounts tRPC; no extra branching.

---

## 8) Conventions

- **No business logic in routers.**  
- **Validation at boundaries**: `.input()` and `.output()` use Zod from `@gbs/schemas`.  
- **Multitenancy**: Always require `orgId` via `tenantGuard`.  
- **Pagination**: Cursor-first (`id asc`, +1 read).  
- **Soft delete**: Prefer `isActive=false` when needed; keep `delete` available for hard delete if safe.  
- **Dates**: Return **ISO strings** at API boundary.  
- **Errors**: Throw domain errors in services; centralize formatter in tRPC if you need pretty errors.

---

## 9) Add a New Module (Checklist)

1. **DB**: Add Prisma model + migrate.  
2. **Schemas**: Define `XOutput`, `CreateXInput`, `UpdateXInput`, `GetXInput`, `ListXInput`, `ListXOutput`.  
3. **Types**: (Optional) export `z.infer` types from `@gbs/types`.  
4. **Services**: CRUD + list with cursor, **framework-free**.  
5. **tRPC Router**: `.input()/.output()` from schemas; call services.  
6. **Hono**: No changes beyond adding the router to `appRouter`.  

---

## 10) Dev Commands (examples)

```bash
# install
pnpm i

# prisma generate + migrate
pnpm --filter @gbs/database prisma generate
pnpm --filter @gbs/database prisma migrate dev

# run api
pnpm --filter @app/api dev
```

---

## 11) TS Config Paths (example)

```json
// tsconfig.base.json (excerpt)
{
  "compilerOptions": {
    "paths": {
      "@gbs/database/*": ["packages/database/src/*"],
      "@gbs/schemas/*":  ["packages/schemas/*"],
      "@gbs/types/*":    ["packages/types/*"],
      "@gbs/services/*": ["packages/services/*"],
      "@gbs/trpc/*":     ["packages/trpc/server/*"]
    }
  }
}
```
