const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { fromIni } = require("@aws-sdk/credential-provider-ini");
require('dotenv').config(); // Cargar variables de entorno

// Configuración de DynamoDB
const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: fromIni() // Carga credenciales automáticamente desde ~/.aws/credentials
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "PlayStationGames_v3";

module.exports = { docClient, ScanCommand, TABLE_NAME };
