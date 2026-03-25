// controllers/departmentController.js
// Vérifie l'orthographe : departement vs department
import { departmentService } from "../services/department.service.js"; 

export const getDepartments = async (req, res) => {
  try {
    const departments = await departmentService.fetchActiveDepartments();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};