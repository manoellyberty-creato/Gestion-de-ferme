# 📋 Guide de Test API - Gestion de Ferme (Postman)

## 🔗 Configuration Base

**URL Base:** `http://localhost:5000/api`

---

## 🔐 1. AUTHENTIFICATION (`/auth`)

### 1.1 Inscription
- **Méthode:** `POST`
- **URL:** `/auth/register`
- **Authentification:** Non requise
- **Body (JSON):**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "role": "agent"
}
```
- **Réponse attendue:** `{ success: true, token: "..." }`

---

### 1.2 Connexion
- **Méthode:** `POST`
- **URL:** `/auth/login`
- **Authentification:** Non requise
- **Body (JSON):**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Réponse attendue:** `{ success: true, token: "..." }`

---

### 1.3 Récupérer Mon Profil
- **Méthode:** `GET`
- **URL:** `/auth/me`
- **Authentification:** ✅ Required (Bearer Token)
- **Réponse attendue:** Profil utilisateur connecté

---

### 1.4 Tableau de Bord Santé (Admin/Vétérinaire)
- **Méthode:** `GET`
- **URL:** `/auth/health/dashboard`
- **Authentification:** ✅ Required (admin ou veterinaire)
- **Réponse attendue:** Données santé

---

### 1.5 Rapports Financiers (Comptable/Admin)
- **Méthode:** `GET`
- **URL:** `/auth/finance/reports`
- **Authentification:** ✅ Required (comptable ou admin)
- **Réponse attendue:** Rapports financiers

---

## 👥 2. GESTION DES UTILISATEURS (`/users`)

### 2.1 Obtenir Tous les Utilisateurs
- **Méthode:** `GET`
- **URL:** `/users`
- **Authentification:** Recommandée
- **Paramètres query:** Aucun
- **Réponse attendue:** `{ data: [...] }`

---

### 2.2 Ajouter un Nouvel Utilisateur
- **Méthode:** `POST`
- **URL:** `/users`
- **Authentification:** Recommandée (Admin)
- **Body (JSON):**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "fullName": "New User",
  "role": "agent"
}
```

---

### 2.3 Modifier un Utilisateur
- **Méthode:** `PUT`
- **URL:** `/users/:id`
- **Authentification:** ✅ Required (Admin)
- **Paramètres:**
  - `id` (URL param): ID de l'utilisateur
- **Body (JSON):**
```json
{
  "fullName": "Updated Name",
  "email": "updated@example.com",
  "role": "responsable"
}
```

---

### 2.4 Supprimer un Utilisateur
- **Méthode:** `DELETE`
- **URL:** `/users/:id`
- **Authentification:** ✅ Required (Admin)
- **Paramètres:**
  - `id` (URL param): ID de l'utilisateur

---

## 🐄 3. GESTION DES ANIMAUX (`/animals`)

### 3.1 Obtenir Tous les Animaux
- **Méthode:** `GET`
- **URL:** `/animals`
- **Authentification:** Non requise
- **Paramètres Query (optionnels):**
  - `campaignId`: Filtrer par campagne
  - `species`: Filtrer par espèce
  - `status`: Filtrer par statut
- **Réponse attendue:** `{ success: true, data: [...], count: n }`

---

### 3.2 Créer un Animal
- **Méthode:** `POST`
- **URL:** `/animals`
- **Authentification:** Non requise
- **Body (JSON):**
```json
{
  "name": "Animal1",
  "tagNumber": "TAG001",
  "species": "dairy_cattle",
  "breed": "Holstein",
  "gender": "male",
  "birthDate": "2023-01-15",
  "campaign": "CAMPAIGN_ID",
  "healthStatus": "healthy",
  "purchasePrice": 5000
}
```

---

### 3.3 Obtenir un Animal par ID
- **Méthode:** `GET`
- **URL:** `/animals/:id`
- **Authentification:** Non requise
- **Paramètres:**
  - `id` (URL param): ID MongoDB de l'animal

---

