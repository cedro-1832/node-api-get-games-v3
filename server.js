require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const serverless = require("serverless-http");

const app = express();
app.use(express.json());

const gameRoutes = require("./src/routes/gameRoutes");
const authRoutes = require("./src/routes/authRoutes");

app.use("/api/games", gameRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

module.exports.handler = serverless(app);
