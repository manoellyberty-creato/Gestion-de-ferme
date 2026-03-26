// Service pour la gestion de l'alimentation
import Feed from '../models/Feed.js';

class FeedService {
    /**
     * Récupère tous les produits d'alimentation avec filtres
     */
    async getAllFeeds(filters = {}) {
        try {
            const query = {};

            // Filtres optionnels
            if (filters.type) {
                query.type = filters.type;
            }
            if (filters.isActive !== undefined) {
                query.isActive = filters.isActive;
            }
            if (filters.supplier) {
                query.supplier = filters.supplier;
            }

            const feeds = await Feed.find(query)
                .sort({ createdAt: -1 });

            return feeds;
        } catch (error) {
            console.error('Error getting all feeds:', error);
            throw error;
        }
    }

    /**
     * Récupère un produit d'alimentation par son ID
     */
    async getFeedById(id) {
        try {
            const feed = await Feed.findById(id);

            if (!feed) {
                throw new Error('Feed not found');
            }

            return feed;
        } catch (error) {
            console.error('Error getting feed by ID:', error);
            throw error;
        }
    }

    /**
     * Crée un nouveau produit d'alimentation
     */
    async createFeed(feedData) {
        try {
            const feed = new Feed(feedData);
            await feed.save();

            return await this.getFeedById(feed._id);
        } catch (error) {
            console.error('Error creating feed:', error);
            throw error;
        }
    }

    /**
     * Met à jour un produit d'alimentation
     */
    async updateFeed(id, updateData) {
        try {
            const feed = await Feed.findById(id);
            if (!feed) {
                throw new Error('Feed not found');
            }

            const updatedFeed = await Feed.findByIdAndUpdate(
                id,
                { ...updateData, updatedAt: new Date() },
                { new: true }
            );

            return updatedFeed;
        } catch (error) {
            console.error('Error updating feed:', error);
            throw error;
        }
    }

    /**
     * Met à jour le stock d'un produit
     */
    async updateStock(id, newStock) {
        try {
            if (newStock < 0) {
                throw new Error('Stock cannot be negative');
            }

            const feed = await Feed.findByIdAndUpdate(
                id,
                {
                    stock: newStock,
                    updatedAt: new Date()
                },
                { new: true }
            );

            if (!feed) {
                throw new Error('Feed not found');
            }

            return feed;
        } catch (error) {
            console.error('Error updating stock:', error);
            throw error;
        }
    }

    /**
     * Désactive un produit d'alimentation
     */
    async deactivateFeed(id) {
        try {
            const feed = await Feed.findByIdAndUpdate(
                id,
                {
                    isActive: false,
                    updatedAt: new Date()
                },
                { new: true }
            );

            if (!feed) {
                throw new Error('Feed not found');
            }

            return feed;
        } catch (error) {
            console.error('Error deactivating feed:', error);
            throw error;
        }
    }

    /**
     * Supprime un produit d'alimentation
     */
    async deleteFeed(id) {
        try {
            const feed = await Feed.findByIdAndDelete(id);

            if (!feed) {
                throw new Error('Feed not found');
            }

            return feed;
        } catch (error) {
            console.error('Error deleting feed:', error);
            throw error;
        }
    }

    /**
     * Récupère les produits en rupture de stock
     */
    async getLowStockFeeds() {
        try {
            const feeds = await Feed.find({
                $expr: { $lte: ['$stock', '$minStock'] },
                isActive: true
            }).sort({ stock: 1 });

            return feeds;
        } catch (error) {
            console.error('Error getting low stock feeds:', error);
            throw error;
        }
    }

    /**
     * Récupère les produits expirant bientôt
     */
    async getExpiringSoonFeeds(days = 30) {
        try {
            const today = new Date();
            const futureDate = new Date();
            futureDate.setDate(today.getDate() + days);

            const feeds = await Feed.find({
                expirationDate: {
                    $gte: today,
                    $lte: futureDate
                },
                isActive: true
            }).sort({ expirationDate: 1 });

            return feeds;
        } catch (error) {
            console.error('Error getting expiring soon feeds:', error);
            throw error;
        }
    }

    /**
     * Récupère les statistiques des produits d'alimentation
     */
    async getFeedStats() {
        try {
            const stats = await Feed.aggregate([
                { $match: { isActive: true } },
                {
                    $group: {
                        _id: null,
                        totalProducts: { $sum: 1 },
                        totalValue: {
                            $sum: { $multiply: ['$stock', '$unitPrice'] }
                        },
                        byType: {
                            $push: {
                                type: '$type',
                                stock: '$stock',
                                value: { $multiply: ['$stock', '$unitPrice'] }
                            }
                        },
                        lowStockCount: {
                            $sum: {
                                $cond: [
                                    { $lte: ['$stock', '$minStock'] },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                }
            ]);

            if (stats.length === 0) {
                return {
                    totalProducts: 0,
                    totalValue: 0,
                    byType: [],
                    lowStockCount: 0
                };
            }

            return stats[0];
        } catch (error) {
            console.error('Error getting feed stats:', error);
            throw error;
        }
    }

    /**
     * Recherche des produits d'alimentation
     */
    async searchFeeds(searchTerm) {
        try {
            const feeds = await Feed.find({
                isActive: true,
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { description: { $regex: searchTerm, $options: 'i' } },
                    { supplier: { $regex: searchTerm, $options: 'i' } }
                ]
            }).sort({ name: 1 });

            return feeds;
        } catch (error) {
            console.error('Error searching feeds:', error);
            throw error;
        }
    }
}

export default new FeedService();