### 3.4 Mettre à Jour un Animal
- **Méthode:** `PUT`
- **URL:** `/animals/:id`
- **Authentification:** Non requise
- **Body (JSON):**
```json
{
  "name": "Updated Name",
  "weight": 450,
  "healthStatus": "recovering"
}
```

---

### 3.5 Supprimer un Animal
- **Méthode:** `DELETE`
- **URL:** `/animals/:id`
- **Authentification:** Non requise

---

### 3.6 Scanner QR Code Animal
- **Méthode:** `GET`
- **URL:** `/animals/scan/:tagNumber`
- **Authentification:** Non requise
- **Paramètres:**
  - `tagNumber` (URL param): Numéro de tag de l'animal

---

### 3.7 Générer QR Code pour Animal
- **Méthode:** `GET`
- **URL:** `/animals/:id/qrcode`
- **Authentification:** Non requise
- **Paramètres:**
  - `id` (URL param): ID MongoDB de l'animal

---

### 3.8 Mettre à Jour le Poids (via QR)
- **Méthode:** `PUT`
- **URL:** `/animals/scan/:tagNumber/weight`
- **Authentification:** Non requise
- **Paramètres:**
  - `tagNumber` (URL param): Numéro de tag
- **Body (JSON):**
```json
{
  "weight": 475.5
}
```

---

### 3.9 Mettre à Jour le Statut (via QR)
- **Méthode:** `PUT`
- **URL:** `/animals/scan/:tagNumber/status`
- **Authentification:** Non requise
- **Paramètres:**
  - `tagNumber` (URL param): Numéro de tag
- **Body (JSON):**
```json
{
  "status": "sold",
  "salePrice": 8000,
  "saleDate": "2024-01-20"
}
```
- **Statuts valides:** `active`, `sold`, `dead`, `culled`

---

### 3.10 Obtenir Historique Animal
- **Méthode:** `GET`
- **URL:** `/animals/scan/:tagNumber/history`
- **Authentification:** Non requise
- **Paramètres:**
  - `tagNumber` (URL param): Numéro de tag

---

### 3.11 Statistiques des Animaux par Campagne
- **Méthode:** `GET`
- **URL:** `/animals/campaign/:campaignId/stats`
- **Authentification:** Non requise
- **Paramètres:**
  - `campaignId` (URL param): ID de la campagne

---

## 📚 4. GESTION DES CAMPAGNES (`/campaigns`)

### 4.1 Obtenir Toutes les Campagnes
- **Méthode:** `GET`
- **URL:** `/campaigns`
- **Authentification:** Non requise
- **Réponse attendue:** `{ data: [...] }`

---

### 4.2 Créer une Campagne
- **Méthode:** `POST`
- **URL:** `/campaigns`
- **Authentification:** Non requise
- **Body (JSON):**
```json
{
  "name": "Campagne Printemps 2024",
  "type": "breeding",
  "description": "Campagne d'élevage du printemps",
  "startDate": "2024-03-01",
  "endDate": "2024-05-31",
  "budget": 50000,
  "location": "Farm Area 1"
}
```

---

### 4.3 Obtenir une Campagne par ID
- **Méthode:** `GET`
- **URL:** `/campaigns/:id`
- **Authentification:** Non requise
- **Paramètres:**
  - `id` (URL param): ID de la campagne

---

### 4.4 Mettre à Jour une Campagne
- **Méthode:** `PUT`
- **URL:** `/campaigns/:id`
- **Authentification:** Non requise
- **Body (JSON):**
```json
{
  "name": "Updated Campaign Name",
  "endDate": "2024-06-30"
}
```

---

### 4.5 Obtenir Campagnes Actives
- **Méthode:** `GET`
- **URL:** `/campaigns/status/active`
- **Authentification:** Non requise

---

### 4.6 Clôturer une Campagne
- **Méthode:** `POST`
- **URL:** `/campaigns/:id/close`
- **Authentification:** Non requise
- **Paramètres:**
  - `id` (URL param): ID de la campagne

---

