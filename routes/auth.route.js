import { Router } from "express";
import { register } from "../controllers/auth.controller.js";

const authRoute = Router();
const baseUrl = "/api/auth";

authRoute.post(`${baseUrl}/register`, register);

export { authRoute };