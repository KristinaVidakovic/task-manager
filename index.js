import express from "express";
import databaseConnection, { PORT } from "./server.js";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import { authRoute } from "./routes/auth.route.js";
import { healthRoute } from "./routes/health.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerDocument = JSON.parse(fs.readFileSync('./config/swagger.json', 'utf8'));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(healthRoute);
app.use(authRoute);

app.listen(PORT, async () => {
    console.log(`Listening on ${PORT}`);
    await databaseConnection();
})