### 4.7 Obtenir Statistiques Campagne
- **Méthode:** `GET`
- **URL:** `/campaigns/:id/stats`
- **Authentification:** Non requise
- **Paramètres:**
  - `id` (URL param): ID de la campagne

---

### 4.8 Supprimer une Campagne
- **Méthode:** `DELETE`
- **URL:** `/campaigns/:id`
- **Authentification:** Non requise
- **Paramètres:**
  - `id` (URL param): ID de la campagne

---

## 🍽️ 5. GESTION DE L'ALIMENTATION (`/feed`)

**⚠️ Toutes les routes demandent l'authentification**

### 5.1 Obtenir Tous les Produits d'Alimentation
- **Méthode:** `GET`
- **URL:** `/feed`
- **Authentification:** ✅ Required (admin, gerant, agent)
- **Réponse attendue:** `{ data: [...] }`

---

### 5.2 Obtenir un Produit par ID
- **Méthode:** `GET`
- **URL:** `/feed/:id`
- **Authentification:** ✅ Required
- **Paramètres:**
  - `id` (URL param): ID du produit

---

### 5.3 Créer un Produit d'Alimentation
- **Méthode:** `POST`
- **URL:** `/feed`
- **Authentification:** ✅ Required (admin ou gerant)
- **Body (JSON):**
```json
{
  "name": "Concentré Bovin",
  "category": "grain",
  "supplier": "Supplier Name",
  "price": 850,
  "quantity": 1000,
  "unit": "kg",
  "composition": "Maïs, Soja, Complément minéral"
}
```

---

### 5.4 Mettre à Jour un Produit
- **Méthode:** `PUT`
- **URL:** `/feed/:id`
- **Authentification:** ✅ Required (admin ou gerant)
- **Body (JSON):**
```json
{
  "name": "Updated Product Name",
  "price": 900
}
```

---

### 5.5 Mettre à Jour le Stock
- **Méthode:** `PATCH`
- **URL:** `/feed/:id/stock`
- **Authentification:** ✅ Required (admin, gerant, agent)
- **Body (JSON):**
```json
{
  "quantity": 500,
  "operation": "remove"
}
```

---

### 5.6 Désactiver un Produit
- **Méthode:** `PATCH`
- **URL:** `/feed/:id/deactivate`
- **Authentification:** ✅ Required (admin ou gerant)

---

### 5.7 Supprimer un Produit
- **Méthode:** `DELETE`
- **URL:** `/feed/:id`
- **Authentification:** ✅ Required (admin uniquement)

---

## 🏥 6. GESTION DE LA SANTÉ (`/health`)

**⚠️ Toutes les routes demandent l'authentification**

### 6.1 Créer un Produit de Santé
- **Méthode:** `POST`
- **URL:** `/health/products`
- **Authentification:** ✅ Required (veterinaire ou admin)
- **Body (JSON):**
```json
{
  "name": "Amoxicilline",
  "type": "antibiotic",
  "category": "curative",
  "supplier": "Pharma Inc",
  "price": 2500,
  "dosage": "250mg",
  "stock": 100,
  "unit": "vial"
}
```

---

### 6.2 Obtenir Tous les Produits de Santé
- **Méthode:** `GET`
- **URL:** `/health/products`
- **Authentification:** ✅ Required (veterinaire, admin, responsable, agent)

---

### 6.3 Obtenir un Produit Santé par ID
- **Méthode:** `GET`
- **URL:** `/health/products/:id`
- **Authentification:** ✅ Required
- **Paramètres:**
  - `id` (URL param): ID du produit

---

### 6.4 Mettre à Jour Produit de Santé
- **Méthode:** `PUT`
- **URL:** `/health/products/:id`
- **Authentification:** ✅ Required (veterinaire ou admin)
- **Body (JSON):**
```json
{
  "price": 2700,
  "stock": 150
}
```

---

### 6.5 Désactiver Produit Santé
- **Méthode:** `PATCH`
- **URL:** `/health/products/:id/deactivate`
- **Authentification:** ✅ Required (veterinaire ou admin)

