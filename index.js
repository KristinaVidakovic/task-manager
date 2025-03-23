import express from "express";
import databaseConnection, { PORT } from "./server.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", async (req, res) => {
    const dbStatus = await databaseConnection();
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        database: dbStatus === 1 ? 'Connected' : 'Not Connected',
    });
})

app.listen(PORT,() => {
    console.log(`Listening on ${PORT}`);
})