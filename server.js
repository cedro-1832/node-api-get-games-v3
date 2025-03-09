require("dotenv").config();

console.log("🔍 Cargando configuración con dotenv...");
if (!process.env.JWT_SECRET) {
    console.error("❌ ERROR: JWT_SECRET no definido en el entorno");
    process.exit(1);
}
console.log("🔐 JWT_SECRET cargado correctamente");

const express = require("express");
const serverless = require("serverless-http");

// Verificar la existencia del módulo lodash.includes
try {
    require.resolve("lodash.includes");
    console.log("✅ lodash.includes encontrado");
} catch (err) {
    console.error("❌ ERROR: lodash.includes no encontrado. Intenta reinstalar con 'npm install lodash.includes'");
    process.exit(1);
}

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
