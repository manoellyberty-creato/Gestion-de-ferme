@echo off
REM Script de démarrage rapide pour Gestion-de-ferme (Windows)
REM Utilise MongoDB en mémoire pour le développement

echo 🚀 Démarrage de Gestion-de-ferme...
echo ==================================
echo.

REM Vérifier si les dépendances sont installées
if not exist "backend\node_modules" (
    echo 📦 Installation des dépendances backend...
    cd backend
    call npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo 📦 Installation des dépendances frontend...
    cd frontend
    call npm install
    cd ..
)

REM Initialiser la base de données
echo 🗄️  Initialisation de la base de données...
cd backend
call npm run seed:departement
call npm run seed:category
call npm run seed:users
cd ..

echo.
echo ✅ Initialisation terminée!
echo.
echo 🌐 URLs d'accès:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:7000
echo.
echo 👤 Compte admin:
echo    Email: admin@ferme.local
echo    Mot de passe: admin123
echo.
echo 🛑 Pour arrêter: Ctrl+C ou fermez les fenêtres
echo.

REM Démarrer les services
echo 🔄 Démarrage des services...
echo.

REM Démarrer le backend en arrière-plan
start "Backend Server" cmd /c "cd backend && npm start"

REM Attendre un peu que le backend démarre
timeout /t 3 /nobreak > nul

REM Démarrer le frontend
start "Frontend Dev Server" cmd /c "cd frontend && npm run dev"

echo.
echo ✅ Services démarrés!
echo 📝 Ouvrez http://localhost:5173 dans votre navigateur
echo.
echo Appuyez sur une touche pour quitter...
pause > nul