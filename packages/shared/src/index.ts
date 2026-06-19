import { z } from "zod";

export const roleSchema = z.enum(["admin", "waiter", "chef", "customer"]);
export type Role = z.infer<typeof roleSchema>;

export const itemStatusSchema = z.enum([
  "pending",
  "started",
  "ready",
  "completed",
  "cancelled",
]);
export type ItemStatus = z.infer<typeof itemStatusSchema>;

export const tableStatusSchema = z.enum([
  "available",
  "pending",
  "preparing",
  "added_later",
  "completed",
]);
export type TableStatus = z.infer<typeof tableStatusSchema>;

export const orderItemInputSchema = z.object({
  menuItemId: z.string().uuid(),
  quantity: z.number().int().positive(),
  note: z.string().trim().max(240).optional(),
});

export const createOrderSchema = z.object({
  tableId: z.string().uuid(),
  idempotencyKey: z.string().min(8).max(100),
  items: z.array(orderItemInputSchema).min(1),
});

export function canManageMenu(role: Role): boolean {
  return role === "chef" || role === "admin";
}

export function canManageTables(role: Role): boolean {
  return role === "chef" || role === "waiter" || role === "admin";
}

export function canEditItem(role: Role, status: ItemStatus): boolean {
  if (role === "chef" || role === "admin") return true;
  return role === "waiter" && status === "pending";
}

const chefTransitions: Record<ItemStatus, ItemStatus[]> = {
  pending: ["started", "cancelled"],
  started: ["ready"],
  ready: ["completed"],
  completed: [],
  cancelled: [],
};

export function transitionItemStatus(
  role: Role,
  current: ItemStatus,
  next: ItemStatus,
): ItemStatus {
  if ((role !== "chef" && role !== "admin") || !chefTransitions[current].includes(next)) {
    throw new Error("Invalid item status transition");
  }
  return next;
}

export function isAddedLaterBatch(hasStartedItems: boolean): boolean {
  return hasStartedItems;
}
