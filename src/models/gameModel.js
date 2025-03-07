const { docClient, ScanCommand, TABLE_NAME } = require('../services/dynamoService');

const GameModel = {
    async getAllGames() {
        try {
            const command = new ScanCommand({ TableName: TABLE_NAME });
            const response = await docClient.send(command);

            // Si la tabla está vacía, devuelve un array vacío
            return response.Items || [];
        } catch (error) {
            console.error("❌ ERROR al obtener juegos de DynamoDB:", error);
            throw new Error("No se pudieron obtener los juegos");
        }
    }
};

module.exports = GameModel;