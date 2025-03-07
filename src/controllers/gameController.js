const GameModel = require('../models/gameModel');

exports.getGames = async (req, res, next) => {
    try {
        let { name, platforms, edition, service, sort } = req.query;
        let games = await GameModel.getAllGames();

        if (!games || games.length === 0) {
            return res.status(404).json({ message: "No hay juegos disponibles en la base de datos" });
        }

        // Filtrar juegos por nombre
        if (name) {
            games = games.filter(game =>
                game.play_nombre.toLowerCase().includes(name.toLowerCase())
            );
        }

        // Filtrar por plataforma
        if (platforms) {
            games = games.filter(game =>
                game.play_platforms.toLowerCase() === platforms.toLowerCase()
            );
        }

        // Filtrar por edición
        if (edition) {
            games = games.filter(game =>
                game.play_edition.toLowerCase() === edition.toLowerCase()
            );
        }

        // Filtrar por servicio adicional
        if (service) {
            games = games.filter(game =>
                game.play_additional_service.toLowerCase() === service.toLowerCase()
            );
        }

        // Ordenamiento
        if (sort) {
            switch (sort) {
                case "name":
                    games.sort((a, b) => a.play_nombre.localeCompare(b.play_nombre));
                    break;
                case "original_price":
                    games.sort((a, b) => a.play_original_price - b.play_original_price);
                    break;
                case "current_price":
                    games.sort((a, b) => a.play_current_price - b.play_current_price);
                    break;
                case "discount":
                    games.sort((a, b) => b.play_discount - a.play_discount);
                    break;
                default:
                    break;
            }
        }

        if (games.length === 0) {
            return res.status(404).json({ message: "No se encontraron juegos con los filtros aplicados" });
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
