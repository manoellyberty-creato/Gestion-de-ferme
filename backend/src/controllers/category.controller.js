import Category from "../models/Category.js"

// ===> Récupération de toutes les catégories
export async function getAllCategoriesController(req, res) {
  try {
    const { department } = req.query
    let query = { isActive: true }
    
    if (department) {
      query.department = department
    }
    
    const categories = await Category.find(query).sort({ name: 1 })
    res.status(200).json(categories)
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message })
  }
}

// ===> Récupération d'une catégorie par id
export async function getCategoryByIdController(req, res) {
  try {
    const categoryId = req.params.categoryId
    const category = await Category.findById(categoryId)
    
    if (!category) {
      const error = new Error("Catégorie non trouvée")
      error.statusCode = 404
      throw error
    }
    
    res.status(200).json(category)
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message })
  }
}
