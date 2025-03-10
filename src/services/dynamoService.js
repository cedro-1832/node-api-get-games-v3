const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");
require('dotenv').config();

const AWS_REGION = process.env.AWS_REGION || "us-east-1";

const client = new DynamoDBClient({
    region: AWS_REGION, // AWS se encargará de las credenciales internamente
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE || "PlayStationGames_v3";

module.exports = { docClient, ScanCommand, TABLE_NAME };
