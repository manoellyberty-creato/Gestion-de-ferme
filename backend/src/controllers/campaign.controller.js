import {
    createCampaign,
    getCampaignbyId,
    getManagerCampaigns,
    getCampaigns,
    getCampaignsByCategory,
    getCampaignsByDepartment,
    updateCampaign,
    deleteCampaign
} from "../services/campaign.service.js";

// ===> Création d'une campagne
export async function createCampaignController(req, res) {
    try {
        const data = req.body; 
        const userId = req.auth.userId;
        const campaign = await createCampaign(data, userId);
        res.status(201).json(campaign);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
}

// ===> Récupération d'une campagne par id
export async function getCampaignbyIdController(req, res) {
    try {
        const campaignId = req.params.campaignId;
        const campaign = await getCampaignbyId(campaignId);
        res.status(200).json(campaign);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
}

// ===> Récupération de toutes les campagnes d'un manager (AVEC PAGINATION)
export async function getManagerCampaignsController(req, res) {
    try {
        const { page, limit } = req.query;
        const managerId = req.params.managerId;
        const campaigns = await getManagerCampaigns(
            managerId,
            parseInt(page) || 1,
            parseInt(limit) || 10
        );
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
}

// ===> Récupération de toutes les campagnes (AVEC PAGINATION)
export async function getCampaignsController(req, res) {
    try {
        const { page, limit } = req.query;
        const campaigns = await getCampaigns(
            parseInt(page) || 1,
            parseInt(limit) || 10
        );
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
}

// ===> Récupération des campagnes par catégorie (AVEC PAGINATION)
export async function getCampaignsByCategoryController(req, res) {
    try {
        const { page, limit } = req.query;
        const categoryId = req.params.categoryId;
        const campaigns = await getCampaignsByCategory(
            categoryId,
            parseInt(page) || 1,
            parseInt(limit) || 10
        );
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
}

// ===> Récupération des campagnes par département (AVEC PAGINATION)
export async function getCampaignsByDepartmentController(req, res) {
    try {
        const { page, limit } = req.query;
        const department = req.params.department;
        const campaigns = await getCampaignsByDepartment(
            department,
            parseInt(page) || 1,
            parseInt(limit) || 10
        );
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
}

// ===> Modification d'une campagne
export async function updateCampaignController(req, res) {
    try {
        const data = req.body;
        const campaignId = req.params.campaignId; 
        const campaign = await updateCampaign(campaignId, data);
        res.status(200).json(campaign);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
}

// ===> Suppression d'une campagne
export async function deleteCampaignController(req, res) {
    try {
        const campaignId = req.params.campaignId;
        const result = await deleteCampaign(campaignId);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
}