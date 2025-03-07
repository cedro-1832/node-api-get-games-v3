const { docClient, ScanCommand, TABLE_NAME } = require('../services/dynamoService');

const GameModel = {
    async getAllGames() {
        try {
            const command = new ScanCommand({ TableName: TABLE_NAME });
            const response = await docClient.send(command);

            // Si la tabla está vacía, devuelve un array vacío
            if (!response.Items || response.Items.length === 0) {
                return [];
            }

            // Transformar los datos para que sigan el formato requerido
            return response.Items.map(game => ({
                play_guid: game.guid || "",
                play_fecha_extraccion: game.fecha_extraccion || "",
                play_id: game.id || "",
                play_nombre: game.nombre || "",
                play_original_price: game.original_price || 0,
                play_current_price: game.current_price || 0,
                play_discount: game.discount || 0,
                play_platforms: game.platforms || "",
                play_edition: game.edition || "",
                play_additional_service: game.additional_service || "",
                play_purchase_link: game.purchase_link || "",
                play_image_url: game.image_url || "",
                play_url_origen: game.url_origen || ""
            }));
        } catch (error) {
            console.error("❌ ERROR al obtener juegos de DynamoDB:", error);
            throw new Error("No se pudieron obtener los juegos");
        }
    }
};

module.exports = GameModel;
