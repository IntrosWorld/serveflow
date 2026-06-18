import { describe, expect, it } from "vitest";
import {
  canEditItem,
  canManageMenu,
  isAddedLaterBatch,
  transitionItemStatus,
} from "./index";

describe("role permissions", () => {
  it("only lets chefs manage the menu", () => {
    expect(canManageMenu("chef")).toBe(true);
    expect(canManageMenu("waiter")).toBe(false);
    expect(canManageMenu("customer")).toBe(false);
  });

  it("locks an item for a waiter after cooking starts", () => {
    expect(canEditItem("waiter", "pending")).toBe(true);
    expect(canEditItem("waiter", "started")).toBe(false);
    expect(canEditItem("chef", "started")).toBe(true);
  });
});

describe("order state", () => {
  it("allows only valid chef transitions", () => {
    expect(transitionItemStatus("chef", "pending", "started")).toBe("started");
    expect(() => transitionItemStatus("chef", "completed", "pending")).toThrow(
      "Invalid item status transition",
    );
  });

  it("marks batches submitted after preparation as added later", () => {
    expect(isAddedLaterBatch(false)).toBe(false);
    expect(isAddedLaterBatch(true)).toBe(true);
  });
});
