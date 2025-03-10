const { STSClient, GetCallerIdentityCommand } = require("@aws-sdk/client-sts");
require("dotenv").config();

const client = new STSClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: process.env.AWS_PROFILE ? undefined : {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN, // Para credenciales temporales
    }
});

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
