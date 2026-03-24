import Department from "../models/Departement.js"

// ===> Récupérer tous les départements
export async function getAllDepartments() {
  try {
    const departments = await Department.find({ isActive: true }).sort({ name: 1 })
    return departments
  } catch (error) {
    const err = new Error("Erreur lors de la récupération des départements")
    err.statusCode = 500
    throw err
  }
}

// ===> Récupérer un département par id
export async function getDepartmentById(departmentId) {
  try {
    const department = await Department.findById(departmentId)
    
    if (!department) {
      const error = new Error("Département non trouvé")
      error.statusCode = 404
      throw error
    }
    
    return department
  } catch (error) {
    if (error.statusCode) throw error
    
    const err = new Error("Erreur lors de la récupération du département")
    err.statusCode = 500
    throw err
  }
}