---

### 6.6 Créer une Prescription
- **Méthode:** `POST`
- **URL:** `/health/prescriptions`
- **Authentification:** ✅ Required (veterinaire ou admin)
- **Body (JSON):**
```json
{
  "animalId": "ANIMAL_ID",
  "productId": "PRODUCT_ID",
  "dosage": "500mg",
  "frequency": "2 fois par jour",
  "duration": 7,
  "notes": "Après détection d'infection"
}
```

---

### 6.7 Obtenir Prescriptions d'un Animal
- **Méthode:** `GET`
- **URL:** `/health/animals/:animalId/prescriptions`
- **Authentification:** ✅ Required
- **Paramètres:**
  - `animalId` (URL param): ID de l'animal

---

## 💰 7. RAPPORTS FINANCIERS (`/reports`)

**⚠️ Toutes les routes demandent l'authentification**

### 7.1 Créer une Transaction
- **Méthode:** `POST`
- **URL:** `/reports/transactions`
- **Authentification:** ✅ Required (comptable, admin, responsable)
- **Body (JSON):**
```json
{
  "type": "expense",
  "category": "feed",
  "amount": 15000,
  "description": "Achat d'aliments pour animaux",
  "date": "2024-01-15",
  "campaign": "CAMPAIGN_ID"
}
```
- **Types:** `income`, `expense`
- **Catégories:** `feed`, `health`, `maintenance`, `sale`, etc.

---

### 7.2 Obtenir Toutes les Transactions
- **Méthode:** `GET`
- **URL:** `/reports/transactions`
- **Authentification:** ✅ Required (comptable, admin, responsable, veterinaire)

---

### 7.3 Obtenir une Transaction par ID
- **Méthode:** `GET`
- **URL:** `/reports/transactions/:id`
- **Authentification:** ✅ Required
- **Paramètres:**
  - `id` (URL param): ID de la transaction

---

### 7.4 Mettre à Jour une Transaction
- **Méthode:** `PUT`
- **URL:** `/reports/transactions/:id`
- **Authentification:** ✅ Required (comptable ou admin)
- **Body (JSON):**
```json
{
  "amount": 16000,
  "description": "Achat d'aliments révisé"
}
```

---

### 7.5 Supprimer une Transaction
- **Méthode:** `DELETE`
- **URL:** `/reports/transactions/:id`
- **Authentification:** ✅ Required (comptable ou admin)

---

### 7.6 Résumé Financier Général
- **Méthode:** `GET`
- **URL:** `/reports/financial-summary`
- **Authentification:** ✅ Required (comptable, admin, responsable)
- **Réponse attendue:** Total revenus, dépenses, bénéfice

---

### 7.7 Rapport Financier par Campagne
- **Méthode:** `GET`
- **URL:** `/reports/campaigns/:campaignId/financial`
- **Authentification:** ✅ Required (comptable, admin, responsable)
- **Paramètres:**
  - `campaignId` (URL param): ID de la campagne

---

## 🚨 8. SYSTÈME D'ALERTES (`/alerts`)

**⚠️ Toutes les routes demandent l'authentification**

### 8.1 Obtenir Toutes les Alertes
- **Méthode:** `GET`
- **URL:** `/alerts`
- **Authentification:** ✅ Required (admin, gerant, veterinaire, comptable)

---

### 8.2 Obtenir une Alerte par ID
- **Méthode:** `GET`
- **URL:** `/alerts/:id`
- **Authentification:** ✅ Required
- **Paramètres:**
  - `id` (URL param): ID de l'alerte

---

### 8.3 Créer une Alerte
- **Méthode:** `POST`
- **URL:** `/alerts`
- **Authentification:** ✅ Required (admin ou veterinaire)
- **Body (JSON):**
```json
{
  "title": "Animal malade",
  "type": "health",
  "severity": "high",
  "message": "L'animal TAG001 présente des symptômes d'infection",
  "animalId": "ANIMAL_ID"
}
```
- **Types:** `health`, `feed`, `maintenance`, `financial`, `general`
- **Severity:** `low`, `medium`, `high`, `critical`

