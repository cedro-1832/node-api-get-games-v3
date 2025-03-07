const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { fromEnv } = require("@aws-sdk/credential-provider-env");
require('dotenv').config();

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
    console.error("❌ ERROR: Las credenciales de AWS no están definidas correctamente.");
    process.exit(1);
}

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: fromEnv()
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "PlayStationGames_v3";

module.exports = { docClient, ScanCommand, TABLE_NAME };
