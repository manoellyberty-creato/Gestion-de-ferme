# 🏗️ GESTION D'ÉLEVAGE - Application Complète

**Système intégré de gestion d'une ferme moderne** avec suivi granulaire des animaux, optimisation des coûts et prise de décision basée sur les données.

---

## 🎯 Fonctionnalités Principales

- ✅ **Gestion de Campagnes** : Création, modification, suivi des opérations agricoles
- ✅ **Suivi des Animaux** : Traçabilité complète avec QR codes
- ✅ **Gestion Santé** : Prescriptions, vaccinations, alertes
- ✅ **Distribution Aliments** : Stocks, distribution, historique
- ✅ **Rapports Financiers** : Transactions, budget, analyse
- ✅ **Système Multi-Rôles** : Admin, Manager, Vétérinaire, Comptable, Agent
- ✅ **Dashboard Personnalisés** : UI adaptée par rôle

---

## 🛠️ Technologies

| Layer | Stack |
|-------|-------|
| **Backend** | Node.js + Express + MongoDB |
| **Frontend** | Vue.js + Vite + Pinia + Tailwind |
| **Auth** | JWT + bcrypt |
| **Database** | MongoDB (Cloud: Atlas) |

Node.js minimum: **^20.19.0** ou **>=22.12.0**

---

## ⚡ Installation Rapide

### 🚀 Démarrage Ultra-Rapide (Recommandé)

**Pour Windows:**
```cmd
# Double-cliquez sur start.bat ou exécutez:
start.bat
```

**Pour Linux/Mac:**
```bash
# Rendez le script exécutable puis lancez:
chmod +x start.sh
./start.sh
```

**Résultat:** Base de données initialisée + services démarrés automatiquement!

---

### 🔧 Installation Manuelle

#### 1️⃣ Cloner et installer

```bash
# Dépendances Backend
cd backend
npm install

# Dépendances Frontend
cd ../frontend
npm install
```

#### 2️⃣ Configuration Base de Données

**🧠 Développement (MongoDB en Mémoire - Recommandé):**
- Aucune configuration nécessaire!
- MongoDB démarre automatiquement en mémoire
- Données persistées pendant la session

**☁️ Production (MongoDB Atlas):**
Créer `backend/.env`:
```env
MONGO_URL=mongodb+srv://username:password@clustername.mongodb.net/?appName=AppName
DB_NAME=ferme_db
PORT=7000
NODE_ENV=development
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

> 📌 **Copie depuis `.env.example`** : `cp backend/.env.example backend/.env`

**Frontend** - Créer `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:7000/api
```

#### 3️⃣ Exécuter les seeders

```bash
cd backend

# Ajouter les départements (Volaille, Bétail, Pisciculture)
npm run seed:departement

# Ajouter les catégories (Poulet, Canard, Bovin, Tilapia, etc.)
npm run seed:category
```

#### 4️⃣ Démarrer l'application

**Terminal 1 - Backend** (port 7000):
```bash
cd backend
npm start
```

**Terminal 2 - Frontend** (port 5173/5174):
```bash
cd frontend
npm run dev
```

**Accéder l'app** : http://localhost:5173

---

## 📂 Structure du Projet

```
Gestion-de-ferme/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Logique métier
│   │   ├── models/          # Schémas MongoDB
│   │   ├── routes/          # Endpoints API
│   │   ├── services/        # Logique réutilisable
│   │   ├── middlewares/     # Auth, validation, erreurs
│   │   ├── seeders/         # Données initiales
│   │   └── utils/           # Constantes, helpers
│   ├── package.json
│   └── .env (à créer)
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Composants Vue réutilisables
│   │   ├── views/          # Pages (Login, Dashboards, etc.)
│   │   ├── stores/         # State management (Pinia)
│   │   ├── services/       # API calls
│   │   ├── router/         # Vue Router config
│   │   └── assets/         # CSS, images
│   ├── package.json
│   ├── vite.config.js
│   └── .env (à créer)
│
├── docs/
├── setup.sh                # Script d'installation automatique
└── README.md
```

---

## 👥 Rôles et Permissions

| Fonctionnalité | Admin | Manager | Vétérinaire | Comptable | Agent |
|---|:---:|:---:|:---:|:---:|:---:|
| Gestion Utilisateurs | ✅ | ❌ | ❌ | ❌ | ❌ |
| Création Campagnes | ✅ | ✅ | ❌ | ❌ | ❌ |
| Prescriptions Médicales | ✅ | ❌ | ✅ | ❌ | ❌ |
| Suivi Santé | ✅ | ✅ | ✅ | ❌ | ❌ |
| Distribution Aliments | ✅ | ✅ | ❌ | ❌ | ✅ |
| Rapports Financiers | ✅ | ✅ | ❌ | ✅ | ❌ |
| Mouvements Animaux | ✅ | ✅ | ❌ | ❌ | ✅ |

---

## 🔐 Authentification

### Utilisateurs de Test

**Admin**
```json
{
  "email": "admin@ferme.local",
  "password": "admin123",
  "role": "admin"
}
```

**Manager**
```json
{
  "email": "manager@ferme.local",
  "password": "manager123",
  "role": "manager"
}
```

**Vétérinaire**
```json
{
  "email": "veto@ferme.local",
  "password": "veto123",
  "role": "veterinaire"
}
```

**Comptable**
```json
{
  "email": "comptable@ferme.local",
  "password": "comptable123",
  "role": "comptable"
}
```

**Agent**
```json
{
  "email": "agent@ferme.local",
  "password": "agent123",
  "role": "agent"
}
```

> ⚠️ **Note**: Ces utilisateurs doivent être créés via le seeder `users.seed.js`

---

## 📊 API Endpoints

### Base URL: `http://localhost:7000/api`

