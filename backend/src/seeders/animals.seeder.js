import Animal from "../models/Animal.js";
import { connectDb, disconnectDB } from "../db/database.js";
import path from "path";
import dotenv from "dotenv";

// Configuration du chemin du .env
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

const animals = [
    {
        "name": "poulet-1",
        "campaignId": "65f2a1b2c3d4e5f6a7b8c9d0",
        "qrCode": "ANI-2024-001",
        "initialWeight": 25.5,
        "currentWeight": 32.2,
        "status": "VIVANT",
        "dateOfBirth": "2024-01-15T08:00:00.000Z",
        "entryDate": "2024-02-01T10:00:00.000Z",
        "growthHistory": [
            { "date": "2024-02-15T09:00:00.000Z", "weight": 28.3, "notes": "Bonne adaptation" },
            { "date": "2024-03-01T09:00:00.000Z", "weight": 32.2, "notes": "Croissance normale" }
        ],
        "metadata": { "race": "Large White", "provenance": "Ferme Nord" }
    },
    {
        "name": "poulet-2",
        "campaignId": "65f2a1b2c3d4e5f6a7b8c9d0",
        "qrCode": "ANI-2024-002",
        "initialWeight": 22.0,
        "currentWeight": 85.0,
        "status": "VENDU",
        "dateOfBirth": "2023-11-10T08:00:00.000Z",
        "entryDate": "2023-12-01T10:00:00.000Z",
        "exitDate": "2024-03-20T16:30:00.000Z",
        "exitReason": "vendu",
        "growthHistory": [
            { "date": "2024-01-10T10:00:00.000Z", "weight": 45.0, "notes": "RAS" }
        ]
    },
    {
        "name": "poulet-3",
        "campaignId": "65f2a1b2c3d4e5f6a7b8c9e1",
        "qrCode": "ANI-2024-003",
        "initialWeight": 18.2,
        "currentWeight": null,
        "status": "VIVANT",
        "dateOfBirth": "2024-03-01T07:30:00.000Z",
        "entryDate": "2024-03-24T14:00:00.000Z",
        "growthHistory": [],
        "metadata": { "couleur": "Tacheté", "enclos": "Zone B" }
    }
];

async function seedAnimals() {
    try {
        console.log("Tentative de connexion à MongoDB...");
        await connectDb();
        console.log("Connexion DB établie avec succès.");

        // OPTIONNEL : Décommente la ligne suivante si tu veux vider la collection avant le seed
        // await Animal.deleteMany({}); 
        // console.log("Collection nettoyée.");

        for (const animal of animals) {
            // Utilisation de updateOne avec upsert pour mettre à jour ou créer si inexistant
            const result = await Animal.updateOne(
                { qrCode: animal.qrCode }, 
                { $set: animal },
                { upsert: true }
            );

            if (result.upsertedCount > 0) {
                console.log(`✅ [CRÉÉ] Animal : ${animal.name} (QR: ${animal.qrCode})`);
            } else {
                console.log(`🔄 [MIS À JOUR] Animal : ${animal.name} (QR: ${animal.qrCode})`);
            }
        }
        
        console.log("\n--- Seed terminé avec succès ! ---");
    } catch (error) {
        console.error("❌ Erreur lors du seeding :", error);
    } finally {
        await disconnectDB();
        console.log("Connexion DB fermée.");
        process.exit(0); // On force la sortie propre du script
    }
}

seedAnimals();