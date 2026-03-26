// Contrôleur pour la gestion des animaux
import animalService from '../services/animal.service.js';
import qrCodeService from '../services/qrCode.service.js';

class AnimalController {
    /**
     * Récupère tous les animaux avec filtres optionnels
     */
    async getAllAnimals(req, res) {
        try {
            const filters = req.query;
            const animals = await animalService.getAllAnimals(filters);

            res.json({
                success: true,
                data: animals,
                count: animals.length
            });
        } catch (error) {
            console.error('Error in getAllAnimals:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors de la récupération des animaux'
            });
        }
    }

    /**
     * Récupère un animal par son ID
     */
    async getAnimalById(req, res) {
        try {
            const { id } = req.params;
            const animal = await animalService.getAnimalById(id);

            res.json({
                success: true,
                data: animal
            });
        } catch (error) {
            console.error('Error in getAnimalById:', error);
            const statusCode = error.message === 'Animal not found' ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Crée un nouvel animal
     */
    async createAnimal(req, res) {
        try {
            const animalData = req.body;
            const animal = await animalService.createAnimal(animalData);

            res.status(201).json({
                success: true,
                data: animal,
                message: 'Animal créé avec succès'
            });
        } catch (error) {
            console.error('Error in createAnimal:', error);
            const statusCode = error.message.includes('already exists') || error.message.includes('not found') ? 400 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Met à jour un animal
     */
    async updateAnimal(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const animal = await animalService.updateAnimal(id, updateData);

            res.json({
                success: true,
                data: animal,
                message: 'Animal mis à jour avec succès'
            });
        } catch (error) {
            console.error('Error in updateAnimal:', error);
            const statusCode = error.message === 'Animal not found' ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Supprime un animal
     */
    async deleteAnimal(req, res) {
        try {
            const { id } = req.params;
            const animal = await animalService.deleteAnimal(id);

            res.json({
                success: true,
                data: animal,
                message: 'Animal supprimé avec succès'
            });
        } catch (error) {
            console.error('Error in deleteAnimal:', error);
            const statusCode = error.message === 'Animal not found' ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Génère un QR code pour un animal
     */
    async generateAnimalQRCode(req, res) {
        try {
            const { id } = req.params;
            const animal = await animalService.getAnimalById(id);

            const qrCodeData = {
                tagNumber: animal.tagNumber,
                name: animal.name,
                species: animal.species,
                campaign: animal.campaign.name
            };

            const qrCode = await qrCodeService.generateQRCode(qrCodeData);

            res.json({
                success: true,
                data: {
                    animal: animal,
                    qrCode: qrCode
                }
            });
        } catch (error) {
            console.error('Error in generateAnimalQRCode:', error);
            const statusCode = error.message === 'Animal not found' ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Scanne un QR code d'animal (récupère les infos via tagNumber)
     */
    async scanAnimalQRCode(req, res) {
        try {
            const { tagNumber } = req.params;

            const animal = await animalService.getAnimalByTagNumber(tagNumber);

            res.json({
                success: true,
                data: animal
            });
        } catch (error) {
            console.error('Error in scanAnimalQRCode:', error);
            const statusCode = error.message === 'Animal not found' ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Met à jour le poids d'un animal via QR code
     */
    async updateAnimalWeight(req, res) {
        try {
            const { tagNumber } = req.params;
            const { weight } = req.body;

            if (!weight || weight <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Poids invalide'
                });
            }

            const animal = await animalService.updateAnimalWeight(tagNumber, weight);

            res.json({
                success: true,
                data: animal,
                message: 'Poids mis à jour avec succès'
            });
        } catch (error) {
            console.error('Error in updateAnimalWeight:', error);
            const statusCode = error.message === 'Animal not found' ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Met à jour le statut d'un animal via QR code
     */
    async updateAnimalStatus(req, res) {
        try {
            const { tagNumber } = req.params;
            const { status, salePrice, saleDate } = req.body;

            const validStatuses = ['active', 'sold', 'dead', 'culled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Statut invalide'
                });
            }

            const animal = await animalService.updateAnimalStatus(tagNumber, status, { salePrice, saleDate });

            res.json({
                success: true,
                data: animal,
                message: 'Statut mis à jour avec succès'
            });
        } catch (error) {
            console.error('Error in updateAnimalStatus:', error);
            const statusCode = error.message === 'Animal not found' ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Récupère l'historique d'un animal
     */
    async getAnimalHistory(req, res) {
        try {
            const { tagNumber } = req.params;
            const animal = await animalService.getAnimalByTagNumber(tagNumber);

            // Pour l'instant, on retourne juste les infos de base
            // Plus tard, on pourra ajouter un système d'historique complet
            const history = {
                animal: animal,
                lastUpdated: animal.updatedAt,
                statusHistory: [animal.status], // À développer
                weightHistory: animal.weight ? [animal.weight] : [] // À développer
            };

            res.json({
                success: true,
                data: history
            });
        } catch (error) {
            console.error('Error in getAnimalHistory:', error);
            const statusCode = error.message === 'Animal not found' ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Récupère les statistiques des animaux pour une campagne
     */
    async getCampaignAnimalStats(req, res) {
        try {
            const { campaignId } = req.params;
            const stats = await animalService.getCampaignAnimalStats(campaignId);

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error in getCampaignAnimalStats:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors de la récupération des statistiques'
            });
        }
    }
}

export default new AnimalController();
