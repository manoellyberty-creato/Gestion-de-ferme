import express from "express";
import {
    createCampaignController,
    getCampaignbyIdController,
    getManagerCampaignsController,
    getCampaignsController,
    getCampaignsByCategoryController,
    getCampaignsByDepartmentController,
    updateCampaignController,
    deleteCampaignController
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
router.put("/update/:campaignId", updateCampaignController);

// ===> Suppression d'une campagne
router.delete("/delete/:campaignId", deleteCampaignController);

export default router;