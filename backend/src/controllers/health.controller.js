// Contrôleur pour la gestion de la santé des animaux
import healthService from '../services/health.service.js';

class HealthController {
    // === GESTION DES PRODUITS DE SANTÉ ===

    // Créer un produit de santé
    async createHealthProduct(req, res, next) {
        try {
            const product = await healthService.createHealthProduct(req.body);
            res.status(201).json({
                success: true,
                message: 'Produit de santé créé avec succès',
                data: product
            });
        } catch (error) {
            next(error);
        }
    }

    // Récupérer tous les produits de santé
    async getAllHealthProducts(req, res, next) {
        try {
            const filters = req.query;
            const products = await healthService.getAllHealthProducts(filters);
            res.json({
                success: true,
                data: products
            });
        } catch (error) {
            next(error);
        }
    }

    // Récupérer un produit par ID
    async getHealthProductById(req, res, next) {
        try {
            const product = await healthService.getHealthProductById(req.params.id);
            res.json({
                success: true,
                data: product
            });
        } catch (error) {
            next(error);
        }
    }

    // Mettre à jour un produit de santé
    async updateHealthProduct(req, res, next) {
        try {
            const product = await healthService.updateHealthProduct(req.params.id, req.body);
            res.json({
                success: true,
                message: 'Produit de santé mis à jour avec succès',
                data: product
            });
        } catch (error) {
            next(error);
        }
    }

    // Désactiver un produit de santé
    async deactivateHealthProduct(req, res, next) {
        try {
            const product = await healthService.deactivateHealthProduct(req.params.id);
            res.json({
                success: true,
                message: 'Produit de santé désactivé avec succès',
                data: product
            });
        } catch (error) {
            next(error);
        }
    }

    // Supprimer un produit de santé
    async deleteHealthProduct(req, res, next) {
        try {
            const product = await healthService.deleteHealthProduct(req.params.id);
            res.json({
                success: true,
                message: 'Produit de santé supprimé avec succès',
                data: product
            });
        } catch (error) {
            next(error);
        }
    }

    // === GESTION DES PRESCRIPTIONS ===

    // Créer une prescription
    async createPrescription(req, res, next) {
        try {
            const prescription = await healthService.createPrescription(req.body);
            res.status(201).json({
                success: true,
                message: 'Prescription créée avec succès',
                data: prescription
            });
        } catch (error) { next(error) }
    }

    // Récupérer les prescriptions d'un animal
    async getPrescriptionsByAnimal(req, res, next) {
        try {
            const { status } = req.query;
            const prescriptions = await healthService.getPrescriptionsByAnimal(req.params.animalId, status);
            res.json({
                success: true,
                data: prescriptions
            });
        } catch (error) {
            next(error);
        }
    }

    // Récupérer les prescriptions d'une campagne
    async getPrescriptionsByCampaign(req, res, next) {
        try {
            const { status } = req.query;
            const prescriptions = await healthService.getPrescriptionsByCampaign(req.params.campaignId, status);
            res.json({
                success: true,
                data: prescriptions
            });
        } catch (error) {
            next(error);
        }
    }

    // Récupérer toutes les prescriptions
    async getAllPrescriptions(req, res, next) {
        try {
            const filters = req.query;
            const prescriptions = await healthService.getAllPrescriptions(filters);
            res.json({
                success: true,
                data: prescriptions
            });
        } catch (error) {
            next(error);
        }
    }

    // Récupérer une prescription par ID
    async getPrescriptionById(req, res, next) {
        try {
            const prescription = await healthService.getPrescriptionById(req.params.id);
            res.json({
                success: true,
                data: prescription
            });
        } catch (error) {
            next(error);
        }
    }

    // Mettre à jour une prescription
    async updatePrescription(req, res, next) {
        try {
            const prescription = await healthService.updatePrescription(req.params.id, req.body);
            res.json({
                success: true,
                message: 'Prescription mise à jour avec succès',
                data: prescription
            });
        } catch (error) {
            next(error);
        }
    }

    // Supprimer une prescription
    async deletePrescription(req, res, next) {
        try {
            await healthService.deletePrescription(req.params.id);
            res.json({
                success: true,
                message: 'Prescription supprimée avec succès'
            });
        } catch (error) {
            next(error);
        }
    }

    // Mettre à jour le statut d'une prescription
    async updatePrescriptionStatus(req, res, next) {
        try {
            const { status } = req.body;
            const prescription = await healthService.updatePrescriptionStatus(
                req.params.id,
                status,
                req.user.id
            );
            res.json({
                success: true,
                message: 'Statut de la prescription mis à jour avec succès',
                data: prescription
            });
        } catch (error) {
            next(error);
        }
    }

    // Ajouter une administration de médicament
    async addAdministration(req, res, next) {
        try {
            const administrationData = {
                ...req.body,
                administeredBy: req.user.id
            };
            const prescription = await healthService.addAdministration(
                req.params.id,
                administrationData
            );
            res.json({
                success: true,
                message: 'Administration ajoutée avec succès',
                data: prescription
            });
        } catch (error) {
            next(error);
        }
    }

    // === STATISTIQUES ET ALERTES ===

    // Obtenir les statistiques de santé
    async getHealthStatistics(req, res, next) {
        try {
            const { campaignId, startDate, endDate } = req.query;
            const stats = await healthService.getHealthStatistics(campaignId, startDate, endDate);
            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }

    // Obtenir les produits expirés
    async getExpiredProducts(req, res, next) {
        try {
            const products = await healthService.getExpiredProducts();
            res.json({
                success: true,
                data: products
            });
        } catch (error) {
            next(error);
        }
    }

    // Obtenir les produits proches de l'expiration
    async getProductsNearExpiration(req, res, next) {
        try {
            const { days = 30 } = req.query;
            const products = await healthService.getProductsNearExpiration(parseInt(days));
            res.json({
                success: true,
                data: products
            });
        } catch (error) {
            next(error);
        }
    }

    // Obtenir les alertes de santé
    async getHealthAlerts(req, res, next) {
        try {
            const alerts = [];

            // Produits expirés
            const expiredProducts = await healthService.getExpiredProducts();
            if (expiredProducts.length > 0) {
                alerts.push({
                    type: 'expired_products',
                    severity: 'high',
                    message: `${expiredProducts.length} produit(s) de santé expiré(s)`,
                    count: expiredProducts.length,
                    data: expiredProducts
                });
            }

            // Produits proches de l'expiration
            const nearExpirationProducts = await healthService.getProductsNearExpiration(7);
            if (nearExpirationProducts.length > 0) {
                alerts.push({
                    type: 'near_expiration',
                    severity: 'medium',
                    message: `${nearExpirationProducts.length} produit(s) de santé expirent dans moins de 7 jours`,
                    count: nearExpirationProducts.length,
                    data: nearExpirationProducts
                });
            }

            res.json({
                success: true,
                data: alerts
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new HealthController();