import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { createTask, getAllTasks, getTaskById, updateTask } from "../controllers/task.controller.js";

const taskRoute = Router();
const baseUrl = "/api/tasks";

taskRoute.post(`${baseUrl}`, authorize, createTask);
taskRoute.get(`${baseUrl}`, authorize, getAllTasks);
taskRoute.get(`${baseUrl}/:id`, authorize, getTaskById);
taskRoute.put(`${baseUrl}/:id`, authorize, updateTask);

export { taskRoute };
