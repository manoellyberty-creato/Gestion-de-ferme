// Service pour la gestion des campagnes
import Campaign from '../models/Campaign.js';
import Animal from '../models/Animal.js';
import User from '../models/User.js';

class CampaignService {
    /**
     * Récupère toutes les campagnes avec filtres optionnels
     */
    async getAllCampaigns(filters = {}) {
        try {
            const query = {};

            // Filtres optionnels
            if (filters.status) {
                query.status = filters.status;
            }
            if (filters.type) {
                query.type = filters.type;
            }
            if (filters.manager) {
                query.manager = filters.manager;
            }

            const campaigns = await Campaign.find(query)
                .populate('manager', 'name email')
                .sort({ createdAt: -1 });

            return campaigns;
        } catch (error) {
            console.error('Error getting all campaigns:', error);
            throw error;
        }
    }

    /**
     * Récupère une campagne par son ID
     */
    async getCampaignById(id) {
        try {
            const campaign = await Campaign.findById(id)
                .populate('manager', 'name email role');

            if (!campaign) {
                throw new Error('Campaign not found');
            }

            return campaign;
        } catch (error) {
            console.error('Error getting campaign by ID:', error);
            throw error;
        }
    }

    /**
     * Crée une nouvelle campagne
     */
    async createCampaign(campaignData) {
        try {
            // Vérifier que le manager existe
            const manager = await User.findById(campaignData.manager);
            if (!manager) {
                throw new Error('Manager not found');
            }

            const campaign = new Campaign(campaignData);
            await campaign.save();

            return await this.getCampaignById(campaign._id);
        } catch (error) {
            console.error('Error creating campaign:', error);
            throw error;
        }
    }

    /**
     * Met à jour une campagne
     */
    async updateCampaign(id, updateData) {
        try {
            const campaign = await Campaign.findById(id);
            if (!campaign) {
                throw new Error('Campaign not found');
            }

            // Vérifications selon le statut
            if (updateData.status) {
                const validStatuses = ['planning', 'active', 'completed', 'cancelled'];
                if (!validStatuses.includes(updateData.status)) {
                    throw new Error('Invalid status');
                }

                // Si on clôture la campagne, mettre à jour la date de fin
                if (updateData.status === 'completed' && !campaign.endDate) {
                    updateData.endDate = new Date();
                }
            }

            const updatedCampaign = await Campaign.findByIdAndUpdate(
                id,
                { ...updateData, updatedAt: new Date() },
                { new: true }
            ).populate('manager', 'name email role');

            return updatedCampaign;
        } catch (error) {
            console.error('Error updating campaign:', error);
            throw error;
        }
    }

    /**
     * Clôture une campagne
     */
    async closeCampaign(id) {
        try {
            const campaign = await Campaign.findById(id);
            if (!campaign) {
                throw new Error('Campaign not found');
            }

            if (campaign.status === 'completed') {
                throw new Error('Campaign is already completed');
            }

            const updatedCampaign = await Campaign.findByIdAndUpdate(
                id,
                {
                    status: 'completed',
                    endDate: new Date(),
                    updatedAt: new Date()
                },
                { new: true }
            ).populate('manager', 'name email role');

            return updatedCampaign;
        } catch (error) {
            console.error('Error closing campaign:', error);
            throw error;
        }
    }

    /**
     * Supprime une campagne
     */
    async deleteCampaign(id) {
        try {
            // Vérifier qu'il n'y a pas d'animaux associés
            const animalCount = await Animal.countDocuments({ campaign: id });
            if (animalCount > 0) {
                throw new Error('Cannot delete campaign with associated animals');
            }

            const campaign = await Campaign.findByIdAndDelete(id);

            if (!campaign) {
                throw new Error('Campaign not found');
            }

            return campaign;
        } catch (error) {
            console.error('Error deleting campaign:', error);
            throw error;
        }
    }

    /**
     * Récupère les statistiques d'une campagne
     */
    async getCampaignStats(id) {
        try {
            const campaign = await Campaign.findById(id);
            if (!campaign) {
                throw new Error('Campaign not found');
            }

            // Statistiques des animaux
            const animalStats = await Animal.aggregate([
                { $match: { campaign: id } },
                {
                    $group: {
                        _id: null,
                        totalAnimals: { $sum: 1 },
                        byStatus: {
                            $push: '$status'
                        },
                        bySpecies: {
                            $push: '$species'
                        },
                        totalPurchaseCost: { $sum: '$purchasePrice' },
                        totalSaleRevenue: { $sum: '$salePrice' },
                        averageWeight: { $avg: '$weight' }
                    }
                }
            ]);

            const stats = animalStats.length > 0 ? animalStats[0] : {
                totalAnimals: 0,
                byStatus: [],
                bySpecies: [],
                totalPurchaseCost: 0,
                totalSaleRevenue: 0,
                averageWeight: 0
            };

            // Calculer le profit
            stats.profit = stats.totalSaleRevenue - stats.totalPurchaseCost;

            // Compter par statut
            stats.statusCount = {};
            stats.byStatus.forEach(status => {
                stats.statusCount[status] = (stats.statusCount[status] || 0) + 1;
            });

            // Compter par espèce
            stats.speciesCount = {};
            stats.bySpecies.forEach(species => {
                stats.speciesCount[species] = (stats.speciesCount[species] || 0) + 1;
            });

            return {
                campaign: campaign,
                stats: stats
            };
        } catch (error) {
            console.error('Error getting campaign stats:', error);
            throw error;
        }
    }

    /**
     * Récupère les campagnes actives
     */
    async getActiveCampaigns() {
        try {
            const campaigns = await Campaign.find({ status: 'active' })
                .populate('manager', 'name email')
                .sort({ startDate: -1 });

            return campaigns;
        } catch (error) {
            console.error('Error getting active campaigns:', error);
            throw error;
        }
    }
}

export default new CampaignService();