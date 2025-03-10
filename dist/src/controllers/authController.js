const jwt = require('jsonwebtoken');
require('dotenv').config(); // Asegura que las variables de entorno se carguen correctamente

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Simulación de autenticación
        if (username !== "admin" || password !== "password123") {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        // Validar que JWT_SECRET está definido
        if (!process.env.JWT_SECRET) {
            console.error("❌ ERROR: JWT_SECRET no está definido en el entorno");
            return res.status(500).json({ message: "Error interno del servidor", error: "JWT_SECRET no está definido en el entorno" });
        }

        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        next(error);
    }
};
