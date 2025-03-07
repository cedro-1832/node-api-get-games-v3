#!/bin/bash

echo "🚀 Iniciando el servidor Node.js..."

# 1️⃣ Detener todos los procesos de Node.js antes de iniciar el servidor
echo "🛑 Matando todos los procesos de Node.js..."
killall -9 node 2>/dev/null
sleep 2  # Espera un poco antes de continuar

# 2️⃣ Verificar si el puerto 4000 sigue en uso y matarlo si es necesario
PORT=4000
PIDS=$(lsof -ti :$PORT)

if [ ! -z "$PIDS" ]; then
  echo "🛑 Matando proceso(s) en el puerto $PORT (PIDs: $PIDS)..."
  kill -9 $PIDS
  sleep 2
else
  echo "✅ No hay procesos en el puerto $PORT."
fi

# 3️⃣ Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
  echo "❌ Node.js no está instalado. Por favor instálalo con 'brew install node'."
  exit 1
fi

# 4️⃣ Verificar si npm está instalado correctamente
if ! command -v npm &> /dev/null; then
  echo "❌ npm no está instalado. Intenta reinstalar Node.js."
  exit 1
fi

# 5️⃣ Limpiar dependencias previas solo si existen (Evita eliminar innecesariamente)
if [ -d "node_modules" ] || [ -f "package-lock.json" ]; then
  echo "🧹 Limpiando dependencias previas..."
  rm -rf node_modules package-lock.json
fi

# 6️⃣ Reinstalar dependencias
echo "📦 Instalando dependencias con npm..."
npm install --silent

# 7️⃣ Verificar si nodemon está instalado globalmente, si no, usar npx
if ! command -v nodemon &> /dev/null; then
  echo "⚠️ Nodemon no está instalado globalmente, usaremos npx."
  START_COMMAND="npx nodemon server.js"
else
  START_COMMAND="nodemon server.js"
fi

# 8️⃣ Iniciar el servidor con nodemon (recarga automática)
echo "🚀 Iniciando el servidor con Nodemon..."
$START_COMMAND &

# 9️⃣ Esperar unos segundos y abrir el navegador automáticamente
sleep 3
if command -v open &> /dev/null; then
  open "http://localhost:$PORT"
  echo "🎯 Servidor corriendo en http://localhost:$PORT"
else
  echo "⚠️ No se pudo abrir el navegador automáticamente. Abre: http://localhost:$PORT"
fi
