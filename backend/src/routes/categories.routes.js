import express from "express"
import {
  getAllCategoriesController,
  getCategoryByIdController
} from "../controllers/category.controller.js"

const router = express.Router()

// ===> Récupération de toutes les catégories (optionnellement filtrées par département)
router.get("/", getAllCategoriesController)

// ===> Récupération d'une catégorie par id
router.get("/:categoryId", getCategoryByIdController)

export default router
