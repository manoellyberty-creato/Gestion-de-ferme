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
    if (!name || !categoryId || !startDate || !expectedEndDate || !goal || budget == null || !goalMetrics) {
        const error = new Error("Tous les champs sont requis");
        error.statusCode = 400;
        throw error;
    }

    // === Vérification de la catégorie
    const category = await Category.findById(categoryId);
    if (!category) {
        const error = new Error("La catégorie n'existe pas");
        error.statusCode = 404;
        throw error;
    }

    // === Vérification de dates
    const start = new Date(startDate);
    const end = new Date(expectedEndDate);
    if (start >= end) {
        const error = new Error("La date de début doit être avant la fin");
        error.statusCode = 400;
        throw error;
    }
    if (start < new Date()) {
        const error = new Error("La date de début ne peut pas être dans le passé");
        error.statusCode = 400;
        throw error;
    }

    // === Vérification du manager
    const manager = await User.findById(userId);
    if (!manager) {
        const error = new Error("Le manager n'existe pas");
        error.statusCode = 404;
        throw error;
    }

    // === Création de la campagne
    const campaign = await Campaign.create({
        name,
        categoryId,
        managerId: userId,
        startDate,
        expectedEndDate,
        goal,
        budget,
        goalMetrics
    });
    return campaign;
}

// ===> Récupération d'une campagne par id
export async function getCampaignbyId(campaignId) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
        const error = new Error("La campagne n'existe pas");
        error.statusCode = 404;
        throw error;
    }
    return campaigns.map(c => ({
        id: c._id,
        name: c.name,
        category: c.categoryId,
        department: c.department,
        startDate: c.startDate,
        endDate: c.endDate
    }));
}

// ===> Récupération de toutes les campagnes d'un manager (AVEC PAGINATION)
export async function getManagerCampaigns(managerId, page = 1, limit = 10) {
    const campaigns = await Campaign.find({ managerId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return campaigns.map(c => ({
        id: c._id,
        name: c.name,
        category: c.categoryId,
        department: c.department,
        startDate: c.startDate,
        endDate: c.endDate
    }));
}

// ===> Récupération de toutes les campagnes (AVEC PAGINATION)
export async function getCampaigns(page = 1, limit = 10) {
    const campaigns = await Campaign.find()
        .sort({ startDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return campaigns.map(c => ({
        id: c._id,
        name: c.name,
        category: c.categoryId,
        department: c.department,
        startDate: c.startDate,
        endDate: c.endDate
    }))
}

// ===> Récupération des campagnes par catégorie (AVEC PAGINATION)
export async function getCampaignsByCategory(categoryId, page = 1, limit = 10) {
    const campaigns = await Campaign.find({ categoryId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return campaigns.map(c => ({
        id: c._id,
        name: c.name,
        category: c.categoryId,
        department: c.department,
        startDate: c.startDate,
        endDate: c.endDate
    }));
}

// ===> Récupération des campagnes par département (AVEC PAGINATION)
export async function getCampaignsByDepartment(department, page = 1, limit = 10) {

    // === Trouver les catégories du département
    const categories = await Category.find({ department });

    const categoryIds = categories.map(c => c._id.toString());

    // === Trouver les campagnes liées
    const campaigns = await Campaign.find({
        categoryId: { $in: categoryIds }
    })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return campaigns;
}

// ===> Modification d'une campagne
export async function updateCampaign(campaignId, data) {
    const {
        name,
        categoryId,
        startDate,
        expectedEndDate,
        budget
    } = data;

    // === Validation du nom
    if (name && name.length < 3) {
        const error = new Error("Le nom de la campagne est trop court");
        error.statusCode = 400;
        throw error;
    }

    // === Vérification de la catégorie
    if (categoryId) {
        const category = await Category.findById(categoryId);
        if (!category) {
            const error = new Error("La catégorie n'existe pas");
            error.statusCode = 404;
            throw error;
        }
    }

    // === Vérification de dates
    if (startDate && expectedEndDate) {
        const start = new Date(startDate);
        const end = new Date(expectedEndDate);

        if (start >= end) {
            const error = new Error("La date de début doit être avant la fin");
            error.statusCode = 400;
            throw error;
        }
    }

    // === Vérification du budget
    if (budget !== undefined && (typeof budget !== "number" || budget < 0)) {
        const error = new Error("Budget invalide");
        error.statusCode = 400;
        throw error;
    }

    // === Mise à jour
    const campaign = await Campaign.findByIdAndUpdate(
        campaignId,
        data,
        { new: true, runValidators: true }
    );

    if (!campaign) {
        const error = new Error("La campagne n'existe pas");
        error.statusCode = 404;
        throw error;
    }

    return campaign;
}

// ===> Suppression d'une campagne
export async function deleteCampaign(campaignId) {
    // === Vérifier si la campagne existe
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
        const error = new Error("La campagne n'existe pas");
        error.statusCode = 404;
        throw error;
    }

    // === Vérifier s'il y a des animaux liés
    const animalsCount = await Animal.countDocuments({ campaignId: campaignId });
    if (animalsCount > 0) {
        const error = new Error("Impossible de supprimer : des animaux sont liés à cette campagne");
        error.statusCode = 400;
        throw error;
    }

    // === Suppression
    await Campaign.findByIdAndDelete(campaignId);

    return { message: "Campagne supprimée avec succès" };
}

// ===> Assignation d'un agent à une campagne
export async function assignAgentToCampaign(campaignId, userId) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
        const error = new Error("La campagne n'existe pas");
        error.statusCode = 404;
        throw error;
    }

    // === Vérification de l'agent
    const agent = await User.findById(userId);
    if (!agent) {
        const error = new Error("L'agent n'existe pas");
        error.statusCode = 404;
        throw error;
    }

    // === Vérification (agent !== manager)
    if (campaign.managerId.toString() !== agent._id.toString()) {
        const error = new Error("Vous n'avez pas accès à cette campagne en tant que agent");
        error.statusCode = 403;
        throw error;
    }

    // === Vérification de la disponibilité de l'agent
    const agents = await User.find({ role: "agent" });
    const availableAgents = agents.filter(a => a.isAvailable);
    if (availableAgents.length === 0) {
        const error = new Error("Aucun agent disponible");
        error.statusCode = 400;
        throw error;
    }

    // === Assignation
    campaign.assignedAgents.push({
        userId: userId,
        assignedAt: Date.now(),
        role: "agent"
    });

    await campaign.save();

    return campaign;
}

// ===> Assignation d'un vétérinaire à une campagne
export async function assignVeterinarianToCampaign(campaignId, userId) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
        const error = new Error("La campagne n'existe pas");
        error.statusCode = 404;
        throw error;
    }

    // === Vérification de l'agent
    const veterinarian = await User.findById(userId);
    if (!veterinarian) {
        const error = new Error("L'agent n'existe pas");
        error.statusCode = 404;
        throw error;
    }

    // === Vérification de l'agent
    if (campaign.managerId.toString() !== veterinarian._id.toString()) {
        const error = new Error("Vous n'avez pas accès à cette campagne");
        error.statusCode = 403;
        throw error;
    }

    // === Vérification de la disponibilité de l'agent
    const veterinarians = await User.find({ role: "veterinarian" });
    const availableVeterinarians = veterinarians.filter(a => a.isAvailable);
    if (availableVeterinarians.length === 0) {
        const error = new Error("Aucun vétérinaire disponible");
        error.statusCode = 400;
        throw error;
    }

    // === Assignation
    campaign.assignedAgents.push({
        userId: userId,
        assignedAt: Date.now(),
        role: "veterinarian"
    });

    await campaign.save();

    return campaign;
}