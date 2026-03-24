Front-end — Etat, structure et plan d'actions

Date: 2026-03-24

Ce document recapitule ce qui a ete implemente cote frontend, la structure utilisee, le role de chaque fichier important et les taches restantes pour finaliser l'interface connectee au backend.

---

1) Resume rapide

- Stack: Vue 3 + Vite + Pinia + TailwindCSS
- Base API client: Axios (configuration dans src/services/api.js)
- Auth minimale: store Pinia pret (src/stores/useAuth.js) — login stocke token + user dans localStorage
- Routes et vues de base ajoutees (Login, Animals, Campagne, Alert, Health, Feed, Users, Reports, DashboardAdmin)
- Services HTTP pour tous les modules principaux (animals, campaign, feed, health, reports, users, alerts) dans src/services/
- Configuration Tailwind/PostCSS et Vite ajustees

---

2) Commandes utiles

Depuis frontend/:

npm install
npm run dev

Depuis backend/ (API):

# s'assurer que MongoDB tourne localement
npm run start

---

3) Arborescence pertinente (extraits)

- frontend/src/
  - main.js  (bootstrap Vue + Pinia + router)
  - App.vue  (layout global: header, logout)
  - router/index.js  (routes applicatives et garde)
  - stores/useAuth.js  (gestion du token & user)
  - services/  (API client + services par domaine)
  - views/  (pages: Login.vue, Animal.vue, Campagne.vue, Alert.vue, Health.vue, Feed.vue, Users.vue, Reports.vue)
  - components/  (ex: BaseTable.vue)
  - assets/main.css  (directives Tailwind)
  - postcss.config.js, vite.config.js

---

4) Fichiers crees / modifies et leur role (synthese)

- src/services/api.js
  - Instance Axios: baseURL a VITE_API_BASE_URL (fallback http://localhost:3000/api), withCredentials true.

- src/stores/useAuth.js
  - Pinia store: exposes token, user, login(credentials), logout(), setToken(), setUser(). login appelle auth.service.login et configure l'entete Authorization.

- src/services/auth.service.js
  - Methods: login(payload), register(payload), me(). Appelle /auth/*.

- src/router/index.js
  - Routes principales et garde qui redirige vers /login si meta.requiresAuth et pas de token.

- src/views/Login.vue
  - Formulaire de connexion, utilise useAuth().login().

- src/views/* (Animals, Campagne, Alert, Health, Feed, Users, Reports)
  - Pages consomment les services respectifs et affichent listes basiques.

- src/services/*.service.js
  - animals.service.js: getAllAnimals, getAnimalById, generateAnimalQRCode, scanAnimal, getAnimalHistory, getCampaignAnimalStats
  - campaign.service.js: getCampaigns, getCampaignById, createCampaign, getCampaignsByManager, ...
  - feed.service.js: getFeeds, getFeedById, createFeed, getLowStockAlerts, getExpiringSoon, getFeedStatsSummary, searchFeed
  - health.service.js: createProduct, getProducts, getProductById, createPrescription, getAnimalPrescriptions, getCampaignPrescriptions, addAdministration, getHealthStatistics, getExpiredProducts, getNearExpirationProducts, getHealthAlerts
  - report.service.js: createTransaction, getTransactions, getFinancialSummary, getCampaignFinancial, getCashFlow, getExpensesAnalysis, getCampaignRoi, getCampaignBudgetVsActual, getSalesAnimals, getSalesProducts, getDashboard, getKpis
  - user.service.js: getUsers, addUser
  - alert.service.js: getAlerts, getAlertById, createAlert, markAsRead, generateAutomatedAlerts

- src/components/BaseTable.vue
  - Table reutilisable minimaliste: props columns, rows.

- Config & styles
  - vite.config.js (plugin Vue + devtools)
  - postcss.config.js (utilise @tailwindcss/postcss + autoprefixer)
  - src/assets/main.css (tailwind directives)
  - frontend/.env -> VITE_API_BASE_URL=http://localhost:7000/api

---

5) Endpoints backend utilises (mapping rapide)

- Auth: POST /api/auth/login, POST /api/auth/register, GET /api/auth/me
- Users: GET /api/users, POST /api/users
- Animals: GET /api/animals, GET /api/animals/:id/qrcode, GET /api/animals/scan/:tagNumber, GET /api/animals/scan/:tagNumber/history, GET /api/animals/campaign/:campaignId/stats
- Campaign: GET /api/campaign, GET /api/campaign/:id, POST /api/campaign/create/:userId, ...
- Feed: GET /api/feed, GET /api/feed/:id, POST /api/feed, GET /api/feed/alerts/low-stock, GET /api/feed/alerts/expiring-soon
- Health: POST /api/health/products, GET /api/health/products, GET /api/health/products/:id, POST /api/health/prescriptions, ...
- Reports: GET /api/reports/dashboard, GET /api/reports/kpis, POST /api/reports/transactions, ...

Note: la forme exacte des reponses depend du backend (schemas). Les services front renvoient la Promise axios (utiliser .data dans les vues).

---

6) Ce qui reste a faire (prioritaire -> secondaire)

1. Auth complete et gestion des roles (PRIORITAIRE)
   - Implementer register et refresh token cote frontend.
   - Gerer expiration de token + rafraichissement automatique.
   - Gerer roles et conditionner l'acces aux routes.
   - Fichiers: src/views/Register.vue, enrichir useAuth.js.

2. Integration complete des vues existantes (CRUD reel)
   - Creer/editer/supprimer: Animals, Campaigns, Feed, Health, Reports.
   - Utiliser composants reutilisables (BaseTable, forms, modals).

3. Dashboards par role
   - Creer vues et appels (getDashboard, getKpis) pour Admin, Responsable, Veto, Comptable, Agent.

4. UI/UX et composants
   - Table avancee (tri, pagination, selection), formulaires, modals.

5. Tests & QA
   - Unitaires pour services et store, e2e pour flows critiques.

6. Build / Deploiement
   - Scripts CI/CD, variables env de production.

---

7) Taches proposees par fichier (priorite immediate)

- src/stores/useAuth.js: ajouter refresh(), isAuthenticated(), hasRole(role).
- src/services/*: ajouter un interceptor axios pour gestion centralisee des erreurs et refresh du token si necessaire.
- src/views/Register.vue: formulaire d'inscription
- src/components/Pagination.vue, EntityForm.vue: utilitaires CRUD reutilisables

---

Si tu veux, je commence par: 1) Auth complete (register + refresh + roles) ou 2) Integration CRUD pour Animals/Campaigns. Dis-moi quel choix et je commence.