---

### 8.4 Marquer une Alerte comme Lue
- **Méthode:** `PATCH`
- **URL:** `/alerts/:id/read`
- **Authentification:** ✅ Required
- **Paramètres:**
  - `id` (URL param): ID de l'alerte

---

### 8.5 Supprimer une Alerte
- **Méthode:** `DELETE`
- **URL:** `/alerts/:id`
- **Authentification:** ✅ Required (admin uniquement)

---

### 8.6 Générer Alertes Automatiques
- **Méthode:** `POST`
- **URL:** `/alerts/generate-automated`
- **Authentification:** ✅ Required (admin uniquement)
- **Fonction:** Génère des alertes basées sur les règles du système

---

### 8.7 Obtenir Statistiques Alertes
- **Méthode:** `GET`
- **URL:** `/alerts/stats/summary`
- **Authentification:** ✅ Required (admin ou gerant)

---

## 👤 9. PROFIL UTILISATEUR (`/me`)

### 9.1 Récupérer Mon Profil
- **Méthode:** `GET`
- **URL:** `/me`
- **Authentification:** Recommandée
- **Réponse attendue:** Données du profil personnel

---

## 🔑 Bearer Token - Configuration dans Postman

Pour ajouter l'authentification dans Postman :

1. Allez dans l'onglet **"Authorization"** d'une requête
2. Sélectionnez **"Bearer Token"**
3. Collez le token reçu lors de la connexion
4. OU utilisez une variable d'environnement : `{{token}}`

**Alternative (Headers):**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📊 Variables d'Environnement Recommandées

Créez une collection Postman avec ces variables :

```
base_url: http://localhost:5000/api
token: <TOKEN_FROM_LOGIN>
userId: <USER_ID>
animalId: <ANIMAL_ID>
campaignId: <CAMPAIGN_ID>
productId: <PRODUCT_ID>
```

**Utilisation:** `{{base_url}}/animals` → `http://localhost:5000/api/animals`

---

## 🧪 Ordre de Test Recommandé

1. ✅ `/auth/register` - Créer un compte
2. ✅ `/auth/login` - Se connecter (récupérer le token)
3. ✅ `/campaigns` POST - Créer une campagne
4. ✅ `/animals` POST - Créer un animal
5. ✅ `/animals` GET - Lister les animaux
6. ✅ `/feed` GET - Consulter l'alimentation (avec auth)
7. ✅ `/health/products` POST - Ajouter produit santé
8. ✅ `/reports/transactions` POST - Enregistrer transaction
9. ✅ `/alerts` GET - Consulter alertes

---

## ⚠️ Codes de Réponse HTTP Attendus

| Code | Signification |
|------|--------------|
| **200** | OK - Requête réussie |
| **201** | Created - Ressource créée |
| **204** | No Content - Suppression réussie |
| **400** | Bad Request - Données invalides |
| **401** | Unauthorized - Token manquant/invalide |
| **403** | Forbidden - Accès refusé (rôle insuffisant) |
| **404** | Not Found - Ressource non trouvée |
| **500** | Server Error - Erreur serveur |

---

## 💡 Astuces d'Utilisation

- **Sauvegardez vos tokens:** Comptez ~1h de validité généralement
- **Testez les erreurs:** Essayez avec des IDs invalides
- **Vérifiez les rôles:** Certains endpoints bloquent selon le rôle de l'utilisateur
- **Utilisez des timestamps:** Vérifiez les dates avec le format ISO 8601
- **Tests en masse:** Postman peut automatiser les tests répétitifs

---

## 📝 Notes

- Remplacez `CAMPAIGN_ID`, `ANIMAL_ID`, etc. par des IDs réels
- L'authentification est obligatoire pour la plupart des endpoints
- Consultez les rôles appropriés pour chaque endpoint
- Les paramètres `query` sont optionnels sauf indication contraire

---

**Dernière mise à jour:** Mars 2024  
**Version API:** 1.0
