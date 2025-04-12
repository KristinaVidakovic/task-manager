import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";

const authRoute = Router();
const baseUrl = "/api/auth";

authRoute.post(`${baseUrl}/register`, register);
authRoute.post(`${baseUrl}/login`, login);

export { authRoute };
