import express from "express";
import {
    createCampaignController,
    getCampaignbyIdController,
    getManagerCampaignsController,
    getCampaignsController,
    getCampaignsByCategoryController,
    getCampaignsByDepartmentController,
    updateCampaignController,
    deleteCampaignController,
    assignManagerToCampaignController,
    assignAgentToCampaignController,
    assignVeterinarianToCampaignController,
    assignComptableToCampaignController,
    unassignAgentFromCampaignController
} from "../controllers/campaign.controller.js";

const router = express.Router();

// ===> Création d'une campagne
router.post("/create/:userId", createCampaignController);

// ===> Récupération d'une campagne par id
router.get("/:campaignId", getCampaignbyIdController);

// ===> Récupération de toutes les campagnes d'un manager (avec pagination)
router.get("/manager/:managerId", getManagerCampaignsController);

// ===> Récupération de toutes les campagnes (avec pagination)
router.get("/", getCampaignsController);

// ===> Récupération des campagnes par catégorie (avec pagination)
router.get("/category/:categoryId", getCampaignsByCategoryController);

// ===> Récupération des campagnes par département (avec pagination)
router.get("/department/:department", getCampaignsByDepartmentController);

// ===> Modification d'une campagne
router.patch("/update/:campaignId", updateCampaignController);

// ===> Suppression d'une campagne
router.delete("/delete/:campaignId", deleteCampaignController);

// ===> Assignation d'un manager à une campagne
router.put("/assignManager/:campaignId/:userId", assignManagerToCampaignController);

// ===> Assignation d'un agent à une campagne
router.put("/assignAgent/:campaignId/:userId", assignAgentToCampaignController);

// ===> Assignation d'un vétérinaire à une campagne
router.put("/assignVeterinarian/:campaignId/:userId", assignVeterinarianToCampaignController);


// ===> Assignation d'un comptable à une campagne
router.put("/assignComptable/:campaignId/:userId", assignComptableToCampaignController);

// ===> Désassignation d'un membre d'une campagne
router.delete("/unassign/:campaignId/:userId", unassignAgentFromCampaignController);

export default router;