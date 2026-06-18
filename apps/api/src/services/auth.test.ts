import { describe, expect, it } from "vitest";
import { AuthService } from "./auth";

describe("AuthService", () => {
  it("accepts each configured account and returns its role", () => {
    const auth = new AuthService("test-secret");
    expect(auth.login("admin", "admin123").role).toBe("admin");
    expect(auth.login("chef", "chef123").role).toBe("chef");
    expect(auth.login("waiter", "waiter123").role).toBe("waiter");
    expect(auth.login("customer", "customer123").role).toBe("customer");
  });

  it("rejects invalid credentials", () => {
    expect(() => new AuthService("test-secret").login("chef", "wrong")).toThrow("Invalid credentials");
  });

  it("verifies issued tokens", () => {
    const auth = new AuthService("test-secret");
    const session = auth.login("waiter", "waiter123");
    expect(auth.verify(session.token).role).toBe("waiter");
  });
});
