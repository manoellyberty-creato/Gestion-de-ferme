import Department from "../models/Departement.js"

// ===> Récupération de tous les départements
export async function getAllDepartmentsController(req, res) {
  try {
    const departments = await Department.find({ isActive: true }).sort({ name: 1 })
    res.status(200).json(departments)
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message })
  }
}

// ===> Récupération d'un département par id
export async function getDepartmentByIdController(req, res) {
  try {
    const departmentId = req.params.departmentId
    const department = await Department.findById(departmentId)
    
    if (!department) {
      const error = new Error("Département non trouvé")
      error.statusCode = 404
      throw error
    }
    
    res.status(200).json(department)
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message })
  }
}
