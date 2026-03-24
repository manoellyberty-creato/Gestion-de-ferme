## 🚀 Guide de Démarrage Rapide - 5 Minutes

### Prérequis
- ✅ Node.js **^20.19.0** ou **>=22.12.0**
- ✅ npm ou yarn
- ✅ MongoDB (Cloud Atlas ou local)

---

## ⏱️ 5 Étapes Rapides

### 1. Cloner et installer (2 min)

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configurer les variables d'environnement (1 min)

**Backend** - Créer `backend/.env`:
```bash
cp backend/.env.example backend/.env
# Éditer backend/.env avec vos credentials MongoDB
```

**Frontend** - Créer `frontend/.env`:
```bash
cp frontend/.env.example frontend/.env
```

### 3. Initialiser la base de données (1 min)

```bash
cd backend

# Créer les départements
npm run seed:departement

# Créer les catégories
npm run seed:category
```

✅ Vous devriez voir:
```
✅ Connecté à MongoDB
🌱 Ajout des départements...
  ✓ volaille
  ✓ betail
  ✓ pisciculture
✅ 3 nouveau(x) département(s) ajouté(s)
```

### 4. Démarrer le backend (0.5 min)

```bash
cd backend
npm start
```

✅ Vous devriez voir:
```
🎯 Server running on port 7000
✅ MongoDB connecté
```

### 5. Démarrer le frontend (1 min)

**Dans un nouveau terminal:**
```bash
cd frontend
npm run dev
```

✅ Vous devriez voir:
```
VITE v7.3.1 ready in XXXXms
➜  Local:   http://localhost:5173/
```

---

## 🎯 L'App est prête!

Ouvrez : **http://localhost:5173**

### Accès par défaut

| Rôle | Email | Password |
|------|-------|----------|
| Admin | admin@ferme.local | admin123 |
| Manager | manager@ferme.local | manager123 |
| Vétérinaire | veto@ferme.local | veto123 |

---

## 🛑 Problèmes courants?

### ❌ "Cannot connect to MongoDB"

**Solution**:
1. Vérifier `MONGO_URL` dans `backend/.env`
2. Vérifier accès réseau (si cloud)
3. Copier-coller depuis MongoDB Atlas

### ❌ "CORS Error"

**Solution**: Vérifier `VITE_API_BASE_URL` dans `frontend/.env`
```env
VITE_API_BASE_URL=http://localhost:7000/api
```

### ❌ "Port already in use"

**Solution**:
```bash
# Libérer les ports
# Port 7000 (Backend)
lsof -i :7000 | grep -v PID | awk '{print $2}' | xargs kill -9

# Port 5173 (Frontend - passera auto à 5174)
```

### ❌ "npm command not recognized"

**Solution**: Vérifier Node.js est installé
```bash
node -v    # Doit afficher v20.x ou v22.x
npm -v     # Doit afficher 10.x+
```

---

## 📚 Docs Complètes

- [README Principal](./README.md)
- [Architecture Détaillée](./APPLICATION_DETAILLEE.md)
- [API Endpoints](./POSTMAN_API_TESTING.md)

---

**Vous êtes prêt! 🎉**
