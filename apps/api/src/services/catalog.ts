import { asc, eq } from "drizzle-orm";
import { canManageMenu, canManageTables, type Role } from "@restaurant/shared";
import type { Database } from "../db/client";
import { menuCategories, menuItems, tables } from "../db/schema";

export class CatalogService {
  constructor(private db: Database) {}
  listTables() { return this.db.select().from(tables).orderBy(asc(tables.position)); }
  createTable(role: Role, input: { name: string; position?: number }) {
    if (!canManageTables(role)) throw new Error("Forbidden");
    return this.db.insert(tables).values({ name: input.name, position: input.position ?? 0 }).returning();
  }
  updateTable(role: Role, id: string, input: Partial<{ name: string; position: number; enabled: boolean }>) {
    if (!canManageTables(role)) throw new Error("Forbidden");
    return this.db.update(tables).set(input).where(eq(tables.id, id)).returning();
  }
  async listMenu() {
    return this.db.select({
      id: menuItems.id, name: menuItems.name, description: menuItems.description,
      price: menuItems.price, imageUrl: menuItems.imageUrl, enabled: menuItems.enabled,
      categoryId: menuItems.categoryId, category: menuCategories.name,
    }).from(menuItems).innerJoin(menuCategories, eq(menuItems.categoryId, menuCategories.id));
  }
  listCategories() { return this.db.select().from(menuCategories).orderBy(asc(menuCategories.position)); }
  createCategory(role: Role, input: { name: string; position?: number }) {
    if (!canManageMenu(role)) throw new Error("Forbidden");
    return this.db.insert(menuCategories).values({ name: input.name, position: input.position ?? 0 }).returning();
  }
  createMenuItem(role: Role, input: typeof menuItems.$inferInsert) {
    if (!canManageMenu(role)) throw new Error("Forbidden");
    return this.db.insert(menuItems).values(input).returning();
  }
  updateMenuItem(role: Role, id: string, input: Partial<typeof menuItems.$inferInsert>) {
    if (!canManageMenu(role)) throw new Error("Forbidden");
    return this.db.update(menuItems).set(input).where(eq(menuItems.id, id)).returning();
  }
}
