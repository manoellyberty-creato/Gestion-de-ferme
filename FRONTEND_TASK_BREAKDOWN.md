# Frontend - Plan de travail en équipe (4 collaborateurs)

## 🎯 Objectif global
Construire l’interface Vue 3 + Vite pour la gestion de ferme, intégrée avec l’API backend existante. Mise en place des pages, routes, gestion d’état, role-based protection, affichage responsive et vérification fonctionnelle via Postman.

---

## 📁 Structure frontend recommandée

```
frontend/
  src/
    api/
      auth.js
      animals.js
      campaigns.js
      feed.js
      health.js
      reports.js
      alerts.js
    assets/
      styles/
        main.css
        variables.css
    components/
      ui/
        Button.vue
        InputField.vue
        Card.vue
        Modal.vue
      animals/
        AnimalCard.vue
        AnimalTable.vue
        AnimalForm.vue
      campaigns/
        CampaignCard.vue
        CampaignForm.vue
      feed/
        FeedItem.vue
        FeedForm.vue
      health/
        HealthProductCard.vue
        PrescriptionForm.vue
      reports/
        TransactionList.vue
        FinancialSummary.vue
      alerts/
        AlertItem.vue
    layouts/
      DefaultLayout.vue
      AuthLayout.vue
    pages/
      auth/
        LoginView.vue
        RegisterView.vue
        ProfileView.vue
      animals/
        AnimalsListView.vue
        AnimalDetailView.vue
        ScanAnimalView.vue
      campaigns/
        CampaignsListView.vue
        CampaignDetailView.vue
      feed/
        FeedListView.vue
        FeedFormView.vue
      health/
        HealthProductsView.vue
        PrescriptionsView.vue
      reports/
        TransactionsView.vue
        FinancialView.vue
      alerts/
        AlertsView.vue
      home/
        DashboardView.vue
    router/
      index.js
    stores/
      auth.js
      animals.js
      campaigns.js
      feed.js
      health.js
      reports.js
      alerts.js
    utils/
      constants.js
      helpers.js
    App.vue
    main.js
  public/
  index.html
  package.json
  vite.config.js
```

---

## 👥 Rôles & répartitions (4 personnes)

### Collaborateur 1 (C1) - Auth + navigation
- Authentification : `/auth/login`, `/auth/register`, `/auth/me`
- Mise en place du guard route pour token + roles (middleware client)
- UI layout : `AuthLayout`, `DefaultLayout`, header + footer
- Stockage token/role dans Pinia ou localStorage
- Tests basiques JWT + logout

### Collaborateur 2 (C2) - Animaux
- CRUD : listing, création, edition, suppression
- QR (scan/weight/status/history)
- Route animals + uses `animals.js` API client
- Table + formulaire + detail
- Recherche / filtres (campaignId/species/status)
- Tests front (unité + e2e)

### Collaborateur 3 (C3) - Campagnes + tableau de bord
- Campagnes : création / édition / close / stats
- page Dashboard :KPIs, graphique, tendance
- API stats animaux/campagnes
- mise en place `CampaignsListView`, `CampaignDetailView`, `DashboardView`
- tests scénarios `campaign + stats`

### Collaborateur 4 (C4) - Feed / Health / Reports / Alerts
- feed CRUD + stock update + deactivation
- health: produits + prescriptions
- reports: transactions + financial summary + by campaign
- alerts: list + create + mark as read + stats
- tests end-to-end flows
- QA finale et doc utilisateur

---

## 🧩 Priorités techniques

1. Intégration API service via `src/api/*.js` (Axios)
2. Global error handling (axios interceptors 401/403)
3. Contrôle de rôle: admin, responsable, vétérinaire, comptable
4. UI responsive (mobile / desktop)
5. Composants réutilisables, accessibilité minimale
6. Tests: unitaires composants + e2e login/CRUD

---

## 🧪 Zone de tests postman à mettre en place (facultatif)
- Auth login/register
- Feed create/update/delete
- Animals crud + qr endpoints
- Campaign stats
- Health products + prescriptions
- Reports + transaction
- Alerts

---

## 🔧 Règles de merge / Dev workflow

- Branches feature par collaborateur (`feature/ui-auth`, etc.)
- PR + code review, test OK, lint run
- Revue journalière et coordination
- Un seul ticket par PR

---

## 📝 Futurs points d’amélioration

- Internationalisation (i18n)
- Dark mode
- Notifications temps réel (WebSocket)
- PWA + offline-limited

