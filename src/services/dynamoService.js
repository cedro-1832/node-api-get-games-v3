const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { fromEnv } = require("@aws-sdk/credential-provider-env");
require('dotenv').config(); // Cargar variables de entorno

// Configuración de DynamoDB
const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: fromEnv() // Usa credenciales desde variables de entorno
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "PlayStationGames_v3";

module.exports = { docClient, ScanCommand, TABLE_NAME };
