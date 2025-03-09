#!/bin/bash
set -e  # Detener el script en caso de error

# 🏗 Configuración de AWS
AWS_REGION="us-east-1"
AWS_PROFILE="serverless-deployer"

echo "⚙️ Configurando AWS_PROFILE correctamente..."
export AWS_PROFILE="$AWS_PROFILE"

# Eliminar credenciales previas para evitar conflictos
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY

# Verificar el usuario autenticado en AWS
CURRENT_USER=$(aws sts get-caller-identity --query 'Arn' --output text --profile "$AWS_PROFILE")

if [ -z "$CURRENT_USER" ]; then
  echo "❌ Error: No se pudo autenticar con AWS. Verifica el perfil '$AWS_PROFILE'."
  exit 1
fi

echo "✅ AWS_PROFILE configurado como: $AWS_PROFILE"
echo "👤 Usuario autenticado: $CURRENT_USER"

# Validar permisos antes de escribir en archivos de configuración
if [ -n "$ZSH_VERSION" ] && [ -w ~/.zshrc ]; then
  echo 'export AWS_PROFILE="serverless-deployer"' >> ~/.zshrc
  source ~/.zshrc
elif [ -n "$BASH_VERSION" ] && [ -w ~/.bash_profile ]; then
  echo 'export AWS_PROFILE="serverless-deployer"' >> ~/.bash_profile
  source ~/.bash_profile
else
  echo "⚠️ No se tienen permisos para modificar ~/.bash_profile o ~/.zshrc"
fi

# 🔍 Verificar y crear bucket S3 si no existe
BUCKET_NAME="serverless-framework-deployments-us-east-1-$(aws sts get-caller-identity --query 'Account' --output text --profile "$AWS_PROFILE")"

echo "🔍 Verificando bucket S3: $BUCKET_NAME..."
if ! aws s3 ls "s3://$BUCKET_NAME" --profile "$AWS_PROFILE" --region "$AWS_REGION" &>/dev/null; then
  echo "⚠️ Bucket no encontrado. Creándolo..."
  aws s3 mb "s3://$BUCKET_NAME" --region "$AWS_REGION" --profile "$AWS_PROFILE"
  echo "✅ Bucket $BUCKET_NAME creado exitosamente."
else
  echo "✅ Bucket $BUCKET_NAME ya existe."
fi

# 🚀 Preparar el despliegue
echo "🚀 Iniciando despliegue de la API Get Games en AWS..."

unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY

# Verificar que dotenv está instalado
echo "🧹 Verificar que dotenv está instalados..."
if ! npm list dotenv >/dev/null 2>&1; then
  echo "⚠️ dotenv no está instalado. Instalándolo..."
  npm install dotenv
fi

# 🧹 Limpiar e instalar dependencias
echo "🧹 Limpiando dependencias previas..."
rm -rf node_modules package-lock.json
npm cache clean --force
# npm install --omit=dev
npm install dotenv serverless-http --save  # Instala dependencias requeridas




# 📂 Verificar existencia de directorios antes de copiarlos
mkdir -p dist

for DIR in server.js package.json src; do
  if [ -e "$DIR" ]; then
    cp -r "$DIR" dist/
  else
    echo "⚠️ Advertencia: El directorio '$DIR' no existe y no será copiado."
  fi
done

cd dist
zip -r ../get-games.zip ./*
cd ..

export AWS_PROFILE="$AWS_PROFILE"

# 🔄 Ejecutar despliegue con Serverless
serverless deploy --stage dev --region "$AWS_REGION" --aws-profile "$AWS_PROFILE"

echo "🎉 Despliegue completado exitosamente 🚀"
