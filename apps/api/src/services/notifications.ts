import type { Role } from "@restaurant/shared";
type Device = { token: string; role: Role };
export class NotificationService {
  private devices = new Map<string, Device>();
  register(device: Device) { this.devices.set(device.token, device); }
  async notifyChefs(event: string, payload: { orderId?: string; tableId?: string }) {
    const tokens = [...this.devices.values()].filter((x) => x.role === "chef" || x.role === "admin").map((x) => x.token);
    if (!tokens.length) return;
    const added = event === "order.added_later";
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify(tokens.map((to) => ({
        to, sound: "default",
        title: added ? "Dishes added later" : "New kitchen order",
        body: added ? "A table added more dishes." : "A new order is waiting.",
        data: { event, ...payload },
      }))),
    });
  }
}
