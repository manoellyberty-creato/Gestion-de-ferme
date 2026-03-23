// Contrôleur pour le système d'alertes
import alertService from '../services/alert.service.js';

class AlertController {
    /**
     * Récupère toutes les alertes
     */
    async getAllAlerts(req, res) {
        try {
            const filters = req.query;
            const alerts = await alertService.getAllAlerts(filters);

            res.json({
                success: true,
                data: alerts,
                count: alerts.length
            });
        } catch (error) {
            console.error('Error in getAllAlerts:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors de la récupération des alertes'
            });
        }
    }

    /**
     * Récupère une alerte par son ID
     */
    async getAlertById(req, res) {
        try {
            const { id } = req.params;
            const alert = await alertService.getAlertById(id);

            res.json({
                success: true,
                data: alert
            });
        } catch (error) {
            console.error('Error in getAlertById:', error);
            const statusCode = error.message === 'Alert not found' ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Crée une nouvelle alerte
     */
    async createAlert(req, res) {
        try {
            const alertData = req.body;
            const alert = await alertService.createAlert(alertData);

            res.status(201).json({
                success: true,
                data: alert,
                message: 'Alerte créée avec succès'
            });
        } catch (error) {
            console.error('Error in createAlert:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Marque une alerte comme lue
     */
    async markAsRead(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.id; // À adapter selon le middleware d'auth
            const alert = await alertService.markAsRead(id, userId);

            res.json({
                success: true,
                data: alert,
                message: 'Alerte marquée comme lue'
            });
        } catch (error) {
            console.error('Error in markAsRead:', error);
            const statusCode = error.message.includes('Unauthorized') ? 403 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Supprime une alerte
     */
    async deleteAlert(req, res) {
        try {
            const { id } = req.params;
            await alertService.deleteAlert(id);

            res.json({
                success: true,
                message: 'Alerte supprimée avec succès'
            });
        } catch (error) {
            console.error('Error in deleteAlert:', error);
            const statusCode = error.message === 'Alert not found' ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Génère des alertes automatiques
     */
    async generateAutomatedAlerts(req, res) {
        try {
            const result = await alertService.generateAllAutomatedAlerts();

            res.json({
                success: true,
                data: result,
                message: `${result.totalGenerated} alertes générées automatiquement`
            });
        } catch (error) {
            console.error('Error in generateAutomatedAlerts:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors de la génération des alertes'
            });
        }
    }

    /**
     * Récupère les statistiques des alertes
     */
    async getAlertStats(req, res) {
        try {
            const allAlerts = await alertService.getAllAlerts();
            const unreadCount = allAlerts.filter(alert => !alert.isRead).length;
            const byPriority = allAlerts.reduce((acc, alert) => {
                acc[alert.priority] = (acc[alert.priority] || 0) + 1;
                return acc;
            }, {});
            const byCategory = allAlerts.reduce((acc, alert) => {
                acc[alert.category] = (acc[alert.category] || 0) + 1;
                return acc;
            }, {});

            const stats = {
                total: allAlerts.length,
                unread: unreadCount,
                byPriority,
                byCategory
            };

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error in getAlertStats:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors de la récupération des statistiques'
            });
        }
    }
}

export default new AlertController();