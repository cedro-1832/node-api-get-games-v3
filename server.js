require("dotenv").config();

console.log("🔍 Cargando configuración con dotenv...");
if (!process.env.JWT_SECRET) {
    console.error("❌ ERROR: JWT_SECRET no definido en el entorno");
    process.exit(1);
}
console.log("🔐 JWT_SECRET cargado correctamente");

const express = require("express");
const serverless = require("serverless-http");

const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());

const gameRoutes = require("./src/routes/gameRoutes");
const authRoutes = require("./src/routes/authRoutes");

app.use("/api/games", gameRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

module.exports.handler = serverless(app);
