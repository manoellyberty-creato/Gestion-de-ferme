import express from "express"
import {
  getAllDepartmentsController,
  getDepartmentByIdController
} from "../controllers/department.controller.js"

const router = express.Router()

// ===> Récupération de tous les départements
router.get("/", getAllDepartmentsController)

// ===> Récupération d'un département par id
router.get("/:departmentId", getDepartmentByIdController)

export default router
