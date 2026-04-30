/**
 * Persistence layer.
 *
 * - If `MONGODB_URI` is set: backed by MongoDB collections
 *   (`orders`, `users`, `magic_tokens`, `newsletter`).
 * - Otherwise: backed by in-memory Maps. State survives across
 *   requests in the same Node process; lost on restart. Good
 *   enough for local dev and demos.
 *
 * The interface is async in both modes so swapping backends is
 * a no-op for callers.
 */
import { randomUUID } from "node:crypto";
import { MongoClient, type Db } from "mongodb";

export type Order = {
  id: string;
  email: string;
  name: string;
  amount: number;
  currency: "USD";
  tier: string;
  status: "pending" | "paid" | "refunded" | "failed";
  createdAt: number;
};

export type User = {
  id: string;
  email: string;
  name?: string;
  createdAt: number;
  ownsKit: boolean;
};

export type MagicToken = {
  token: string;
  email: string;
  expiresAt: number;
  used: boolean;
};

export interface Database {
  orders: {
    create(input: Omit<Order, "id" | "createdAt" | "status">): Promise<Order>;
    update(id: string, patch: Partial<Order>): Promise<Order | null>;
    get(id: string): Promise<Order | null>;
    listByEmail(email: string): Promise<Order[]>;
  };
  users: {
    upsert(email: string, name?: string): Promise<User>;
    grantKit(email: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
  };
  magicTokens: {
    create(email: string, ttlMs?: number): Promise<MagicToken>;
    consume(token: string): Promise<MagicToken | null>;
  };
  newsletter: {
    subscribe(email: string): Promise<void>;
    has(email: string): Promise<boolean>;
    size(): Promise<number>;
  };
}

/* ────────── In-memory backend ────────────────────────────────── */

function memoryDb(): Database {
  const orders = new Map<string, Order>();
  const usersByEmail = new Map<string, User>();
  const magicTokens = new Map<string, MagicToken>();
  const newsletter = new Set<string>();

  return {
    orders: {
      async create(input) {
        const order: Order = {
          id: randomUUID(),
          createdAt: Date.now(),
          status: "pending",
          ...input,
        };
        orders.set(order.id, order);
        return order;
      },
      async update(id, patch) {
        const existing = orders.get(id);
        if (!existing) return null;
        const next = { ...existing, ...patch };
        orders.set(id, next);
        return next;
      },
      async get(id) {
        return orders.get(id) ?? null;
      },
      async listByEmail(email) {
        return [...orders.values()].filter((o) => o.email === email);
      },
    },
    users: {
      async upsert(email, name) {
        const existing = usersByEmail.get(email);
        if (existing) {
          if (name && !existing.name) existing.name = name;
          return existing;
        }
        const user: User = {
          id: randomUUID(),
          email,
          name,
          createdAt: Date.now(),
          ownsKit: false,
        };
        usersByEmail.set(email, user);
        return user;
      },
      async grantKit(email) {
        const user = usersByEmail.get(email);
        if (!user) return null;
        user.ownsKit = true;
        return user;
      },
      async findByEmail(email) {
        return usersByEmail.get(email) ?? null;
      },
    },
    magicTokens: {
      async create(email, ttlMs = 15 * 60 * 1000) {
        const t: MagicToken = {
          token: randomUUID().replace(/-/g, ""),
          email,
          expiresAt: Date.now() + ttlMs,
          used: false,
        };
        magicTokens.set(t.token, t);
        return t;
      },
      async consume(token) {
        const t = magicTokens.get(token);
        if (!t) return null;
        if (t.used || t.expiresAt < Date.now()) return null;
        t.used = true;
        return t;
      },
    },
    newsletter: {
      async subscribe(email) {
        newsletter.add(email.toLowerCase());
      },
      async has(email) {
        return newsletter.has(email.toLowerCase());
      },
      async size() {
        return newsletter.size;
      },
    },
  };
}

/* ────────── MongoDB backend ──────────────────────────────────── */

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB ?? "made_plain";

let mongoPromise: Promise<Db> | null = null;
function mongo(): Promise<Db> {
  if (!MONGODB_URI) throw new Error("MONGODB_URI is not set");
  if (!mongoPromise) {
    mongoPromise = new MongoClient(MONGODB_URI)
      .connect()
      .then(async (client) => {
        const d = client.db(MONGODB_DB);
        await Promise.all([
          d.collection("orders").createIndex({ id: 1 }, { unique: true }),
          d.collection("users").createIndex({ email: 1 }, { unique: true }),
          d
            .collection("magic_tokens")
            .createIndex({ token: 1 }, { unique: true }),
          d
            .collection("magic_tokens")
            .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
          d
            .collection("newsletter")
            .createIndex({ email: 1 }, { unique: true }),
        ]);
        return d;
      });
  }
  return mongoPromise;
}

function mongoDb(): Database {
  return {
    orders: {
      async create(input) {
        const d = await mongo();
        const order: Order = {
          id: randomUUID(),
          createdAt: Date.now(),
          status: "pending",
          ...input,
        };
        await d.collection<Order>("orders").insertOne(order);
        return order;
      },
      async update(id, patch) {
        const d = await mongo();
        const res = await d
          .collection<Order>("orders")
          .findOneAndUpdate(
            { id },
            { $set: patch },
            { returnDocument: "after" }
          );
        return res ?? null;
      },
      async get(id) {
        const d = await mongo();
        return d
          .collection<Order>("orders")
          .findOne({ id }, { projection: { _id: 0 } });
      },
      async listByEmail(email) {
        const d = await mongo();
        return d
          .collection<Order>("orders")
          .find({ email }, { projection: { _id: 0 } })
          .toArray();
      },
    },
    users: {
      async upsert(email, name) {
        const d = await mongo();
        const existing = await d
          .collection<User>("users")
          .findOne({ email }, { projection: { _id: 0 } });
        if (existing) {
          if (name && !existing.name) {
            await d
              .collection<User>("users")
              .updateOne({ email }, { $set: { name } });
            existing.name = name;
          }
          return existing;
        }
        const user: User = {
          id: randomUUID(),
          email,
          name,
          createdAt: Date.now(),
          ownsKit: false,
        };
        await d.collection<User>("users").insertOne(user);
        return user;
      },
      async grantKit(email) {
        const d = await mongo();
        const res = await d
          .collection<User>("users")
          .findOneAndUpdate(
            { email },
            { $set: { ownsKit: true } },
            { returnDocument: "after", projection: { _id: 0 } }
          );
        return res ?? null;
      },
      async findByEmail(email) {
        const d = await mongo();
        return d
          .collection<User>("users")
          .findOne({ email }, { projection: { _id: 0 } });
      },
    },
    magicTokens: {
      async create(email, ttlMs = 15 * 60 * 1000) {
        const d = await mongo();
        const t: MagicToken = {
          token: randomUUID().replace(/-/g, ""),
          email,
          expiresAt: Date.now() + ttlMs,
          used: false,
        };
        await d.collection<MagicToken>("magic_tokens").insertOne(t);
        return t;
      },
      async consume(token) {
        const d = await mongo();
        const t = await d
          .collection<MagicToken>("magic_tokens")
          .findOne({ token }, { projection: { _id: 0 } });
        if (!t) return null;
        if (t.used || t.expiresAt < Date.now()) return null;
        await d
          .collection<MagicToken>("magic_tokens")
          .updateOne({ token }, { $set: { used: true } });
        t.used = true;
        return t;
      },
    },
    newsletter: {
      async subscribe(email) {
        const d = await mongo();
        const lower = email.toLowerCase();
        await d
          .collection("newsletter")
          .updateOne(
            { email: lower },
            { $setOnInsert: { email: lower, createdAt: Date.now() } },
            { upsert: true }
          );
      },
      async has(email) {
        const d = await mongo();
        const found = await d
          .collection("newsletter")
          .findOne({ email: email.toLowerCase() });
        return !!found;
      },
      async size() {
        const d = await mongo();
        return d.collection("newsletter").countDocuments();
      },
    },
  };
}

/* ────────── Public export ────────────────────────────────────── */

export const db: Database = MONGODB_URI ? mongoDb() : memoryDb();

/** Whether the persistence layer is the in-memory dev backend. */
export function isMemoryDb(): boolean {
  return !MONGODB_URI;
}
