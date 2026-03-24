#!/bin/bash

echo "🚀 === GESTION DE FERME - SETUP COMPLET === 🚀"
echo ""

# Check Node.js
echo "📋 Vérification Node.js..."
node -v
npm -v
echo ""

# Backend setup
echo "🔧 --- BACKEND SETUP ---"
cd backend

# Install dependencies
if [ ! -d "node_modules" ]; then
  echo "📦 Installation des dépendances backend..."
  npm install
else
  echo "✅ Dépendances backend déjà installées"
fi

# Seeders
echo ""
echo "🌱 Exécution des seeders..."
echo "  ➜ Départements..."
npm run seed:departement

echo "  ➜ Catégories..."
npm run seed:category

echo ""
echo "✅ Backend prêt!"
echo ""

# Frontend setup
cd ../frontend

echo "🔧 --- FRONTEND SETUP ---"

# Install dependencies
if [ ! -d "node_modules" ]; then
  echo "📦 Installation des dépendances frontend..."
  npm install
else
  echo "✅ Dépendances frontend déjà installées"
fi

echo ""
echo "✅ Frontend prêt!"
echo ""

echo "🎯 === SETUP COMPLET ==="
echo ""
echo "📌 PROCHAINES ÉTAPES:"
echo ""
echo "1️⃣  Démarrer le backend:"
echo "   cd backend && npm start"
echo ""
echo "2️⃣  Démarrer le frontend (dans un autre terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "3️⃣  Accéder l'application:"
echo "   http://localhost:5173 ou http://localhost:5174"
echo ""
