const { STSClient, GetCallerIdentityCommand } = require("@aws-sdk/client-sts");
require("dotenv").config();

const client = new STSClient({ region: process.env.AWS_REGION || "us-east-1" });

async function testAuth() {
    try {
        const command = new GetCallerIdentityCommand({});
        const data = await client.send(command);
        console.log("✅ Autenticación exitosa:", data);
    } catch (error) {
        console.error("❌ Error de autenticación con AWS:", error);
        console.error("🔍 Verifica si las credenciales son válidas y están configuradas correctamente.");
    }
}

// Ejecutar la prueba
testAuth();
