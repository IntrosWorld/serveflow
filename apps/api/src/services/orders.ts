import {
  canEditItem,
  createOrderSchema,
  transitionItemStatus,
  type ItemStatus,
  type Role,
} from "@restaurant/shared";
import { randomUUID } from "node:crypto";

export type StoredItem = { id: string; status: ItemStatus };
export type StoredOrder = {
  id: string;
  tableId: string;
  batches: { type: "original" | "added_later"; itemIds: string[] }[];
};

export interface OrderRepository {
  findTableName(tableId: string): Promise<string | undefined>;
  list(): Promise<StoredOrder[]>;
  findActiveByTable(tableId: string): Promise<StoredOrder | undefined>;
  findByIdempotencyKey(key: string): Promise<{ batchType: "original" | "added_later"; itemIds: string[] } | undefined>;
  saveSubmission(key: string, order: StoredOrder, items: StoredItem[], submitted?: { menuItemId: string; quantity: number; note?: string }[]): Promise<{ batchType: "original" | "added_later"; itemIds: string[] }>;
  findItem(id: string): Promise<StoredItem | undefined>;
  saveItem(item: StoredItem): Promise<void>;
}

export class InMemoryOrderRepository implements OrderRepository {
  private orders = new Map<string, StoredOrder>();
  private items = new Map<string, StoredItem>();
  private keys = new Map<string, { batchType: "original" | "added_later"; itemIds: string[] }>();
  private tableNames = new Map<string, string>();
  setTableName(tableId: string, name: string) { this.tableNames.set(tableId, name); }
  async findTableName(tableId: string) { return this.tableNames.get(tableId); }
  async list() { return [...this.orders.values()]; }
  async findActiveByTable(tableId: string) { return [...this.orders.values()].find((o) => o.tableId === tableId); }
  async findByIdempotencyKey(key: string) { return this.keys.get(key); }
  async saveSubmission(key: string, order: StoredOrder, items: StoredItem[]) {
    this.orders.set(order.id, order);
    items.forEach((item) => this.items.set(item.id, item));
    const batch = order.batches.at(-1)!;
    const result = { batchType: batch.type, itemIds: batch.itemIds };
    this.keys.set(key, result);
    return result;
  }
  async findItem(id: string) { return this.items.get(id); }
  async saveItem(item: StoredItem) { this.items.set(item.id, item); }
}

export class OrderService {
  constructor(
    private repository: OrderRepository,
    private publish: (event: string, payload: unknown) => Promise<void> | void = () => {},
  ) {}

  async submit(input: unknown) {
    const data = createOrderSchema.parse(input);
    const duplicate = await this.repository.findByIdempotencyKey(data.idempotencyKey);
    if (duplicate) return duplicate;
    const existing = await this.repository.findActiveByTable(data.tableId);
    const hasStartedItems = existing
      ? (await Promise.all(existing.batches.flatMap((b) => b.itemIds).map((id) => this.repository.findItem(id))))
          .some((item) => item && item.status !== "pending")
      : false;
    const batchType = hasStartedItems ? "added_later" : "original";
    const items = data.items.map(() => ({ id: randomUUID(), status: "pending" as const }));
    const order = existing ?? { id: randomUUID(), tableId: data.tableId, batches: [] };
    order.batches.push({ type: batchType, itemIds: items.map((item) => item.id) });
    const result = await this.repository.saveSubmission(data.idempotencyKey, order, items, data.items);
    await this.publish(batchType === "added_later" ? "order.added_later" : "order.created", { orderId: order.id, tableId: order.tableId });
    return result;
  }

  async list() {
    const orders = await this.repository.list();
    return Promise.all(orders.map(async (order) => ({
      ...order,
      tableName: await this.repository.findTableName(order.tableId) ?? order.tableId,
      batches: await Promise.all(order.batches.map(async (batch) => ({
        type: batch.type,
        items: (await Promise.all(batch.itemIds.map((id) => this.repository.findItem(id)))).filter(Boolean),
      }))),
    })));
  }

  async updateItemStatus(itemId: string, role: Role, next: ItemStatus) {
    const item = await this.repository.findItem(itemId);
    if (!item) throw new Error("Item not found");
    if (!canEditItem(role, item.status)) throw new Error("Item is locked");
    item.status = role === "chef" || role === "admin" ? transitionItemStatus(role, item.status, next) : next;
    await this.repository.saveItem(item);
    await this.publish("order.item_updated", { itemId, status: item.status });
    return item;
  }
}
