import express from "express";
import databaseConnection, { PORT } from "./server.js";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import authRoute from "./routes/auth.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerDocument = JSON.parse(fs.readFileSync('./config/swagger.json', 'utf8'));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/health", (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString()
    });
})

app.use("/api/auth", authRoute);

app.listen(PORT, async () => {
    console.log(`Listening on ${PORT}`);
    await databaseConnection();
})