const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, gameController.getGames);

module.exports = router;
