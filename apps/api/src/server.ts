import "dotenv/config";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { createApp } from "./app";
import { InMemoryOrderRepository, OrderService } from "./services/orders";

const httpServer = createServer();
const io = new Server(httpServer, { cors: { origin: "*" } });
const service = new OrderService(new InMemoryOrderRepository(), (event, payload) => {
  io.emit(event, payload);
});
httpServer.on("request", createApp(service));
httpServer.listen(Number(process.env.PORT ?? 4000), () => console.log("API listening on :4000"));
