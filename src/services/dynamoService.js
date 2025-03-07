const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { fromEnv } = require("@aws-sdk/credential-provider-env");
require('dotenv').config(); // Asegurar la carga de variables de entorno

// Validar que las credenciales están cargadas
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error("❌ ERROR: Las credenciales de AWS no están definidas en el entorno");
    process.exit(1);
}

// Configuración de DynamoDB
const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: fromEnv() // Usa credenciales desde variables de entorno
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "PlayStationGames_v3";

module.exports = { docClient, ScanCommand, TABLE_NAME };
