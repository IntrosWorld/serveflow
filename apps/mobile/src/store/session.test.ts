import { beforeEach, describe, expect, it } from "vitest";
import { useSession } from "./session";
describe("session", () => {
  beforeEach(() => useSession.setState({ role: undefined }));
  it("stores and clears an authenticated session", () => {
    useSession.getState().login({ role: "chef", token: "token", name: "Chef" });
    expect(useSession.getState().role).toBe("chef");
    expect(useSession.getState().token).toBe("token");
    useSession.getState().clearRole();
    expect(useSession.getState().role).toBeUndefined();
  });
});
