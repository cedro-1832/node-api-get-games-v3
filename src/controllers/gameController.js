const GameModel = require('../models/gameModel');

exports.getGames = async (req, res, next) => {
    try {
        const games = await GameModel.getAllGames();

        if (games.length === 0) {
            return res.status(404).json({
                message: "No hay juegos disponibles en la base de datos"
            });
        }

        res.status(200).json({
            games,
            _links: {
                self: { href: "/api/games" }
            }
        });
    } catch (error) {
        console.error("❌ ERROR en getGames:", error);
        next(error);
    }
};
