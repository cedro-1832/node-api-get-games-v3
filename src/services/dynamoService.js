const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");
require('dotenv').config({ path: __dirname + '/../../.env' });

const AWS_REGION = process.env.AWS_REGION || "us-east-1";

// Validar credenciales de AWS antes de iniciar el cliente de DynamoDB
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.warn("⚠️ AWS_ACCESS_KEY_ID o AWS_SECRET_ACCESS_KEY no están configurados. Se intentará usar el perfil AWS_PROFILE.");
}

// Configurar cliente de DynamoDB
const client = new DynamoDBClient({
    region: AWS_REGION,
    credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    } : undefined
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE || "PlayStationGames_v3";

module.exports = { docClient, ScanCommand, TABLE_NAME };
