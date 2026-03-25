#!/bin/bash

# Script de démarrage rapide pour Gestion-de-ferme
# Utilise MongoDB en mémoire pour le développement

echo "🚀 Démarrage de Gestion-de-ferme..."
echo "=================================="

# Vérifier si les dépendances sont installées
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installation des dépendances backend..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installation des dépendances frontend..."
    cd frontend && npm install && cd ..
fi

# Initialiser la base de données
echo "🗄️  Initialisation de la base de données..."
cd backend
npm run seed:departement
npm run seed:category
npm run seed:users
cd ..

echo ""
echo "✅ Initialisation terminée!"
echo ""
echo "🌐 URLs d'accès:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:7000"
echo ""
echo "👤 Compte admin:"
echo "   Email: admin@ferme.local"
echo "   Mot de passe: admin123"
echo ""
echo "🛑 Pour arrêter: Ctrl+C dans chaque terminal"
echo ""

# Démarrer les services en parallèle
echo "🔄 Démarrage des services..."

# Terminal 1: Backend
echo "📡 Démarrage du backend..."
cd backend && npm start &
BACKEND_PID=$!

# Attendre un peu que le backend démarre
sleep 3

# Terminal 2: Frontend
echo "🌐 Démarrage du frontend..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Services démarrés!"
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "📝 Ouvrez http://localhost:5173 dans votre navigateur"
echo ""

# Fonction de nettoyage
cleanup() {
    echo ""
    echo "🛑 Arrêt des services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Services arrêtés"
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT

# Attendre que les processus se terminent
wait