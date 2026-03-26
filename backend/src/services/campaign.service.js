import Campaign from "../models/Campaign.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import Animal from "../models/Animal.js";
import Department from "../models/Departement.js";
import mongoose from "mongoose";
import qrCodeService from "../services/qrCode.service.js";
import { CAMPAIGN_STATUS } from "../utils/constants.js";

// ===> Création d'une campagne
export async function createCampaign(data, userId) {
    const {
        name,
        department,
        startDate,
        expectedEndDate,
        goal,
        budget,
        goalMetrics
    } = data;

    //=== Validation des champs
    if (!name || !startDate || !expectedEndDate || !goal || budget == null || !department) {
        const error = new Error("Tous les champs requis ne sont pas fournis");
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

    // === Création de la campagne (sans catégories)
    const campaign = await Campaign.create({
        name,
        department,
        managerId: userId,
        startDate,
        expectedEndDate,
        goal,
        budget,
        goalMetrics,
        notes: data.notes || ''
    });

    const populatedCampaign = await Campaign.findById(campaign._id)
        .populate('department')
        .populate('assignedAgents.userId');

    return populatedCampaign;

}

// ===> Récupération d'une campagne par id
export async function getCampaignbyId(campaignId) {
    const campaign = await Campaign.findById(campaignId)
        .populate("department")
        .populate("assignedAgents.userId");
    if (!campaign) {
        const error = new Error("La campagne n'existe pas");
        error.statusCode = 404;
        throw error;
    }

    const animals = await Animal.find({ campaign: campaign._id });

    const result = campaign.toObject();
    result.animals = animals;

    return result;
}

export async function unassignAgentFromCampaign(campaignId, userId) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
        const error = new Error("La campagne n'existe pas");
        error.statusCode = 404;
        throw error;
    }

    const assignmentIndex = campaign.assignedAgents.findIndex(
        (a) => a.userId.toString() === userId.toString()
    );

    if (assignmentIndex === -1) {
        const error = new Error("Aucun membre assigné avec cet userId");
        error.statusCode = 404;
        throw error;
    }

    campaign.assignedAgents.splice(assignmentIndex, 1);
    await campaign.save();

    // ✅ Retourner la campagne complètement populée pour éviter l'affichage "Inconnu"
    return await Campaign.findById(campaignId)
        .populate("department")
        .populate("assignedAgents.userId");
}

// ===> Récupération de toutes les campagnes d'un manager (AVEC PAGINATION & POPULATE)
export async function getManagerCampaigns(managerId, page = 1, limit = 10) {
    const campaigns = await Campaign.find({ managerId })
        .populate("department")
        .populate("assignedAgents.userId")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return campaigns
}

// ===> Récupération de toutes les campagnes (AVEC PAGINATION & POPULATE)
export async function getCampaigns(page = 1, limit = 10, categoryId = null, department = null, search = null) {
    const query = {};

    // Note: Les campagnes ne sont plus filtrées par catégorie car le champ n'existe plus.
    if (department) {
        if (mongoose.Types.ObjectId.isValid(department)) {
            query.department = department;
        } else {
            const dept = await Department.findOne({ name: department });
            if (dept) query.department = dept._id;
            else return [];
        }
    }

    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }

    const campaigns = await Campaign.find(query)
        .populate("department")
        .populate("assignedAgents.userId")
        .sort({ startDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return campaigns;
}

// ===> Récupération des campagnes par catégorie (AVEC PAGINATION)
// (Désactivé : campagnes non liées à une catégorie spécifique)
export async function getCampaignsByCategory(categoryId, page = 1, limit = 10) {
    try {
        const campaigns = await Campaign.find({})
            .populate("department")
            .populate("assignedAgents.userId")
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
        let departmentId = null;
        if (mongoose.Types.ObjectId.isValid(department)) {
            departmentId = department;
        } else {
            const dept = await Department.findOne({ name: department });
            if (!dept) return [];
            departmentId = dept._id;
        }

        const campaigns = await Campaign.find({ department: departmentId })
            .populate("department")
            .populate("assignedAgents.userId")
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
        startDate,
        expectedEndDate,
        budget,
        status,
        description,
        goal,
        goalMetrics
    } = data;

    // === Validation du nom
    if (name && name.length < 3) {
        const error = new Error("Le nom de la campagne est trop court");
        error.statusCode = 400;
        throw error;
    }

    // === Validation du statut
    if (status) {
        const validStatuses = Object.values(CAMPAIGN_STATUS);
        if (!validStatuses.includes(status)) {
            const error = new Error(`Statut invalide. Valeurs acceptées: ${validStatuses.join(', ')}`);
            error.statusCode = 400;
            throw error;
        }
    }

    // La campagne n'est plus liée à une catégorie unique.

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

    // === Mise à jour (avec populate)
    const updateData = {
        ...(name && { name }),
        ...(startDate && { startDate }),
        ...(expectedEndDate && { expectedEndDate }),
        ...(budget !== undefined && { budget }),
        ...(status && { status }),
        ...(description !== undefined && { description }),
        ...(goal && { goal }),
        ...(goalMetrics && { goalMetrics })
    };

    const campaign = await Campaign.findByIdAndUpdate(
        campaignId,
        updateData,
        { new: true, runValidators: true }
    ).populate('department').populate('assignedAgents.userId');

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
    // ✅ Retourner la campaign complètement populée pour la réactivité
    return await Campaign.findById(campaignId)
        .populate("department")
        .populate("assignedAgents.userId");
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
    // ✅ Retourner la campaign complètement populée pour la réactivité
    return await Campaign.findById(campaignId)
        .populate("department")
        .populate("assignedAgents.userId");
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
    // ✅ Retourner la campaign complètement populée pour la réactivité
    return await Campaign.findById(campaignId)
        .populate("department")
        .populate("assignedAgents.userId");
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

    // comptable.isActive = false;
    // await comptable.save();

    campaign.assignedAgents.push({
        userId: userId,
        assignedAt: Date.now(),
        role: "comptable"
    });

    await campaign.save();
    // ✅ Retourner la campaign complètement populée pour la réactivité
    return await Campaign.findById(campaignId)
        .populate("department")
        .populate("assignedAgents.userId");
}
