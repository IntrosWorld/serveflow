import cors from "cors";
import express from "express";
import { z } from "zod";
import { itemStatusSchema, roleSchema } from "@restaurant/shared";
import type { OrderService } from "./services/orders";

export function createApp(orders: OrderService) {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.post("/orders", async (req, res, next) => {
    try { res.status(201).json(await orders.submit(req.body)); } catch (error) { next(error); }
  });
  app.patch("/order-items/:id/status", async (req, res, next) => {
    try {
      const body = z.object({ role: roleSchema, status: itemStatusSchema }).parse(req.body);
      res.json(await orders.updateItemStatus(req.params.id, body.role, body.status));
    } catch (error) { next(error); }
  });
  app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(400).json({ error: error.message });
  });
  return app;
}
