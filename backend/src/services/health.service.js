// Service pour la gestion de la santé des animaux
import Health from '../models/Health.js';
import Prescription from '../models/Prescription.js';
import Transaction from '../models/Transaction.js';
import Animal from '../models/Animal.js';

class HealthService {
    // === GESTION DES PRODUITS DE SANTÉ ===

    // Créer un nouveau produit de santé
    async createHealthProduct(productData) {
        try {
            const product = new Health(productData);
            await product.save();
            return product;
        } catch (error) {
            throw new Error(`Erreur lors de la création du produit de santé: ${error.message}`);
        }
    }

    // Récupérer tous les produits de santé actifs
    async getAllHealthProducts(filters = {}) {
        try {
            const query = { isActive: true, ...filters };
            return await Health.find(query).sort({ name: 1 });
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des produits: ${error.message}`);
        }
    }

    // Récupérer un produit par ID
    async getHealthProductById(id) {
        try {
            const product = await Health.findById(id);
            if (!product) {
                throw new Error('Produit de santé non trouvé');
            }
            return product;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération du produit: ${error.message}`);
        }
    }

    // Mettre à jour un produit de santé
    async updateHealthProduct(id, updateData) {
        try {
            const product = await Health.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
            if (!product) {
                throw new Error('Produit de santé non trouvé');
            }
            return product;
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour du produit: ${error.message}`);
        }
    }

    // Désactiver un produit de santé
    async deactivateHealthProduct(id) {
        try {
            const product = await Health.findByIdAndUpdate(
                id,
                { isActive: false },
                { new: true }
            );
            if (!product) {
                throw new Error('Produit de santé non trouvé');
            }
            return product;
        } catch (error) {
            throw new Error(`Erreur lors de la désactivation du produit: ${error.message}`);
        }
    }

    // Supprimer définitivement un produit de santé
    async deleteHealthProduct(id) {
        try {
            const product = await Health.findByIdAndDelete(id);
            if (!product) {
                throw new Error('Produit de santé non trouvé');
            }
            return product;
        } catch (error) {
            throw new Error(`Erreur lors de la suppression du produit: ${error.message}`);
        }
    }

    // === GESTION DES PRESCRIPTIONS ===

    // Créer une nouvelle prescription
    async createPrescription(prescriptionData) {
        try {
            // Calculer le coût total
            let totalCost = 0;
            for (const item of prescriptionData.prescribedProducts) {
                const product = await Health.findById(item.product);
                if (!product) {
                    throw new Error(`Produit ${item.product} non trouvé`);
                }
                item.cost = product.unitPrice * item.quantity;
                totalCost += item.cost;
            }

            prescriptionData.totalCost = totalCost;

            const prescription = new Prescription(prescriptionData);
            await prescription.save();

            // Créer une transaction pour les frais médicaux
            await Transaction.create({
                type: 'expense',
                category: 'health',
                amount: totalCost,
                description: `Traitement médical pour l'animal ${prescription.animal}`,
                campaign: prescription.campaign,
                recordedBy: prescription.veterinarian,
                date: prescription.prescriptionDate,
            });

            return prescription;
        } catch (error) {
            throw new Error(`Erreur lors de la création de la prescription: ${error.message}`);
        }
    }

    // Récupérer les prescriptions d'un animal
    async getPrescriptionsByAnimal(animalId, status = null) {
        try {
            const query = { animal: animalId };
            if (status) query.status = status;

            return await Prescription.find(query)
                .populate('animal', 'name tagNumber species')
                .populate('campaign', 'name startDate endDate')
                .populate('veterinarian', 'name email')
                .populate('prescribedProducts.product', 'name type dosage unitPrice')
                .sort({ prescriptionDate: -1 });
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des prescriptions: ${error.message}`);
        }
    }

    // Récupérer les prescriptions d'une campagne
    async getPrescriptionsByCampaign(campaignId, status = null) {
        try {
            const query = { campaign: campaignId };
            if (status) query.status = status;

            return await Prescription.find(query)
                .populate('animal', 'name tagNumber species')
                .populate('veterinarian', 'name email')
                .populate('prescribedProducts.product', 'name type')
                .sort({ prescriptionDate: -1 });
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des prescriptions: ${error.message}`);
        }
    }

    // Mettre à jour le statut d'une prescription
    async updatePrescriptionStatus(id, status, userId) {
        try {
            const prescription = await Prescription.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            ).populate('animal campaign veterinarian');

            if (!prescription) {
                throw new Error('Prescription non trouvée');
            }

            return prescription;
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour du statut: ${error.message}`);
        }
    }

    // Récupérer toutes les prescriptions
    async getAllPrescriptions(filters = {}) {
        try {
            const query = {};
            if (filters.status) query.status = filters.status;
            if (filters.animal) query.animal = filters.animal;
            if (filters.campaign) query.campaign = filters.campaign;

            return await Prescription.find(query)
                .populate('animal', 'name tagNumber species')
                .populate('campaign', 'name startDate endDate')
                .populate('veterinarian', 'name email')
                .populate('prescribedProducts.product', 'name type dosage unitPrice')
                .sort({ prescriptionDate: -1 });
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des prescriptions: ${error.message}`);
        }
    }

    // Récupérer une prescription par ID
    async getPrescriptionById(id) {
        try {
            const prescription = await Prescription.findById(id)
                .populate('animal', 'name tagNumber species')
                .populate('campaign', 'name startDate endDate')
                .populate('veterinarian', 'name email')
                .populate('prescribedProducts.product', 'name type dosage unitPrice');
            if (!prescription) {
                throw new Error('Prescription non trouvée');
            }
            return prescription;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération de la prescription: ${error.message}`);
        }
    }

    // Mettre à jour une prescription
    async updatePrescription(id, updateData) {
        try {
            const prescription = await Prescription.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            )
            .populate('animal campaign veterinarian')
            .populate('prescribedProducts.product', 'name type dosage unitPrice');

            if (!prescription) {
                throw new Error('Prescription non trouvée');
            }
            return prescription;
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour de la prescription: ${error.message}`);
        }
    }

    // Supprimer une prescription
    async deletePrescription(id) {
        try {
            const deleted = await Prescription.findByIdAndDelete(id);
            if (!deleted) {
                throw new Error('Prescription non trouvée');
            }
            return deleted;
        } catch (error) {
            throw new Error(`Erreur lors de la suppression de la prescription: ${error.message}`);
        }
    }

    // Ajouter une administration de médicament
    async addAdministration(prescriptionId, administrationData) {
        try {
            const prescription = await Prescription.findById(prescriptionId);
            if (!prescription) {
                throw new Error('Prescription non trouvée');
            }

            prescription.administrations.push(administrationData);
            await prescription.save();

            return prescription;
        } catch (error) {
            throw new Error(`Erreur lors de l'ajout de l'administration: ${error.message}`);
        }
    }

    // === STATISTIQUES ET RAPPORTS ===

    // Obtenir les statistiques de santé pour une campagne
    async getHealthStatistics(campaignId, startDate = null, endDate = null) {
        try {
            const matchConditions = {};
            if (campaignId) {
                matchConditions.campaign = campaignId;
            }
            if (startDate || endDate) {
                matchConditions.prescriptionDate = {};
                if (startDate) matchConditions.prescriptionDate.$gte = startDate;
                if (endDate) matchConditions.prescriptionDate.$lte = endDate;
            }

            const stats = await Prescription.aggregate([
                { $match: matchConditions },
                {
                    $group: {
                        _id: null,
                        totalPrescriptions: { $sum: 1 },
                        totalCost: { $sum: '$totalCost' },
                        activePrescriptions: {
                            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                        },
                        completedPrescriptions: {
                            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                        },
                    }
                }
            ]);

            return stats.length > 0 ? stats[0] : {
                totalPrescriptions: 0,
                totalCost: 0,
                activePrescriptions: 0,
                completedPrescriptions: 0,
            };
        } catch (error) {
            throw new Error(`Erreur lors du calcul des statistiques: ${error.message}`);
        }
    }

    // Obtenir les produits de santé expirés
    async getExpiredProducts() {
        try {
            return await Health.find({
                expirationDate: { $lt: new Date() },
                isActive: true,
            }).sort({ expirationDate: 1 });
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des produits expirés: ${error.message}`);
        }
    }

    // Obtenir les produits de santé proches de l'expiration
    async getProductsNearExpiration(days = 30) {
        try {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + days);

            return await Health.find({
                expirationDate: { $lte: futureDate, $gte: new Date() },
                isActive: true,
            }).sort({ expirationDate: 1 });
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des produits proches de l'expiration: ${error.message}`);
        }
    }
}

export default new HealthService();