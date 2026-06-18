import { beforeEach, describe, expect, it } from "vitest";
import { useCart } from "./cart";
describe("cart", () => {
  beforeEach(() => useCart.setState({ items: [] }));
  it("adds quantities and calculates total", () => {
    const item = { id: "1", name: "Paneer", price: 200 };
    useCart.getState().add(item); useCart.getState().add(item);
    expect(useCart.getState().items[0].quantity).toBe(2);
    expect(useCart.getState().total()).toBe(400);
  });
});
