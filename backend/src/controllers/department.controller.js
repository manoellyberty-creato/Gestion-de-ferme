import Department from '../models/Departement.js';
import Animal from '../models/Animal.js';

export const getAllWithStats = async (req, res) => {
  try {
    const departments = await Department.find();
    
    // On enrichit chaque département avec le nombre d'animaux
    const results = await Promise.all(departments.map(async (dept) => {
      const count = await Animal.countDocuments({ department: dept._id });
      return {
        ...dept._doc,
        animalCount: count
      };
    }));

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};