require('dotenv').config({ path: __dirname + '/../.env' });
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

// Seguridad y configuración
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);

// Middleware de errores
app.use(errorMiddleware);

module.exports = app;
