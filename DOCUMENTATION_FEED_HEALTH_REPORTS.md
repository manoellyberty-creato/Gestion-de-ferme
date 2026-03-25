# Documentation Technique : Feed, Health, Reports

Ce document présente le travail effectué sur les modules `Feed`, `Health` et `Reports` en backend et frontend, avec explications comme un mentor.

## 1. Architecture Globale

- Backend : Node.js, Express, MongoDB (Mongoose), JWT, middleware `requireAuth`, `requireRole`.
- Frontend : Vue 3, Vite, Pinia, Axios, Tailwind.
- Organisation des dossiers :
  - `src/services` : appels API (Axios)
  - `src/stores` : Pinia services (state/actions)
  - `src/components` : cartes, formulaires, filtres
  - `src/views` : pages route
  - `src/router` : routes sécurisées

## 2. Module FEED

### 2.1 Backend

- Modèle : `backend/src/models/Feed.js`.
- Service : `backend/src/services/feed.service.js` avec :
  - `getAllFeeds`, `getFeedById`, `createFeed`, `updateFeed`, `deleteFeed`
  - `updateStock`, `deactivateFeed`, statuts & alertes.
- Routes : `backend/src/routes/feed.routes.js`.

### 2.2 Frontend

- Service : `frontend/src/services/feed.service.js` expose mêmes méthodes.
- Pinia : `frontend/src/stores/useFeed.js`.
  - State : `feeds`, `feed`, `loading`, `error`, `stats`, `searchQuery`, pagination.
  - Actions : CRUD + stock + désactivation + refresh.
- Composants :
  - `FeedCard.vue` (cartes d’items, actions édit/suppression, badging expiration/stock bas).
  - `FeedForm.vue` (create/edit, validations simples).
- View : `Feed.vue`.
  - Chargement initial, recherche, modals, messages d’erreurs, contrôle emptystate.

## 3. Module HEALTH

### 3.1 Backend

- Modèles : `Health.js`, `Prescription.js`.
- Service : `backend/src/services/health.service.js`.
  - Produits : `createProduct`, `getProducts`, `updateProduct`, `deleteProduct`.
  - Prescriptions : `createPrescription`, `getPrescriptions`, `updatePrescription`, `deletePrescription`.
  - Statistiques : stock bas, expiration.

### 3.2 Frontend

- Service : `frontend/src/services/health.service.js`.
- Pinia : `frontend/src/stores/useHealth.js`.
  - Dualité entités : `products` + `prescriptions`, `loading`, `error`, `alerts`.
  - Actions : CRUD + stats.
- Composants :
  - `HealthProductCard.vue`
  - `HealthProductForm.vue`
  - `PrescriptionCard.vue`
  - `PrescriptionForm.vue`
- View : `Health.vue`.
  - Interface tabs (produits / prescriptions)
  - Recherche / filtres / modals.

## 4. Module REPORTS

### 4.1 Backend

- Modèle : `Transaction.js`.
- `backend/src/services/report.service.js` :
  - `getTransactions`, CRUD, filtres (type/categorie/campagne/status/date).
  - `getFinancialSummary`, `getCampaignFinancialReport`, `getCashFlowAnalysis`.

### 4.2 Frontend

- Service : `frontend/src/services/report.service.js`.
- Pinia : `frontend/src/stores/useReport.js`.
  - State : `transactions`, `financialSummary`, `cashFlowData`, `expensesAnalysis`, `pagination`, etc.
  - Actions : fetch / create / update / delete / export.
- Composants :
  - `TransactionCard.vue`
  - `FinancialSummaryCard.vue`
  - `TransactionForm.vue`
  - `TransactionFilters.vue`
  - `TransactionTable.vue`
- View : `Reports.vue`.
  - Tabs : `Transactions`, `Résumé Financier`, `Flux de Trésorerie`.
  - Chargement initial et actions.

## 5. Guide de fonctionnement

1. `Feed` : cadence CRUD et gestion stock.
2. `Health` : stocks produits + ordonnances vétérinaires.
3. `Reports` : transactions + agrégations (bilan, cashflow, marges).

## 6. Endpoints principaux et exemples

### FEED
- GET `/api/feeds`
- POST `/api/feeds`
- PUT `/api/feeds/:id`
- DELETE `/api/feeds/:id`
- PUT `/api/feeds/:id/stock` (`{ quantityDelta }`)
- PATCH `/api/feeds/:id/deactivate`

### HEALTH
- GET `/api/health/products`
- POST `/api/health/products`
- PUT `/api/health/products/:id`
- DELETE `/api/health/products/:id`
- GET `/api/health/prescriptions`
- POST `/api/health/prescriptions`
- PUT `/api/health/prescriptions/:id`
- DELETE `/api/health/prescriptions/:id`

### REPORTS
- GET `/api/reports/transactions?type=expense&startDate=...&endDate=...`
- GET `/api/reports/financial-summary`
- GET `/api/reports/cash-flow?period=monthly`
- GET `/api/reports/expenses/analysis`

## 7. Recommandations pour next steps

- Module `Alerts` (CRUD + lecture/mark-read + notifications en temps réel)
- Graphiques cashflow (Chart.js / ECharts) dans Reports
- Tests unitaires / intégration (Vitest + Pinia + service)
- Amélioration accessibilité et mobile
- CI/CD + coverage.
