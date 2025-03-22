import express from "express";
import {PORT} from "./server.js";

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.listen(PORT, () => console.log(`Listening on ${PORT}`));