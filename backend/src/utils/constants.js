// Constantes utilisées dans l'application de gestion de ferme

// === RÔLES UTILISATEURS ===
export const USER_ROLES = {
    ADMIN: 'admin',
    RESPONSABLE: 'responsable',
    VETERINAIRE: 'veterinaire',
    COMPTABLE: 'comptable',
    AGENT: 'agent'
};

// === TYPES DE PRODUITS DE SANTÉ ===
export const HEALTH_PRODUCT_TYPES = {
    VACCINE: 'vaccine',
    TREATMENT: 'treatment',
    SUPPLEMENT: 'supplement',
    ANTIBIOTIC: 'antibiotic',
    ANTIPARASITIC: 'antiparasitic'
};

// === CATÉGORIES DE PRODUITS DE SANTÉ ===
export const HEALTH_PRODUCT_CATEGORIES = {
    PREVENTIVE: 'preventive',
    CURATIVE: 'curative',
    NUTRITIONAL: 'nutritional'
};

// === ESPÈCES D'ANIMAUX ===
export const ANIMAL_SPECIES = {
    POULTRY: 'poultry',
    CATTLE: 'cattle',
    FISH: 'fish',
    PIGEON: 'pigeon',
    DUCK: 'duck',
    GUINEA_FOWL: 'guinea_fowl',
    CHICKEN: 'chicken',
    DAIRY_CATTLE: 'dairy_cattle',
    BEEF_CATTLE: 'beef_cattle',
    SHEEP: 'sheep'
};

// === STATUTS DES PRESCRIPTIONS ===
export const PRESCRIPTION_STATUSES = {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

// === TYPES DE TRANSACTIONS ===
export const TRANSACTION_TYPES = {
    INCOME: 'income',
    EXPENSE: 'expense'
};

// === CATÉGORIES DE REVENUS ===
export const INCOME_CATEGORIES = {
    SALE_ANIMAL: 'sale_animal',
    SALE_EGGS: 'sale_eggs',
    SALE_MEAT: 'sale_meat',
    SALE_FEATHERS: 'sale_feathers',
    SALE_MANURE: 'sale_manure',
    SUBSIDY: 'subsidy',
    INVESTMENT: 'investment',
    LOAN: 'loan'
};

// === CATÉGORIES DE DÉPENSES ===
export const EXPENSE_CATEGORIES = {
    FEED: 'feed',
    HEALTH: 'health',
    LABOR: 'labor',
    EQUIPMENT: 'equipment',
    MAINTENANCE: 'maintenance',
    UTILITIES: 'utilities',
    TRANSPORT: 'transport',
    INSURANCE: 'insurance',
    TAXES: 'taxes',
    OTHER_EXPENSE: 'other_expense'
};

// === STATUTS DES TRANSACTIONS ===
export const TRANSACTION_STATUSES = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
};

// === STATUTS DES CAMPAGNES ===
export const CAMPAIGN_STATUSES = {
    PLANNING: 'planning',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

// === UNITÉS DE MESURE ===
export const MEASUREMENT_UNITS = {
    // Poids
    KG: 'kg',
    G: 'g',
    T: 't',
    // Volume
    L: 'l',
    ML: 'ml',
    // Quantité
    UNITS: 'units',
    PIECES: 'pieces',
    // Temps
    DAYS: 'days',
    WEEKS: 'weeks',
    MONTHS: 'months'
};

// === FRÉQUENCES DE DOSAGE ===
export const DOSAGE_FREQUENCIES = {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    BIWEEKLY: 'biweekly',
    MONTHLY: 'monthly',
    AS_NEEDED: 'as_needed',
    SINGLE_DOSE: 'single_dose'
};

// === DEVISES ===
export const CURRENCIES = {
    XAF: 'XAF', // Franc CFA
    EUR: 'EUR',
    USD: 'USD'
};

// === PÉRIODES POUR LES RAPPORTS ===
export const REPORT_PERIODS = {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    QUARTERLY: 'quarterly',
    YEARLY: 'yearly'
};

// === SEUILS D'ALERTE ===
export const ALERT_THRESHOLDS = {
    // Produits de santé
    EXPIRATION_WARNING_DAYS: 30,
    EXPIRATION_CRITICAL_DAYS: 7,

    // Finances
    PROFIT_MARGIN_MIN: 10, // Pourcentage minimum de marge bénéficiaire
    ROI_MIN: 15, // ROI minimum attendu

    // Stock d'alimentation
    FEED_LOW_STOCK_DAYS: 7
};

// === LIMITES DE PAGINATION ===
export const PAGINATION_LIMITS = {
    DEFAULT: 50,
    MAX: 1000,
    MIN: 10
};

// === CODES D'ERREUR ===
export const ERROR_CODES = {
    // Authentification
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',

    // Validation
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',

    // Ressources
    NOT_FOUND: 'NOT_FOUND',
    ALREADY_EXISTS: 'ALREADY_EXISTS',

    // Serveur
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR'
};

// === MESSAGES D'ERREUR ===
export const ERROR_MESSAGES = {
    [ERROR_CODES.UNAUTHORIZED]: 'Authentification requise',
    [ERROR_CODES.FORBIDDEN]: 'Accès non autorisé',
    [ERROR_CODES.TOKEN_EXPIRED]: 'Token expiré',
    [ERROR_CODES.VALIDATION_ERROR]: 'Erreur de validation des données',
    [ERROR_CODES.MISSING_REQUIRED_FIELD]: 'Champ obligatoire manquant',
    [ERROR_CODES.NOT_FOUND]: 'Ressource non trouvée',
    [ERROR_CODES.ALREADY_EXISTS]: 'Ressource déjà existante',
    [ERROR_CODES.INTERNAL_ERROR]: 'Erreur interne du serveur',
    [ERROR_CODES.DATABASE_ERROR]: 'Erreur de base de données'
};

// === MESSAGES DE SUCCÈS ===
export const SUCCESS_MESSAGES = {
    CREATED: 'Ressource créée avec succès',
    UPDATED: 'Ressource mise à jour avec succès',
    DELETED: 'Ressource supprimée avec succès',
    OPERATION_SUCCESSFUL: 'Opération réalisée avec succès'
};