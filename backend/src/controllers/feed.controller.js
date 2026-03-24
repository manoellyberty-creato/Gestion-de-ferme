// Contrôleur pour la gestion de l'alimentation
import feedService from '../services/feed.service.js';

class FeedController {
    /**
     * Récupère tous les produits d'alimentation
     */
    async getAllFeeds(req, res) {
        try {
            const filters = req.query;
            const feeds = await feedService.getAllFeeds(filters);

            res.json({
                success: true,
                data: feeds,
                count: feeds.length
            });
        } catch (error) {
            console.error('Error in getAllFeeds:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors de la récupération des produits d\'alimentation'
            });
        }
    }

    /**
     * Récupère un produit d'alimentation par son ID
     */
    async getFeedById(req, res) {
        try {
            const { id } = req.params;
            const feed = await feedService.getFeedById(id);

            res.json({
                success: true,
                data: feed
            });
        } catch (error) {
            console.error('Error in getFeedById:', error);
            const statusCode = error.message === 'Feed not found' ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Crée un nouveau produit d'alimentation
     */
    async createFeed(req, res) {
        try {
            const feedData = req.body;
            const feed = await feedService.createFeed(feedData);

            res.status(201).json({
                success: true,
                data: feed,
                message: 'Produit d\'alimentation créé avec succès'
            });
        } catch (error) {
            console.error('Error in createFeed:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Met à jour un produit d'alimentation
     */
    async updateFeed(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const feed = await feedService.updateFeed(id, updateData);

            res.json({
                success: true,
                data: feed,
                message: 'Produit d\'alimentation mis à jour avec succès'
            });
        } catch (error) {
            console.error('Error in updateFeed:', error);
            const statusCode = error.message === 'Feed not found' ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Met à jour le stock d'un produit
     */
    async updateStock(req, res) {
        try {
            const { id } = req.params;
            const { stock } = req.body;

            if (stock === undefined || stock < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Stock invalide'
                });
            }

            const feed = await feedService.updateStock(id, stock);

            res.json({
                success: true,
                data: feed,
                message: 'Stock mis à jour avec succès'
            });
        } catch (error) {
            console.error('Error in updateStock:', error);
            const statusCode = error.message === 'Feed not found' ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Désactive un produit d'alimentation
     */
    async deactivateFeed(req, res) {
        try {
            const { id } = req.params;
            const feed = await feedService.deactivateFeed(id);

            res.json({
                success: true,
                data: feed,
                message: 'Produit d\'alimentation désactivé avec succès'
            });
        } catch (error) {
            console.error('Error in deactivateFeed:', error);
            const statusCode = error.message === 'Feed not found' ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Supprime un produit d'alimentation
     */
    async deleteFeed(req, res) {
        try {
            const { id } = req.params;
            await feedService.deleteFeed(id);

            res.json({
                success: true,
                message: 'Produit d\'alimentation supprimé avec succès'
            });
        } catch (error) {
            console.error('Error in deleteFeed:', error);
            const statusCode = error.message === 'Feed not found' ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Récupère les produits en rupture de stock
     */
    async getLowStockFeeds(req, res) {
        try {
            const feeds = await feedService.getLowStockFeeds();

            res.json({
                success: true,
                data: feeds,
                count: feeds.length
            });
        } catch (error) {
            console.error('Error in getLowStockFeeds:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors de la récupération des produits en rupture de stock'
            });
        }
    }

    /**
     * Récupère les produits expirant bientôt
     */
    async getExpiringSoonFeeds(req, res) {
        try {
            const days = parseInt(req.query.days) || 30;
            const feeds = await feedService.getExpiringSoonFeeds(days);

            res.json({
                success: true,
                data: feeds,
                count: feeds.length
            });
        } catch (error) {
            console.error('Error in getExpiringSoonFeeds:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors de la récupération des produits expirant bientôt'
            });
        }
    }

    /**
     * Récupère les statistiques des produits d'alimentation
     */
    async getFeedStats(req, res) {
        try {
            const stats = await feedService.getFeedStats();

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error in getFeedStats:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors de la récupération des statistiques'
            });
        }
    }

    /**
     * Recherche des produits d'alimentation
     */
    async searchFeeds(req, res) {
        try {
            const { q: searchTerm } = req.query;

            if (!searchTerm) {
                return res.status(400).json({
                    success: false,
                    message: 'Terme de recherche requis'
                });
            }

            const feeds = await feedService.searchFeeds(searchTerm);

            res.json({
                success: true,
                data: feeds,
                count: feeds.length
            });
        } catch (error) {
            console.error('Error in searchFeeds:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors de la recherche'
            });
        }
    }
}

export default new FeedController();