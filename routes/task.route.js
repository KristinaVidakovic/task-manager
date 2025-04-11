import {Router} from "express";
import authorize from "../middlewares/auth.middleware.js";
import {createTask} from "../controllers/task.controller.js";

const taskRoute = Router();
const baseUrl = "/api/tasks";

taskRoute.post(`${baseUrl}`, authorize, createTask);

export { taskRoute };