#### Authentification
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `GET /auth/me` - Profil utilisateur

#### Campagnes
- `GET /campaigns` - Liste avec pagination/filtres
- `GET /campaigns/:id` - Détail
- `POST /campaigns/create/:userId` - Créer
- `PATCH /campaigns/update/:id` - Modifier
- `DELETE /campaigns/delete/:id` - Supprimer
- `POST /campaigns/:campaignId/assign-agent/:userId` - Assigner
- `DELETE /campaigns/:campaignId/unassign/:userId` - Désassigner

#### Animaux
- `GET /animals` - Liste
- `POST /animals` - Créer
- `GET /animals/:id` - Détail

#### Santé
- `GET /health` - Historique
- `POST /health/prescriptions` - Prescrire
- `POST /health/vaccines` - Vacciner

#### Aliments
- `GET /feed` - Stocks
- `POST /feed/distribute` - Distribuer

#### Rapports
- `GET /reports` - Rapports financiers
- `GET /reports/analytics` - Analytics

---

## 🐛 Dépannage

### Le backend ne démarre pas

1. **Erreur MongoDB** : Vérifiez `MONGO_URL` dans `.env`
   ```bash
   # Tester la connexion
   mongosh "mongodb+srv://..." --eval "print('OK')"
   ```

2. **Port déjà utilisé** :
   ```bash
   # Libérer le port 7000
   lsof -i :7000 | grep -v PID | awk '{print $2}' | xargs kill -9
   ```

### Le frontend ne charge pas

1. **CORS Error** : Vérifiez `VITE_API_BASE_URL` dans `frontend/.env`
2. **API non accessible** : Le backend est-il démarré?
3. **Port occupé** : Vite passera à 5174

### Les seeders ne marchent pas

1. **Vérifier les credentials MongoDB**
2. **Vérifier `.env` est bien chargé**
3. **Vérifier les logs**:
   ```bash
   npm run seed:departement 2>&1 | tee seed.log
   ```

---

## 📝 Scripts Disponibles

**Backend:**
```bash
npm start                 # Démarrer avec hot reload
npm run seed:departement # Ajouter les départements
npm run seed:category    # Ajouter les catégories
```

**Frontend:**
```bash
npm run dev         # Démarrer Vite dev server
npm run build       # Build production
npm run lint        # Linter (si configuré)
```

---

## 🚀 Déploiement (Production)

### Checklist Pre-Prod

- [ ] Changer `JWT_SECRET` en valeur forte
- [ ] Définir `NODE_ENV=production`
- [ ] Configurer `CORS_ORIGIN` avec le domaine réel
- [ ] Changer les credentials MongoDB
- [ ] Compiler le frontend: `npm run build`
- [ ] Configurer un process manager (PM2)
- [ ] Mettre en place les logs
- [ ] Configurer un reverse proxy (Nginx)

### Exemple PM2

```bash
# Démarrer backend
pm2 start "npm start" --name "ferme-backend" --cwd ./backend

# Logs
pm2 logs ferme-backend
```

---

## 📚 Documentation Additionnelle

- [Application Détaillée](./APPLICATION_DETAILLEE.md) - Workflows complets
- [Répartition des Tâches](./REPARTITION_TACHES_4_COLLABORATEURS.md) - Équipe
- [Testing Postman](./POSTMAN_API_TESTING.md) - Endpoints

---

## 🤝 Contribution

1. **Fork** le projet
2. Créer une **branche** feature (`git checkout -b feature/amazing`)
3. **Commit** vos changements (`git commit -m 'Add amazing feature'`)
4. **Push** vers la branche (`git push origin feature/amazing`)
5. Ouvrir une **Pull Request**

---

## 📄 License

Propriétaire - Tous droits réservés

---

## 💬 Support

Pour toute question ou problème:
- Créer une **issue** sur GitHub
- Consulter la [documentation détaillée](./APPLICATION_DETAILLEE.md)
- Vérifier les [logs d'erreur](./backend/logs/)

---

**Made with ❤️ for modern farm management**

Last Updated: March 24, 2026
