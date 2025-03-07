const GameModel = require('../models/gameModel');

exports.getGames = async (req, res, next) => {
    try {
        const data = await GameModel.getAllGames();
        res.status(200).json({
            games: data.Items,
            _links: {
                self: { href: "/api/games" }
            }
        });
    } catch (error) {
        next(error);
    }
};
