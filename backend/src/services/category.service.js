import Category from "../models/Category.js"

// ===> Récupérer toutes les catégories
export async function getAllCategories(department = null) {
  try {
    let query = { isActive: true }
    
    if (department) {
      query.department = department
    }
    
    const categories = await Category.find(query).sort({ name: 1 })
    return categories
  } catch (error) {
    const err = new Error("Erreur lors de la récupération des catégories")
    err.statusCode = 500
    throw err
  }
}

// ===> Récupérer une catégorie par id
export async function getCategoryById(categoryId) {
  try {
    const category = await Category.findById(categoryId)
    
    if (!category) {
      const error = new Error("Catégorie non trouvée")
      error.statusCode = 404
      throw error
    }
    
    return category
  } catch (error) {
    if (error.statusCode) throw error
    
    const err = new Error("Erreur lors de la récupération de la catégorie")
    err.statusCode = 500
    throw err
  }
}
