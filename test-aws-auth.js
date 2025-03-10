const { STSClient, GetCallerIdentityCommand } = require("@aws-sdk/client-sts");

// Crear un cliente STS
const client = new STSClient({
    region: "us-east-1",
});

async function testAuth() {
    try {
        // Ejecutar el comando para obtener la identidad del usuario autenticado
        const command = new GetCallerIdentityCommand({});
        const data = await client.send(command);

        console.log("✅ Autenticación exitosa:", data);
    } catch (error) {
        console.error("❌ Error de autenticación:", error);
    }
}

// Ejecutar la prueba
testAuth();
