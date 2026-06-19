import jwt from "jsonwebtoken";
import { roleSchema, type Role } from "@restaurant/shared";

const accounts: Record<string, { password: string; role: Role; name: string }> = {
  admin: { password: "admin123", role: "admin", name: "Administrator" },
  chef: { password: "chef123", role: "chef", name: "Kitchen Chef" },
  waiter: { password: "waiter123", role: "waiter", name: "Floor Waiter" },
  customer: { password: "customer123", role: "customer", name: "Customer" },
};

export class AuthService {
  constructor(private secret: string) {}
  login(username: string, password: string) {
    const account = accounts[username.toLowerCase()];
    if (!account || account.password !== password) throw new Error("Invalid credentials");
    return {
      token: jwt.sign({ sub: username.toLowerCase(), role: account.role, name: account.name }, this.secret, { expiresIn: "7d" }),
      role: account.role,
      name: account.name,
      username: username.toLowerCase(),
    };
  }
  verify(token: string) {
    const payload = jwt.verify(token, this.secret);
    if (typeof payload === "string") throw new Error("Invalid session");
    return { username: String(payload.sub), role: roleSchema.parse(payload.role), name: String(payload.name) };
  }
  listAccounts() {
    return Object.entries(accounts).map(([username, value]) => ({ username, role: value.role, name: value.name }));
  }
}
