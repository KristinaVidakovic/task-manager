import express from "express";
import databaseConnection, { PORT } from "./server.js";

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.listen(PORT, async () => {
    console.log(`Listening on ${PORT}`);
    await databaseConnection();
})