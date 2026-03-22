import Animal from "../models/Animal.js";
import Prescription from "../models/Prescription.js";

// ===> SERVICE : DETECTION ALERTES
export async function detectAlerts(campaignId) {
    const alerts = [];
    
    // === Récupération des animaux
    const animals = await Animal.find({ campaignId });
    const totalAnimals = animals.length;
    if (totalAnimals === 0) {
        return { alerts };
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
        if (animal.growthHistory.length >= 2) {
            const last = animal.growthHistory.at(-1).weight;
            const previous = animal.growthHistory.at(-2).weight;
            const lossPercent = ((previous - last) / previous) * 100;
            if (lossPercent >= 15) {
                weightLossCount++;
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

    // ===> ALERTE MALADIE CONTAGIEUSE
    const recentPrescriptions = await Prescription.find({
        campaignId,
        createdAt: {
            $gte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)        
        }
    });
    const diseaseMap = {};
    recentPrescriptions.forEach(p => {
        const key = p.medication.name;
        diseaseMap[key] = (diseaseMap[key] || 0) + 1;
    });

    for (const disease in diseaseMap) {
        if (diseaseMap[disease] >= 5) {
            alerts.push({
                type: "disease",
                level: "danger",
                message: `Suspicion de maladie contagieuse : ${disease}`
            });
        }
    }

    // ===> RESULTAT
    return {
        campaignId,
        alerts
    };
}