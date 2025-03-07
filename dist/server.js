require('dotenv').config(); // Asegura que las variables de entorno se carguen

const app = require('./src/app');
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
