import express from "express";
import alertController from "../controllers/alert.controller.js";
import requireAuth from "../middlewares/requireAuth.js";

const router = express.Router();

// ===> GET all alerts
router.get("/", requireAuth, (req, res, next) => alertController.getAllAlerts(req, res, next));

// ===> GET alert by ID
router.get("/:id", requireAuth, (req, res, next) => alertController.getAlertById(req, res, next));

// ===> POST create alert
router.post("/", requireAuth, (req, res, next) => alertController.createAlert(req, res, next));

// ===> POST mark alert as read
router.post("/:id/read", requireAuth, (req, res, next) => alertController.markAsRead(req, res, next));

// ===> POST resolve alert
router.post("/:id/resolve", requireAuth, (req, res, next) => alertController.resolveAlert(req, res, next));

// ===> DELETE alert
router.delete("/:id", requireAuth, (req, res, next) => alertController.deleteAlert(req, res, next));

// ===> POST generate automated alerts
router.post("/generate", requireAuth, (req, res, next) => alertController.generateAutomatedAlerts(req, res, next));

export default router;
