# Récapitulatif des Sidebars par Rôle

Ce document détaille les éléments de navigation (sidebar) disponibles pour chaque rôle utilisateur dans l'application de gestion de ferme.

## 🏢 Administrateur (Admin)

**Dashboard Principal :** Vue d'ensemble complète du système
- **Tableau de bord** : KPIs globaux, performances, alertes système
- **Gestion des utilisateurs** : CRUD utilisateurs, rôles et permissions
- **Rapports** : Rapports financiers et opérationnels
- **Alertes** : Gestion et supervision de toutes les alertes
- **Campagnes** : Vue d'ensemble de toutes les campagnes
- **Animaux** : Accès à la gestion globale des animaux
- **Alimentation** : Supervision des stocks et approvisionnements
- **Santé** : Vue d'ensemble de la santé animale

**Navigation Prioritaire :**
1. Dashboard Administrateur
2. Gestion des Utilisateurs
3. Alertes Système
4. Rapports Financiers

---

## 👔 Gestionnaire (Manager)

**Dashboard Opérationnel :** Supervision des opérations terrain
- **Tableau de bord** : KPIs opérationnels, suivi des campagnes
- **Campagnes** : Gestion et supervision des campagnes actives
- **Animaux** : Gestion des troupeaux par campagne
- **Alimentation** : Suivi des rations et stocks
- **Rapports** : Rapports opérationnels et de performance
- **Alertes** : Alertes opérationnelles et terrain

**Navigation Prioritaire :**
1. Dashboard Gestionnaire
2. Campagnes Actives
3. Gestion des Animaux
4. Alertes Opérationnelles

---

## 🩺 Vétérinaire (Veterinaire)

**Dashboard Médical :** Gestion de la santé animale
- **Tableau de bord** : Suivi des prescriptions, animaux malades
- **Prescriptions** : Création et gestion des traitements
- **Animaux Malades** : Diagnostic et suivi des pathologies
- **Produits de Santé** : Gestion du stock médical
- **Alertes Sanitaires** : Alertes de santé et épidémies
- **Campagnes** : Suivi médical par campagne
- **Rapports** : Rapports de santé et statistiques médicales

**Navigation Prioritaire :**
1. Dashboard Vétérinaire
2. Prescriptions Actives
3. Animaux Malades
4. Alertes Sanitaires

---

## 💼 Comptable

**Dashboard Financier :** Gestion financière et budgétaire
- **Tableau de bord** : Métriques financières, variances budgétaires
- **Approbations** : Validation des transactions et dépenses
- **Transactions** : Gestion et suivi des mouvements financiers
- **Rapports Financiers** : États financiers, analyses de coûts
- **Budget** : Planification et suivi budgétaire
- **Audit** : Traçabilité et contrôle des opérations
- **Campagnes** : Suivi financier par campagne

**Navigation Prioritaire :**
1. Dashboard Comptable
2. Approbations en Attente
3. Transactions Récentes
4. Rapports Financiers

---

## 🌾 Agent Terrain (Agent)

**Dashboard Terrain :** Gestion des tâches quotidiennes
- **Tableau de bord** : Tâches assignées, progression des campagnes
- **Tâches** : Liste des tâches quotidiennes et hebdomadaires
- **Alertes Terrain** : Alertes locales et notifications
- **Campagnes** : Suivi des campagnes assignées
- **Animaux** : Gestion des animaux dans les campagnes actives
- **Alimentation** : Distribution des rations terrain

**Navigation Prioritaire :**
1. Dashboard Agent
2. Tâches du Jour
3. Alertes Actives
4. Campagnes Assignées

---

## 📋 Fonctionnalités Communes

### Accessibles à Tous les Rôles :
- **Mon Profil** : Gestion du profil personnel
- **Notifications** : Centre de notifications personnelles
- **Déconnexion** : Sortie sécurisée du système

### Rôles et Permissions :
- **Admin** : Accès complet à toutes les fonctionnalités
- **Manager** : Lecture/écriture sur les opérations, lecture limitée finances
- **Vétérinaire** : Accès complet santé, lecture animaux/campagnes
- **Comptable** : Accès complet finances, lecture opérations
- **Agent** : Accès limité aux tâches assignées et données terrain

### Structure de Navigation :
```
├── Dashboard [Rôle]
├── [Fonctionnalités Spécifiques]
├── Campagnes
├── Animaux
├── Alimentation
├── Santé
├── Finances/Rapports
├── Alertes
└── Utilisateurs [Admin uniquement]
```

---

## 🔐 Contrôles d'Accès

- **Authentification** : Connexion obligatoire pour tous les rôles
- **Autorisation** : Vérification des permissions par route
- **Navigation Conditionnelle** : Affichage des menus selon les droits
- **Logs d'Audit** : Traçabilité des accès et actions

---

## 📱 Interface Responsive

Tous les rôles bénéficient d'une interface adaptée :
- **Desktop** : Sidebar complète avec icônes et libellés
- **Mobile** : Menu hamburger avec navigation simplifiée
- **Tablette** : Adaptation intermédiaire optimisée</content>
<parameter name="filePath">c:\Users\manoel.yehouenou\Documents\HGF\Nodejs\Mongo db\gestion_de_ferme\SIDEBAR_ROLES_RECAP.md