const { docClient, ScanCommand, TABLE_NAME } = require('../services/dynamoService');

const GameModel = {
    async getAllGames() {
        try {
            const command = new ScanCommand({ TableName: TABLE_NAME });
            const response = await docClient.send(command);

            // Validar si hay elementos en la tabla
            if (!response.Items || response.Items.length === 0) {
                console.warn("⚠️ No se encontraron juegos en la base de datos.");
                return [];
            }

            // Mapear los datos y asegurarnos de que los campos estén en el orden correcto
            return response.Items.map(game => ({
                play_guid: game.play_guid || "GUID-NO-DATA",
                play_fecha_extraccion: game.play_fecha_extraccion || new Date().toISOString(),
                play_id: game.play_id || "ID-NO-DATA",
                play_nombre: game.play_nombre || "Nombre no disponible",
                play_original_price: game.original_price || 0.00,
                play_current_price: game.current_price || 0.00,
                play_discount: game.discount || 0,
                play_platforms: game.platforms || "No disponible",
                play_edition: game.edition || "No disponible",
                play_additional_service: game.additional_service || "No disponible",
                play_purchase_link: game.purchase_link || "No disponible",
                play_image_url: game.image_url || "No disponible",
                play_url_origen: game.play_url_origen || "No disponible"
            }));

        } catch (error) {
            console.error("❌ ERROR al obtener juegos de DynamoDB:", error);
            throw new Error("No se pudieron obtener los juegos");
        }
    }
};

module.exports = GameModel;
