#!/bin/bash
set -e  # Stop le script si une commande échoue

# ------------------------
# VARIABLES
# ------------------------
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"
PM2_APP_NAME="crazy-pinball"
REACT_PORT=3000

echo "💾 Mise à jour du code..."
git pull

# ------------------------
# 1️⃣ Backend Symfony
# ------------------------
echo "🚀 Déploiement du backend Symfony..."
cd $BACKEND_DIR

echo "📦 Installation des dépendances PHP..."
composer install --no-dev --optimize-autoloader

echo "🗄️ Jouer les migrations Doctrine..."
php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration
php bin/console cache:clear --env=prod

echo "✅ Backend Symfony déployé."

# ------------------------
# 2️⃣ Frontend React
# ------------------------
echo "🚀 Déploiement du frontend React..."
cd $FRONTEND_DIR

echo "📦 Installation des dépendances Node..."
npm install

echo "🏗️ Build React..."
npm run build

echo "🔄 Restart PM2..."
# Si l'app n'existe pas encore, démarre la première fois
if pm2 list | grep -q "$PM2_APP_NAME"; then
    pm2 restart $PM2_APP_NAME
else
    pm2 start npx --name "$PM2_APP_NAME" -- serve -s build -l $REACT_PORT
fi

echo "✅ Frontend React déployé."

# ------------------------
# 3️⃣ Fin
# ------------------------
echo "🎉 Déploiement terminé avec succès !"
