import { DEPARTMENTS } from "../utils/constants.js";
import { connectDb, disconnectDB } from "../db/database.js";
import Category from "../models/Category.js";
import "dotenv/config";

const categories = [
    // ==> VOLAILLE
    {
        name: "Poulet",
        department: DEPARTMENTS.VOLAILLE,
        description: "Espèce de volaille élevée pour la viande et les œufs",
        metadata: { type: "Gallinacé" }
    },
    {
        name: "Dinde",
        department: DEPARTMENTS.VOLAILLE,
        description: "Volaille de grande taille",
        metadata: { croissance: "rapide" }
    },

    // ==> BETAIL
    {
        name: "Bovin",
        department: DEPARTMENTS.BETAIL,
        description: "Vaches et taureaux",
        metadata: { usage: "lait/viande" }
    },
    {
        name: "Caprin",
        department: DEPARTMENTS.BETAIL,
        description: "Chèvres",
        metadata: { usage: "viande/lait" }
    },
    {
        name: "Ovin",
        department: DEPARTMENTS.BETAIL,
        description: "Moutons",
        metadata: { usage: "viande" }
    },

    //==> PISCICULTURE
    {
        name: "Tilapia",
        department: DEPARTMENTS.PISCICULTURE,
        description: "Poisson d’eau douce très répandu",
        metadata: { croissance: "rapide" }
    },
    {
        name: "Clarias",
        department: DEPARTMENTS.PISCICULTURE,
        description: "Poisson-chat africain",
        metadata: { resistance: "élevée" }
    }
];

async function seedCategories() {
    try {
        console.log("🌱 Connexion à MongoDB...");
        await connectDb();
        console.log("✅ Connecté à MongoDB");

        console.log("🌱 Ajout des catégories...");
        let count = 0;
        for (const cat of categories) {
            const result = await Category.updateOne(
                { name: cat.name, department: cat.department },
                { $set: cat },
                { upsert: true }
            );
            count += result.upsertedCount || 0;
            console.log(`  ✓ ${cat.name}`);
        }
        console.log(`✅ ${count} nouvelle(s) catégorie(s) ajoutée(s)`);
    } catch (error) {
        console.error("❌ Erreur :", error.message);
        process.exit(1);
    } finally {
        await disconnectDB();
        process.exit(0);
    }
}
seedCategories();