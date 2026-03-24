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
        await connectDb();
        for (const cat of categories) {
            await Category.updateOne(
                { name: cat.name, department: cat.department },
                { $set: cat },
                { upsert: true }
            );
        }
        console.log("Catégories ajoutées avec succès");
    } catch (error) {
        console.error("Erreur :", error);
    }finally{
        await disconnectDB();
    }
}
seedCategories();