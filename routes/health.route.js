import { Router } from "express";
import { health } from "../controllers/health.controller.js";

const healthRoute = Router();

healthRoute.get("/health", health);

export { healthRoute };
