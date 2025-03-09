#!/bin/bash
set -e  # Detener el script en caso de error

AWS_REGION="us-east-1"
AWS_PROFILE="serverless-deployer"

echo "⚙️ Configurando AWS_PROFILE correctamente..."
export AWS_PROFILE="$AWS_PROFILE"

unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY

CURRENT_USER=$(aws sts get-caller-identity --query 'Arn' --output text --profile "$AWS_PROFILE")

if [ -z "$CURRENT_USER" ]; then
  echo "❌ Error: No se pudo autenticar con AWS. Verifica el perfil '$AWS_PROFILE'."
  exit 1
fi

echo "✅ AWS_PROFILE configurado como: $AWS_PROFILE"
echo "👤 Usuario autenticado: $CURRENT_USER"

BUCKET_NAME="serverless-framework-deployments-us-east-1-$(aws sts get-caller-identity --query 'Account' --output text --profile "$AWS_PROFILE")"

echo "🔍 Verificando bucket S3: $BUCKET_NAME..."
if ! aws s3 ls "s3://$BUCKET_NAME" --profile "$AWS_PROFILE" --region "$AWS_REGION" &>/dev/null; then
  echo "⚠️ Bucket no encontrado. Creándolo..."
  aws s3 mb "s3://$BUCKET_NAME" --region "$AWS_REGION" --profile "$AWS_PROFILE"
  echo "✅ Bucket $BUCKET_NAME creado exitosamente."
else
  echo "✅ Bucket $BUCKET_NAME ya existe."
fi

echo "🚀 Iniciando despliegue de la API Get Games en AWS..."

echo "📦 Limpiando e instalando dependencias necesarias..."
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --save dotenv serverless-http jsonwebtoken jws lodash.includes
npm install

# Asegurar permisos correctos en node_modules
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) node_modules

serverless deploy --stage dev --region "$AWS_REGION" --aws-profile "$AWS_PROFILE"

echo "🎉 Despliegue completado exitosamente 🚀"
