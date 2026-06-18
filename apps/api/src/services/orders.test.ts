import { describe, expect, it } from "vitest";
import { InMemoryOrderRepository, OrderService } from "./orders";

const firstItem = {
  menuItemId: "11111111-1111-4111-8111-111111111111",
  quantity: 2,
  note: "Less spicy",
};

describe("OrderService", () => {
  it("includes the display table name in the kitchen queue", async () => {
    const repo = new InMemoryOrderRepository();
    repo.setTableName("22222222-2222-4222-8222-222222222222", "T08");
    const service = new OrderService(repo);
    await service.submit({
      tableId: "22222222-2222-4222-8222-222222222222",
      idempotencyKey: "table-name-order",
      items: [firstItem],
    });
    expect((await service.list())[0].tableName).toBe("T08");
  });

  it("creates the first batch as an original order", async () => {
    const service = new OrderService(new InMemoryOrderRepository());
    const result = await service.submit({
      tableId: "22222222-2222-4222-8222-222222222222",
      idempotencyKey: "first-order",
      items: [firstItem],
    });
    expect(result.batchType).toBe("original");
  });

  it("creates an added-later batch after cooking starts", async () => {
    const repo = new InMemoryOrderRepository();
    const service = new OrderService(repo);
    const order = await service.submit({
      tableId: "22222222-2222-4222-8222-222222222222",
      idempotencyKey: "first-order",
      items: [firstItem],
    });
    await service.updateItemStatus(order.itemIds[0], "chef", "started");
    const result = await service.submit({
      tableId: "22222222-2222-4222-8222-222222222222",
      idempotencyKey: "second-order",
      items: [{ ...firstItem, quantity: 1 }],
    });
    expect(result.batchType).toBe("added_later");
  });

  it("rejects waiter changes to started items", async () => {
    const repo = new InMemoryOrderRepository();
    const service = new OrderService(repo);
    const order = await service.submit({
      tableId: "22222222-2222-4222-8222-222222222222",
      idempotencyKey: "first-order",
      items: [firstItem],
    });
    await service.updateItemStatus(order.itemIds[0], "chef", "started");
    await expect(
      service.updateItemStatus(order.itemIds[0], "waiter", "cancelled"),
    ).rejects.toThrow("Item is locked");
  });
});
