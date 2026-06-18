import cors from "cors";
import express from "express";
import { z } from "zod";
import { itemStatusSchema } from "@restaurant/shared";
import type { AuthService } from "./services/auth";
import type { CatalogService } from "./services/catalog";
import type { OrderService } from "./services/orders";
import type { NotificationService } from "./services/notifications";

declare global {
  namespace Express {
    interface Request { session?: ReturnType<AuthService["verify"]>; }
  }
}

export function createApp(orders: OrderService, auth: AuthService, catalog?: CatalogService, notifications?: NotificationService) {
  const app = express();
  app.use(cors()); app.use(express.json());
  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.post("/auth/login", (req, res, next) => {
    try {
      const body = z.object({ username: z.string(), password: z.string() }).parse(req.body);
      res.json(auth.login(body.username, body.password));
    } catch (error) { next(error); }
  });
  app.use((req, _res, next) => {
    try {
      const token = req.headers.authorization?.replace(/^Bearer /, "");
      if (!token) throw new Error("Authentication required");
      req.session = auth.verify(token); next();
    } catch (error) { next(error); }
  });
  app.get("/auth/me", (req, res) => res.json(req.session));
  app.get("/accounts", (req, res) => {
    if (req.session?.role !== "admin") throw new Error("Forbidden");
    res.json(auth.listAccounts());
  });
  app.get("/tables", async (_req, res, next) => { try { res.json(await catalog?.listTables() ?? []); } catch (e) { next(e); } });
  app.post("/tables", async (req, res, next) => { try { res.status(201).json(await catalog?.createTable(req.session!.role, req.body)); } catch (e) { next(e); } });
  app.patch("/tables/:id", async (req, res, next) => { try { res.json(await catalog?.updateTable(req.session!.role, req.params.id, req.body)); } catch (e) { next(e); } });
  app.get("/menu", async (_req, res, next) => { try { res.json(await catalog?.listMenu() ?? []); } catch (e) { next(e); } });
  app.get("/categories", async (_req, res, next) => { try { res.json(await catalog?.listCategories() ?? []); } catch (e) { next(e); } });
  app.post("/categories", async (req, res, next) => { try { res.status(201).json(await catalog?.createCategory(req.session!.role, req.body)); } catch (e) { next(e); } });
  app.post("/menu", async (req, res, next) => { try { res.status(201).json(await catalog?.createMenuItem(req.session!.role, req.body)); } catch (e) { next(e); } });
  app.patch("/menu/:id", async (req, res, next) => { try { res.json(await catalog?.updateMenuItem(req.session!.role, req.params.id, req.body)); } catch (e) { next(e); } });
  app.post("/orders", async (req, res, next) => { try { res.status(201).json(await orders.submit(req.body)); } catch (e) { next(e); } });
  app.get("/orders", async (_req, res, next) => { try { res.json(await orders.list()); } catch (e) { next(e); } });
  app.patch("/order-items/:id/status", async (req, res, next) => {
    try { const { status } = z.object({ status: itemStatusSchema }).parse(req.body); res.json(await orders.updateItemStatus(req.params.id, req.session!.role, status)); } catch (e) { next(e); }
  });
  app.post("/devices", (req, res) => {
    const body = z.object({ token: z.string().min(10) }).parse(req.body);
    notifications?.register({ token: body.token, role: req.session!.role });
    res.status(204).end();
  });
  app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = /Authentication/.test(error.message) ? 401 : /Forbidden|locked/.test(error.message) ? 403 : 400;
    res.status(status).json({ error: error.message });
  });
  return app;
}
