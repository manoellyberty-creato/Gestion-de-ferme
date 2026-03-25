import Department from "../models/Department.js";
import { DEPARTMENTS } from "../utils/constants.js";
import { connectDb, disconnectDB } from "../db/database.js";
import "dotenv/config";

const departments = [
  {
    name: DEPARTMENTS.VOLAILLE,
    description: "Élevage de volailles (poules, dindes...)",
    metadata: { type: "aviculture" }
  },
  {
    name: DEPARTMENTS.BETAIL,
    description: "Élevage de bétail (bovins, caprins, ovins...)",
    metadata: { type: "élevage terrestre" }
  },
  {
    name: DEPARTMENTS.PISCICULTURE,
    description: "Élevage de poissons",
    metadata: { type: "aquaculture" }
  }
];

async function seedDepartments() {
  try {
    await connectDb()
    for (const dept of departments) {
      await Department.updateOne(
        { name: dept.name },
        { $set: dept },
        { upsert: true }
      );
    }
    console.log("Départements ajoutés avec succès");
  } catch (error) {
    console.error("Erreur :", error);
  }finally{
    await disconnectDB();
  }
}
seedDepartments();