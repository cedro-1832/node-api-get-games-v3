const { docClient, ScanCommand, TABLE_NAME } = require('../services/dynamoService');

const GameModel = {
    async getAllGames() {
        try {
            console.log("📡 Consultando juegos en DynamoDB...");
            const command = new ScanCommand({ TableName: TABLE_NAME });
            const response = await docClient.send(command);

            if (!response.Items || response.Items.length === 0) {
                console.warn("⚠️ No hay juegos en la base de datos.");
                return [];
            }

            return response.Items.map(game => ({
                play_guid: game.guid || "N/A",
                play_fecha_extraccion: game.fecha_extraccion || "N/A",
                play_id: game.id || "N/A",
                play_nombre: game.nombre || "N/A",
                play_original_price: game.original_price || 0,
                play_current_price: game.current_price || 0,
                play_discount: game.discount || 0,
                play_platforms: game.platforms || "N/A",
                play_edition: game.edition || "N/A",
                play_additional_service: game.additional_service || "N/A",
                play_purchase_link: game.purchase_link || "N/A",
                play_image_url: game.image_url || "N/A",
                play_url_origen: game.url_origen || "N/A"
            }));
        } catch (error) {
            console.error("❌ ERROR al obtener juegos de DynamoDB:", error);
            throw new Error("No se pudieron obtener los juegos");
        }
    }
};

module.exports = GameModel;
