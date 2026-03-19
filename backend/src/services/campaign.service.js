import Campaign from "../models/Campaign.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import Animal from "../models/Animal.js";

// ===> Création d'une campagne
export async function createCampaign(data, userId) {
    const {
        name,
        categoryId,
        startDate,
        expectedEndDate,
        goal,
        budget,
        goalMetrics
    } = data;

    //=== Validation des champs
    if (!name || !categoryId || !startDate || !expectedEndDate || !goal || !budget || !goalMetrics) {
        const error = new Error("Tous les champs sont requis");
        error.statusCode = 400;
        throw error;
    }
    // === Vérification de la catégorie
    const category = await Category.findById(categoryId);
    if (!category) {
        const error = new Error("La catégorie n'existe pas");
        error.statusCode = 400;
        throw error;
    }
    // === Vérification de dates
    if (startDate > expectedEndDate || startDate < new Date()) {
        const error = new Error("La date entrée est invalide");
        error.statusCode = 400;
        throw error;
    }
    // === Vérification du manager
    const manager = await User.findById(userId);
    if (!manager) {
        const error = new Error("Le manager n'existe pas");
        error.statusCode = 400;
        throw error;
    }
    // === Création de la campagne
    const campaign = await Campaign.create(data)
    return campaign;
}

// ===> Récupération d'une campagne par l'id
export async function getCampaignbyId(campaignId) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
        const error = new Error("La campagne n'existe pas");
        error.statusCode = 400;
        throw error;
    }
    return campaign;
}

// ===> Récupération de toutes les campagnes d'un manager
export async function getManagerCampaigns(managerId) {
    const campaigns = await Campaign.find({ managerId: managerId });
    if (!campaigns) {
        const error = new Error("Aucune campagne trouvée");
        error.statusCode = 400;
        throw error;
    }
    return campaigns;
}

// ===> Récupération de toutes les campagnes
export async function getCampaigns(page = 1, limit = 10) {
    const campaigns = await Campaign.find()
        .sort({ startDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    if (!campaigns) {
        const error = new Error("Aucune campagne trouvée");
        error.statusCode = 400;
        throw error;
    }
    return campaigns;
}

// ===> Récupération des campagnes par catégorie
export async function getCampaignsByCategory(categoryId) {
    const campaigns = await Campaign.find({ categoryId: categoryId });
    if (!campaigns) {
        const error = new Error("Aucune campagne trouvée");
        error.statusCode = 400;
        throw error;
    }
    return campaigns;
}

// ===> Récupération des campagnes par département
export async function getCampaignsByDepartment(department) {
    const campaigns = await Campaign.find({ department: department });
    if (!campaigns) {
        const error = new Error("Aucune campagne trouvée");
        error.statusCode = 400;
        throw error;
    }
    return campaigns;
}

// ===> Modification d'une campagne
export async function updateCampaign(campaignId, data) {
    const {
        name,
        categoryId,
        startDate,
        expectedEndDate,
        goal,
        budget,
        goalMetrics
    } = data;

    // === Validation du nom
    if (name.length < 3) {
        const error = new Error("Le nom de la campagne est trop court");
        error.statusCode = 400;
        throw error;
    }
    // === Vérification de la catégorie
    const category = await Category.findById(categoryId);
    if (!category) {
        const error = new Error("La catégorie n'existe pas");
        error.statusCode = 400;
        throw error;
    }
    // === Vérification de dates
    if (startDate > expectedEndDate || startDate < new Date()) {
        const error = new Error("La date entrée est invalide");
        error.statusCode = 400;
        throw error;
    }

    const campaign = await Campaign.findByIdAndUpdate(campaignId, data);
    if (!campaign) {
        const error = new Error("La campagne n'existe pas");
        error.statusCode = 400;
        throw error;
    }
    return campaign;
}





