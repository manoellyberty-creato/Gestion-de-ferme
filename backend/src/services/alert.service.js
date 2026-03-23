import mongoose from "mongoose";
import Animal from "../models/Animal.js";
import Prescription from "../models/Prescription.js";

export async function detectAlerts(campaignId) {
    const alerts = [];
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
        return { campaignId, alerts, error: "ID de campagne invalide" };
    }
    const validCampaignId = new mongoose.Types.ObjectId(campaignId);
    const animals = await Animal.find({ campaignId: validCampaignId });
    const totalAnimals = animals.length;

    if (totalAnimals === 0) {
        return { campaignId, alerts };
    }

    // ===> ALERTE MORTALITÉ
    const deadAnimals = animals.filter(a => a.status === "mort").length;
    const mortalityRate = (deadAnimals / totalAnimals) * 100;

    if (mortalityRate >= 10) {
        alerts.push({
            type: "mortality",
            level: "danger",
            message: `Taux de mortalité élevé (${mortalityRate.toFixed(2)}%)`
        });
    }

    // ===> ALERTE PERTE DE POIDS
    let weightLossCount = 0;
    animals.forEach(animal => {
        if (animal.growthHistory && animal.growthHistory.length >= 2) {
            const last = animal.growthHistory[animal.growthHistory.length - 1].weight;
            const previous = animal.growthHistory[animal.growthHistory.length - 2].weight;

            if (previous > 0) {
                const lossPercent = ((previous - last) / previous) * 100;
                if (lossPercent >= 15) {
                    weightLossCount++;
                }
            }
        }
    });

    const weightLossRate = (weightLossCount / totalAnimals) * 100;
    if (weightLossRate >= 20) {
        alerts.push({
            type: "weight_loss",
            level: "warning",
            message: `Perte de poids anormale sur ${weightLossRate.toFixed(2)}% des animaux`
        });
    }

    // ===> ALERTE MALADIE CONTAGIEUSE (Dernières 72h)
    const recentPrescriptions = await Prescription.find({
        campaignId: validCampaignId,
        createdAt: {
            $gte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        }
    });

    const medicationMap = {};
    recentPrescriptions.forEach(p => {
        const medName = p.medication?.name || "Médicament inconnu";
        medicationMap[medName] = (medicationMap[medName] || 0) + 1;
    });

    for (const medName in medicationMap) {
        if (medicationMap[medName] >= 5) {
            alerts.push({
                type: "disease",
                level: "danger",
                message: `Alerte sanitaire : ${medicationMap[medName]} prescriptions de ${medName} en 72h.`
            });
        }
    }

    return {
        campaignId,
        alerts,
        generatedAt: new Date()
    };
}
