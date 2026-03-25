// routes/departmentRoutes.js
import express from "express";
import { getDepartments } from "../controllers/department.controller.js";

const router = express.Router();

// Route pour obtenir la liste complète
router.get("/", getDepartments);

export default router;