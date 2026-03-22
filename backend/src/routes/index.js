import Router from "express";
import campaignsRoutes from "./campaigns.routes.js";
import alertsRoutes from "./alerts.routes.js";

const router = Router();

router.use("campaign", campaignsRoutes);
router.use("alert", alertsRoutes);

export default router;