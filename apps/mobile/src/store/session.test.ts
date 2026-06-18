import { beforeEach, describe, expect, it } from "vitest";
import { useSession } from "./session";
describe("session", () => {
  beforeEach(() => useSession.setState({ role: undefined }));
  it("selects and clears a role", () => {
    useSession.getState().setRole("chef");
    expect(useSession.getState().role).toBe("chef");
    useSession.getState().clearRole();
    expect(useSession.getState().role).toBeUndefined();
  });
});
