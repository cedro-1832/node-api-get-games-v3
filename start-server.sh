#!/bin/bash

echo "🚀 Iniciando el servidor Node.js..."

# 1️⃣ Detener todos los procesos de Node.js antes de iniciar el servidor
echo "🛑 Matando todos los procesos de Node.js..."
pkill -f node 2>/dev/null
sleep 2  # Espera antes de continuar

# 2️⃣ Verificar si el puerto 4000 sigue en uso
PORT=4000
PIDS=$(lsof -ti :$PORT)

if [ ! -z "$PIDS" ]; then
  echo "🛑 Matando proceso(s) en el puerto $PORT (PIDs: $PIDS)..."
  kill -9 $PIDS
  sleep 2
else
  echo "✅ No hay procesos en el puerto $PORT."
fi

# 3️⃣ Verificar Node.js y npm
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
  echo "❌ Node.js o npm no están instalados. Instálalos con 'brew install node'."
  exit 1
fi

# 4️⃣ Limpiar dependencias previas si existen
if [ -d "node_modules" ] || [ -f "package-lock.json" ]; then
  echo "🧹 Limpiando dependencias..."
  rm -rf node_modules package-lock.json
fi

# 5️⃣ Reinstalar dependencias
echo "📦 Instalando dependencias..."
npm install --silent

# 6️⃣ Iniciar servidor con nodemon
echo "🚀 Iniciando el servidor..."
npx nodemon server.js &

sleep 3
echo "🎯 Servidor corriendo en http://localhost:$PORT"
