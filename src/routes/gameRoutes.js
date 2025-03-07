const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, gameController.getGames); // Soporta búsqueda con query ?name=

module.exports = router;
