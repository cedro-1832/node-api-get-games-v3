const jwt = require('jsonwebtoken');
const lodashIncludes = require('lodash.includes'); // 🔴 Asegurar que lodash.includes está disponible

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Acceso denegado. Token requerido." });
    }

    try {
        const token = authHeader.split(" ")[1];
        if (!process.env.JWT_SECRET) {
            console.error("❌ ERROR: JWT_SECRET no está definido en las variables de entorno.");
            return res.status(500).json({ message: "Error interno del servidor. JWT_SECRET no definido." });
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        console.error("Error de autenticación:", error);
        return res.status(401).json({ message: "Token inválido" });
    }
};
