import Campaign from "../models/Campaign.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import Animal from "../models/Animal.js";
import Department from "../models/Departement.js";
import mongoose from "mongoose";

// ===> Création d'une campagne
export async function createCampaign(data, userId) {
    const {
        name,
        categoryId,
        department,
        startDate,
        expectedEndDate,
        goal,
        budget,
        goalMetrics
    } = data;

    //=== Validation des champs
    if (!name || !categoryId || !startDate || !expectedEndDate ||
        !goal || budget == null || !goalMetrics || !department) {
        const error = new Error("Tous les champs sont requis");
        error.statusCode = 400;
        throw error;
    }

    // === Vérification du département
    const existingDepartment = await Department.findById(department);
    if (!existingDepartment) {
        const error = new Error("Le département n'existe pas");
        error.statusCode = 404;
        throw error;
    }

    // === Création de la campagne
    const campaign = await Campaign.create({
        name,
        categoryId,
        department,
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
    return campaign;
}

// ===> Récupération de toutes les campagnes d'un manager (AVEC PAGINATION)
export async function getManagerCampaigns(managerId, page = 1, limit = 10) {
    const campaigns = await Campaign.find({ managerId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return campaigns
}

// ===> Récupération de toutes les campagnes (AVEC PAGINATION)
export async function getCampaigns(page = 1, limit = 10) {
    const campaigns = await Campaign.find()
        .sort({ startDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return campaigns
}

// ===> Récupération des campagnes par catégorie (AVEC PAGINATION)
export async function getCampaignsByCategory(categoryId, page = 1, limit = 10) {
    try {
        const validCategoryId = new mongoose.Types.ObjectId(categoryId);
        const campaigns = await Campaign.find({ categoryId: validCategoryId })
            .populate("department")
            .populate("categoryId")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        return campaigns;
    } catch (error) {
        console.error("Erreur getCampaignsByCategory:", error);
        throw error;
    }
}

// ===> Récupération des campagnes par département (AVEC PAGINATION)
export async function getCampaignsByDepartment(department, page = 1, limit = 10) {
    try {
        if (!mongoose.Types.ObjectId.isValid(department)) {
            return [];
        }
        const deptId = new mongoose.Types.ObjectId(department);
        const categories = await Category.find({ department: deptId });
        if (categories.length === 0) return [];
        const categoryIds = categories.map(c => c._id);
        const campaigns = await Campaign.find({
            categoryId: { $in: categoryIds }
        })
            .populate("categoryId")
            .populate("department")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        return campaigns;
    } catch (error) {
        console.error("Erreur getCampaignsByDepartment:", error);
        throw error;
    }
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

// ===> Assignation d'un manager à une campagne
export async function assignManagerToCampaign(campaignId, userId) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
        const error = new Error("La campagne n'existe pas");
        error.statusCode = 404;
        throw error;
    }

    if (campaign.assignedAgents.some(a => a.role === "manager")) {
        const error = new Error("Un manager est déjà assigné à cette campagne");
        error.statusCode = 400;
        throw error;
    }

    if (campaign.assignedAgents.some(a => a.userId.toString() === userId.toString())) {
        const error = new Error("Cet utilisateur est déjà assigné à cette campagne");
        error.statusCode = 400;
        throw error;
    }

    const manager = await User.findById(userId);
    if (!manager) {
        const error = new Error("L'utilisateur n'existe pas");
        error.statusCode = 404;
        throw error;
    }

    if (manager.role !== "manager") {
        const error = new Error("L'utilisateur n'a pas le rôle requis (manager)");
        error.statusCode = 403;
        throw error;
    }

    // manager.isActive = false;
    // await manager.save();

    campaign.assignedAgents.push({
        userId: userId,
        assignedAt: Date.now(),
        role: "manager"
    });

    await campaign.save();
    return campaign.assignedAgents;
}

// ===> Assignation d'un agent à une campagne
export async function assignAgentToCampaign(campaignId, userId) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
        const error = new Error("La campagne n'existe pas");
        error.statusCode = 404;
        throw error;
    }
    const alreadyAssigned = campaign.assignedAgents.some(
        a => a.userId.toString() === userId.toString()
    );
    if (alreadyAssigned) {
        const error = new Error("Cet agent est déjà assigné à cette campagne");
        error.statusCode = 400;
        throw error;
    }

    const agent = await User.findById(userId);
    if (!agent) {
        const error = new Error("L'agent n'existe pas");
        error.statusCode = 404;
        throw error;
    }

    if (agent.role !== "agent") {
        const error = new Error("L'utilisateur n'est pas un agent");
        error.statusCode = 403;
        throw error;
    }

    if (!agent.isActive) {
        const error = new Error("Cet agent n'est pas disponible actuellement");
        error.statusCode = 400;
        throw error;
    }

    // agent.isActive = false;
    // await agent.save();

    campaign.assignedAgents.push({
        userId: userId,
        assignedAt: Date.now(),
        role: "agent"
    });

    await campaign.save();
    return campaign.assignedAgents;
}

// ===> Assignation d'un vétérinaire à une campagne
export async function assignVeterinarianToCampaign(campaignId, userId) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
        const error = new Error("La campagne n'existe pas");
        error.statusCode = 404;
        throw error;
    }

    const alreadyAssigned = campaign.assignedAgents.some(
        a => a.userId.toString() === userId.toString()
    );
    if (alreadyAssigned) {
        const error = new Error("Ce vétérinaire est déjà assigné à cette campagne");
        error.statusCode = 400;
        throw error;
    }

    const veterinarian = await User.findById(userId);
    if (!veterinarian) {
        const error = new Error("L'utilisateur n'existe pas");
        error.statusCode = 404;
        throw error;
    }

    if (veterinarian.role !== "veterinaire") {
        const error = new Error("L'utilisateur n'est pas un vétérinaire");
        error.statusCode = 403;
        throw error;
    }

    if (!veterinarian.isActive) {
        const error = new Error("Ce vétérinaire n'est pas disponible actuellement");
        error.statusCode = 400;
        throw error;
    }
    veterinarian.isActive = false;
    await veterinarian.save();

    campaign.assignedAgents.push({
        userId: userId,
        assignedAt: Date.now(),
        role: "veterinaire"
    });
    await campaign.save();
    return campaign.assignedAgents;
}

// ===> Assignation d'un comptable à une campagne
export async function assignComptableToCampaign(campaignId, userId) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
        const error = new Error("La campagne n'existe pas");
        error.statusCode = 404;
        throw error;
    }

    const alreadyAssigned = campaign.assignedAgents.some(
        a => a.userId.toString() === userId.toString()
    );
    if (alreadyAssigned) {
        const error = new Error("Ce comptable est déjà assigné à cette campagne");
        error.statusCode = 400;
        throw error;
    }

    const comptable = await User.findById(userId);
    if (!comptable) {
        const error = new Error("L'utilisateur n'existe pas");
        error.statusCode = 404;
        throw error;
    }

    if (comptable.role !== "comptable") {
        const error = new Error("L'utilisateur n'est pas un comptable");
        error.statusCode = 403;
        throw error;
    }

    if (!comptable.isActive) {
        const error = new Error("Ce comptable n'est pas disponible");
        error.statusCode = 400;
        throw error;
    }

    comptable.isActive = false;
    await comptable.save();

    campaign.assignedAgents.push({
        userId: userId,
        assignedAt: Date.now(),
        role: "comptable"
    });

    await campaign.save();
    return campaign.assignedAgents;
}