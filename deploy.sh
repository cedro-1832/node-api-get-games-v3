#!/bin/bash
set -e  # Detener el script en caso de error

# 🏗 Configuración de AWS
AWS_REGION="us-east-1"
AWS_PROFILE="serverless-deployer"

echo "⚙️ Configurando AWS_PROFILE correctamente..."
export AWS_PROFILE="$AWS_PROFILE"

# Eliminar credenciales previas en caso de estar configuradas
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY

# Verificar el usuario autenticado
CURRENT_USER=$(aws sts get-caller-identity --query 'Arn' --output text --profile "$AWS_PROFILE")

if [ -z "$CURRENT_USER" ]; then
  echo "❌ Error: No se pudo autenticar con AWS. Verifica que el perfil '$AWS_PROFILE' esté configurado correctamente en ~/.aws/credentials."
  exit 1
fi

echo "✅ AWS_PROFILE configurado como: $AWS_PROFILE"
echo "👤 Usuario autenticado: $CURRENT_USER"

# Verificar permisos de ~/.bash_profile o ~/.zshrc antes de escribir en ellos
if [ -n "$ZSH_VERSION" ]; then
  if [ -w ~/.zshrc ]; then
    echo 'export AWS_PROFILE="serverless-deployer"' >> ~/.zshrc
    source ~/.zshrc
  else
    echo "⚠️ No se tienen permisos para escribir en ~/.zshrc"
  fi
elif [ -n "$BASH_VERSION" ]; then
  if [ -w ~/.bash_profile ]; then
    echo 'export AWS_PROFILE="serverless-deployer"' >> ~/.bash_profile
    source ~/.bash_profile
  else
    echo "⚠️ No se tienen permisos para escribir en ~/.bash_profile"
  fi
fi

# 🔍 Verificar existencia del bucket S3
BUCKET_NAME="serverless-framework-deployments-us-east-1-$(aws sts get-caller-identity --query 'Account' --output text --profile "$AWS_PROFILE")"

echo "🔍 Verificando existencia del bucket S3: $BUCKET_NAME..."
if ! aws s3 ls "s3://$BUCKET_NAME" --profile "$AWS_PROFILE" --region "$AWS_REGION" &>/dev/null; then
    echo "⚠️ El bucket $BUCKET_NAME no existe. Creándolo..."
    aws s3 mb "s3://$BUCKET_NAME" --region "$AWS_REGION" --profile "$AWS_PROFILE"
    echo "✅ Bucket $BUCKET_NAME creado exitosamente."
else
    echo "✅ El bucket $BUCKET_NAME ya existe."
fi

# 🚀 Iniciar despliegue de la API en AWS
echo "🚀 Iniciando despliegue de la API Get Games en AWS..."

# Evitar conflictos en credenciales
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY

# 🧹 Limpiar e instalar dependencias
echo "🧹 Limpiando dependencias previas..."
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --omit=dev

# Verificar que dotenv está instalado
if ! npm list dotenv >/dev/null 2>&1; then
  echo "⚠️ dotenv no está instalado. Instalándolo..."
  npm install dotenv
fi

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
