import "dotenv/config";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { createApp } from "./app";
import { AuthService } from "./services/auth";
import { CatalogService } from "./services/catalog";
import { createDatabase } from "./db/client";
import { DrizzleOrderRepository } from "./db/order-repository";
import { NotificationService } from "./services/notifications";
import { InMemoryOrderRepository, OrderService } from "./services/orders";

const httpServer = createServer();
const io = new Server(httpServer, { cors: { origin: "*" } });
const notifications = new NotificationService();
const database = process.env.DATABASE_URL ? createDatabase() : undefined;
const repository = database ? new DrizzleOrderRepository(database) : new InMemoryOrderRepository();
const service = new OrderService(repository, async (event, payload) => {
  io.emit(event, payload);
  if (event === "order.created" || event === "order.added_later") {
    await notifications.notifyChefs(event, payload as { orderId?: string; tableId?: string });
  }
});
const auth = new AuthService(process.env.JWT_SECRET ?? "change-this-secret");
const catalog = database ? new CatalogService(database) : undefined;
httpServer.on("request", createApp(service, auth, catalog, notifications));
httpServer.listen(Number(process.env.PORT ?? 4000), () => console.log("API listening on :4000"));
