import express from "express";

import { detectAlerts } from "../services/alert.service.js";

const router = express.Router();

// ===> Détection d'alertes

router.post("/detect", detectAlerts);

export default router;