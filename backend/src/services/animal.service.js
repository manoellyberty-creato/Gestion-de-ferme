// Service pour la gestion des animaux
import Animal from '../models/Animal.js';
import Campaign from '../models/Campaign.js';

class AnimalService {
    /**
     * Récupère tous les animaux avec filtres optionnels
     */
    async getAllAnimals(filters = {}) {
        try {
            const query = {};

            // Filtres optionnels
            if (filters.campaignId) {
                query.campaign = filters.campaignId;
            }
            if (filters.species) {
                query.species = filters.species;
            }
            if (filters.status) {
                query.status = filters.status;
            }
            if (filters.healthStatus) {
                query.healthStatus = filters.healthStatus;
            }

            const animals = await Animal.find(query)
                .populate('campaignId', 'name type startDate endDate')
                .sort({ createdAt: -1 });

            return animals;
        } catch (error) {
            console.error('Error getting all animals:', error);
            throw error;
        }
    }

    /**
     * Récupère un animal par son ID
     */
    async getAnimalById(id) {
        try {
            const animal = await Animal.findById(id)
                .populate('campaign', 'name type startDate endDate status');

            if (!animal) {
                throw new Error('Animal not found');
            }

            return animal;
        } catch (error) {
            console.error('Error getting animal by ID:', error);
            throw error;
        }
    }

    /**
     * Récupère un animal par son tagNumber
     */
    async getAnimalByTagNumber(tagNumber) {
        try {
            const animal = await Animal.findOne({ tagNumber })
                .populate('campaign', 'name type startDate endDate status');

            if (!animal) {
                throw new Error('Animal not found');
            }

            return animal;
        } catch (error) {
            console.error('Error getting animal by tag number:', error);
            throw error;
        }
    }

    /**
     * Crée un nouvel animal
     */
    async createAnimal(animalData) {
        try {
            // Vérifier que la campagne existe
            const campaign = await Campaign.findById(animalData.campaign);
            if (!campaign) {
                throw new Error('Campaign not found');
            }

            // Vérifier que le tagNumber est unique
            const existingAnimal = await Animal.findOne({ tagNumber: animalData.tagNumber });
            if (existingAnimal) {
                throw new Error('Tag number already exists');
            }

            const animal = new Animal(animalData);
            await animal.save();

            return await this.getAnimalById(animal._id);
        } catch (error) {
            console.error('Error creating animal:', error);
            throw error;
        }
    }

    /**
     * Met à jour un animal
     */
    async updateAnimal(id, updateData) {
        try {
            // Vérifier que l'animal existe
            const animal = await Animal.findById(id);
            if (!animal) {
                throw new Error('Animal not found');
            }

            // Si le tagNumber est modifié, vérifier l'unicité
            if (updateData.tagNumber && updateData.tagNumber !== animal.tagNumber) {
                const existingAnimal = await Animal.findOne({ tagNumber: updateData.tagNumber });
                if (existingAnimal) {
                    throw new Error('Tag number already exists');
                }
            }

            const updatedAnimal = await Animal.findByIdAndUpdate(
                id,
                { ...updateData, updatedAt: new Date() },
                { new: true }
            ).populate('campaign', 'name type startDate endDate status');

            return updatedAnimal;
        } catch (error) {
            console.error('Error updating animal:', error);
            throw error;
        }
    }

    /**
     * Supprime un animal
     */
    async deleteAnimal(id) {
        try {
            const animal = await Animal.findByIdAndDelete(id);

            if (!animal) {
                throw new Error('Animal not found');
            }

            return animal;
        } catch (error) {
            console.error('Error deleting animal:', error);
            throw error;
        }
    }

    /**
     * Met à jour le poids d'un animal
     */
    async updateAnimalWeight(tagNumber, weight) {
        try {
            const animal = await Animal.findOneAndUpdate(
                { tagNumber },
                {
                    weight: weight,
                    updatedAt: new Date()
                },
                { new: true }
            ).populate('campaign', 'name type');

            if (!animal) {
                throw new Error('Animal not found');
            }

            return animal;
        } catch (error) {
            console.error('Error updating animal weight:', error);
            throw error;
        }
    }

    /**
     * Met à jour le statut d'un animal
     */
    async updateAnimalStatus(tagNumber, status, additionalData = {}) {
        try {
            const updateData = {
                status: status,
                updatedAt: new Date()
            };

            // Ajouter des données spécifiques selon le statut
            if (status === 'sold' && additionalData.salePrice) {
                updateData.salePrice = additionalData.salePrice;
                updateData.saleDate = additionalData.saleDate || new Date();
            }

            const animal = await Animal.findOneAndUpdate(
                { tagNumber },
                updateData,
                { new: true }
            ).populate('campaign', 'name type');

            if (!animal) {
                throw new Error('Animal not found');
            }

            return animal;
        } catch (error) {
            console.error('Error updating animal status:', error);
            throw error;
        }
    }

    /**
     * Récupère les statistiques des animaux pour une campagne
     */
    async getCampaignAnimalStats(campaignId) {
        try {
            const stats = await Animal.aggregate([
                { $match: { campaign: campaignId } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        bySpecies: {
                            $push: {
                                species: '$species',
                                status: '$status',
                                healthStatus: '$healthStatus'
                            }
                        },
                        averageWeight: { $avg: '$weight' },
                        totalPurchasePrice: { $sum: '$purchasePrice' },
                        totalSalePrice: { $sum: '$salePrice' }
                    }
                }
            ]);

            if (stats.length === 0) {
                return {
                    total: 0,
                    bySpecies: [],
                    averageWeight: 0,
                    totalPurchasePrice: 0,
                    totalSalePrice: 0
                };
            }

            return stats[0];
        } catch (error) {
            console.error('Error getting campaign animal stats:', error);
            throw error;
        }
    }
}

export default new AnimalService();