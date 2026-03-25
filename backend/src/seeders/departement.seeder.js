import Department from "../models/Departement.js";
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
    console.log("🌱 Connexion à MongoDB...");
    await connectDb();
    console.log("✅ Connecté à MongoDB");

    console.log("🌱 Ajout des départements...");
    let count = 0;
    for (const dept of departments) {
      const result = await Department.updateOne(
        { name: dept.name },
        { $set: dept },
        { upsert: true }
      );
      count += result.upsertedCount || 0;
      console.log(`  ✓ ${dept.name}`);
    }
    
    console.log(`✅ ${count} nouveau(x) département(s) ajouté(s)`);
  } catch (error) {
    console.error("❌ Erreur :", error.message);
    process.exit(1);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

seedDepartments();