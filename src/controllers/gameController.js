const GameModel = require('../models/gameModel');

exports.getGames = async (req, res, next) => {
    try {
        const { name } = req.query; // Obtiene el parámetro de consulta "name"
        let games = await GameModel.getAllGames();

        if (!games || games.length === 0) {
            return res.status(404).json({ message: "No hay juegos disponibles en la base de datos" });
        }

        // Filtrar juegos si se proporciona un nombre
        if (name) {
            games = games.filter(game =>
                game.play_nombre.toLowerCase().includes(name.toLowerCase())
            );

            if (games.length === 0) {
                return res.status(404).json({ message: `No se encontraron juegos con el nombre "${name}"` });
            }
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
