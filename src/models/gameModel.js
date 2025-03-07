const { docClient, ScanCommand, TABLE_NAME } = require('../services/dynamoService');

const GameModel = {
    async getAllGames() {
        const command = new ScanCommand({ TableName: TABLE_NAME });
        const response = await docClient.send(command);
        return response.Items;
    }
};

module.exports = GameModel;
