import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const role = pgEnum("role", ["waiter", "chef", "customer"]);
export const itemStatus = pgEnum("item_status", ["pending", "started", "ready", "completed", "cancelled"]);
export const batchType = pgEnum("batch_type", ["original", "added_later"]);

export const tables = pgTable("tables", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  position: integer("position").notNull().default(0),
  enabled: boolean("enabled").notNull().default(true),
});
export const menuCategories = pgTable("menu_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  position: integer("position").notNull().default(0),
  enabled: boolean("enabled").notNull().default(true),
});
export const menuItems = pgTable("menu_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id").references(() => menuCategories.id).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  price: integer("price").notNull(),
  imageUrl: text("image_url"),
  enabled: boolean("enabled").notNull().default(true),
});
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  tableId: uuid("table_id").references(() => tables.id).notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
export const orderBatches = pgTable("order_batches", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id).notNull(),
  type: batchType("type").notNull(),
  sequence: integer("sequence").notNull(),
  idempotencyKey: text("idempotency_key").unique().notNull(),
});
export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  batchId: uuid("batch_id").references(() => orderBatches.id).notNull(),
  menuItemId: uuid("menu_item_id").references(() => menuItems.id).notNull(),
  nameSnapshot: text("name_snapshot").notNull(),
  priceSnapshot: integer("price_snapshot").notNull(),
  quantity: integer("quantity").notNull(),
  note: text("note"),
  status: itemStatus("status").notNull().default("pending"),
});
export const devices = pgTable("devices", {
  id: uuid("id").defaultRandom().primaryKey(),
  token: text("token").unique().notNull(),
  role: role("role").notNull(),
  enabled: boolean("enabled").notNull().default(true),
});
export const orderEvents = pgTable("order_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id).notNull(),
  type: text("type").notNull(),
  actorRole: role("actor_role").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
