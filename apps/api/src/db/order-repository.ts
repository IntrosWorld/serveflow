import { and, eq, inArray, ne } from "drizzle-orm";
import type { OrderRepository, StoredItem, StoredOrder } from "../services/orders";
import type { Database } from "./client";
import { menuItems, orderBatches, orderItems, orders } from "./schema";
import { tables } from "./schema";

export class DrizzleOrderRepository implements OrderRepository {
  constructor(private db: Database) {}
  async findTableName(tableId: string) {
    const [table] = await this.db.select({ name: tables.name }).from(tables).where(eq(tables.id, tableId)).limit(1);
    return table?.name;
  }
  async list(): Promise<StoredOrder[]> {
    const rows = await this.db.select().from(orders).where(ne(orders.status, "completed"));
    return Promise.all(rows.map((order) => this.hydrate(order.id, order.tableId)));
  }
  async findActiveByTable(tableId: string) {
    const [order] = await this.db.select().from(orders).where(and(eq(orders.tableId, tableId), ne(orders.status, "completed"))).limit(1);
    return order ? this.hydrate(order.id, order.tableId) : undefined;
  }
  async findByIdempotencyKey(key: string) {
    const [batch] = await this.db.select().from(orderBatches).where(eq(orderBatches.idempotencyKey, key)).limit(1);
    if (!batch) return undefined;
    const items = await this.db.select({ id: orderItems.id }).from(orderItems).where(eq(orderItems.batchId, batch.id));
    return { batchType: batch.type, itemIds: items.map((x) => x.id) };
  }
  async saveSubmission(
    key: string,
    order: StoredOrder,
    items: StoredItem[],
    submitted: { menuItemId: string; quantity: number; note?: string }[] = [],
  ) {
    const [existing] = await this.db.select().from(orders).where(eq(orders.id, order.id)).limit(1);
    if (!existing) await this.db.insert(orders).values({ id: order.id, tableId: order.tableId });
    const batch = order.batches.at(-1)!;
    const [savedBatch] = await this.db.insert(orderBatches).values({ orderId: order.id, type: batch.type, sequence: order.batches.length, idempotencyKey: key }).returning();
    const menuIds = submitted.map((x) => x.menuItemId);
    const dishes = menuIds.length ? await this.db.select().from(menuItems).where(inArray(menuItems.id, menuIds)) : [];
    await this.db.insert(orderItems).values(items.map((item, index) => {
      const input = submitted[index]; const dish = dishes.find((x) => x.id === input?.menuItemId);
      if (!input || !dish) throw new Error("Menu item not found");
      return { id: item.id, batchId: savedBatch.id, menuItemId: dish.id, nameSnapshot: dish.name, priceSnapshot: dish.price, quantity: input.quantity, note: input.note, status: item.status };
    }));
    return { batchType: batch.type, itemIds: items.map((x) => x.id) };
  }
  async findItem(id: string) {
    const [item] = await this.db.select({ id: orderItems.id, status: orderItems.status }).from(orderItems).where(eq(orderItems.id, id)).limit(1);
    return item;
  }
  async saveItem(item: StoredItem) {
    await this.db.update(orderItems).set({ status: item.status }).where(eq(orderItems.id, item.id));
  }
  private async hydrate(orderId: string, tableId: string): Promise<StoredOrder> {
    const batches = await this.db.select().from(orderBatches).where(eq(orderBatches.orderId, orderId));
    return { id: orderId, tableId, batches: await Promise.all(batches.map(async (batch) => ({
      type: batch.type,
      itemIds: (await this.db.select({ id: orderItems.id }).from(orderItems).where(eq(orderItems.batchId, batch.id))).map((x) => x.id),
    }))) };
  }
}
