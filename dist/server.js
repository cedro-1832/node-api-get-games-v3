require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");

const app = express();
app.use(express.json());

// Rutas
const gameRoutes = require("./routes/gameRoutes");
const authRoutes = require("./routes/authRoutes");

// Definir endpoints
app.use("/api/games", gameRoutes);
app.use("/api/auth", authRoutes);

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

// Exportar el handler de Express para AWS Lambda
module.exports.handler = serverless(app);
