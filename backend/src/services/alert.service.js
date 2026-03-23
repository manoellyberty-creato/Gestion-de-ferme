// Service pour la gestion des alertes
import Alert from '../models/Alert.js';
import User from '../models/User.js';
import Animal from '../models/Animal.js';
import Feed from '../models/Feed.js';
import Health from '../models/Health.js';

class AlertService {
    /**
     * Récupère toutes les alertes avec filtres
     */
    async getAllAlerts(filters = {}) {
        try {
            const query = { isActive: true };

            // Filtres optionnels
            if (filters.userId) {
                query.$or = [
                    { userId: filters.userId },
                    { userId: null } // Alertes générales
                ];
            }
            if (filters.category) {
                query.category = filters.category;
            }
            if (filters.priority) {
                query.priority = filters.priority;
            }
            if (filters.isRead !== undefined) {
                query.isRead = filters.isRead;
            }

            const alerts = await Alert.find(query)
                .populate('userId', 'name email')
                .sort({ priority: -1, createdAt: -1 });

            return alerts;
        } catch (error) {
            console.error('Error getting all alerts:', error);
            throw error;
        }
    }

    /**
     * Récupère une alerte par son ID
     */
    async getAlertById(id) {
        try {
            const alert = await Alert.findById(id)
                .populate('userId', 'name email');

            if (!alert) {
                throw new Error('Alert not found');
            }

            return alert;
        } catch (error) {
            console.error('Error getting alert by ID:', error);
            throw error;
        }
    }

    /**
     * Crée une nouvelle alerte
     */
    async createAlert(alertData) {
        try {
            const alert = new Alert(alertData);
            await alert.save();

            return await this.getAlertById(alert._id);
        } catch (error) {
            console.error('Error creating alert:', error);
            throw error;
        }
    }

    /**
     * Marque une alerte comme lue
     */
    async markAsRead(id, userId = null) {
        try {
            const alert = await Alert.findById(id);
            if (!alert) {
                throw new Error('Alert not found');
            }

            // Vérifier que l'utilisateur peut lire cette alerte
            if (alert.userId && alert.userId.toString() !== userId) {
                throw new Error('Unauthorized to read this alert');
            }

            const updatedAlert = await Alert.findByIdAndUpdate(
                id,
                {
                    isRead: true,
                    readAt: new Date()
                },
                { new: true }
            ).populate('userId', 'name email');

            return updatedAlert;
        } catch (error) {
            console.error('Error marking alert as read:', error);
            throw error;
        }
    }

    /**
     * Supprime une alerte
     */
    async deleteAlert(id) {
        try {
            const alert = await Alert.findByIdAndDelete(id);

            if (!alert) {
                throw new Error('Alert not found');
            }

            return alert;
        } catch (error) {
            console.error('Error deleting alert:', error);
            throw error;
        }
    }

    /**
     * Génère des alertes automatiques pour les stocks faibles
     */
    async generateLowStockAlerts() {
        try {
            const lowStockFeeds = await Feed.find({
                stock: { $lte: '$minStock' },
                isActive: true
            });

            const alerts = [];

            for (const feed of lowStockFeeds) {
                // Vérifier si une alerte existe déjà
                const existingAlert = await Alert.findOne({
                    category: 'feed',
                    'relatedEntity.model': 'Feed',
                    'relatedEntity.id': feed._id,
                    isActive: true
                });

                if (!existingAlert) {
                    const alert = await this.createAlert({
                        title: `Stock faible: ${feed.name}`,
                        message: `Le stock de ${feed.name} est faible (${feed.stock} ${feed.unit} restant)`,
                        type: 'warning',
                        category: 'feed',
                        priority: 'high',
                        relatedEntity: {
                            model: 'Feed',
                            id: feed._id
                        },
                        metadata: {
                            currentStock: feed.stock,
                            minStock: feed.minStock,
                            unit: feed.unit
                        }
                    });
                    alerts.push(alert);
                }
            }

            return alerts;
        } catch (error) {
            console.error('Error generating low stock alerts:', error);
            throw error;
        }
    }

    /**
     * Génère des alertes pour les produits périmés
     */
    async generateExpirationAlerts() {
        try {
            const today = new Date();
            const nextWeek = new Date();
            nextWeek.setDate(today.getDate() + 7);

            // Produits périmés
            const expiredProducts = await Health.find({
                expirationDate: { $lt: today },
                isActive: true
            });

            // Produits expirant bientôt
            const nearExpirationProducts = await Health.find({
                expirationDate: { $gte: today, $lte: nextWeek },
                isActive: true
            });

            const alerts = [];

            // Alertes pour produits périmés
            for (const product of expiredProducts) {
                const existingAlert = await Alert.findOne({
                    category: 'health',
                    'relatedEntity.model': 'Health',
                    'relatedEntity.id': product._id,
                    title: { $regex: 'périmé' },
                    isActive: true
                });

                if (!existingAlert) {
                    const alert = await this.createAlert({
                        title: `Produit périmé: ${product.name}`,
                        message: `Le produit ${product.name} est périmé depuis le ${product.expirationDate.toLocaleDateString()}`,
                        type: 'error',
                        category: 'health',
                        priority: 'critical',
                        relatedEntity: {
                            model: 'Health',
                            id: product._id
                        },
                        metadata: {
                            expirationDate: product.expirationDate
                        }
                    });
                    alerts.push(alert);
                }
            }

            // Alertes pour produits expirant bientôt
            for (const product of nearExpirationProducts) {
                const existingAlert = await Alert.findOne({
                    category: 'health',
                    'relatedEntity.model': 'Health',
                    'relatedEntity.id': product._id,
                    title: { $regex: 'expire bientôt' },
                    isActive: true
                });

                if (!existingAlert) {
                    const alert = await this.createAlert({
                        title: `Produit expire bientôt: ${product.name}`,
                        message: `Le produit ${product.name} expire le ${product.expirationDate.toLocaleDateString()}`,
                        type: 'warning',
                        category: 'health',
                        priority: 'medium',
                        relatedEntity: {
                            model: 'Health',
                            id: product._id
                        },
                        metadata: {
                            expirationDate: product.expirationDate
                        }
                    });
                    alerts.push(alert);
                }
            }

            return alerts;
        } catch (error) {
            console.error('Error generating expiration alerts:', error);
            throw error;
        }
    }

    /**
     * Génère des alertes pour les animaux malades
     */
    async generateHealthAlerts() {
        try {
            const sickAnimals = await Animal.find({
                healthStatus: { $in: ['sick', 'critical'] },
                status: 'active'
            }).populate('campaign', 'name');

            const alerts = [];

            for (const animal of sickAnimals) {
                const existingAlert = await Alert.findOne({
                    category: 'animal',
                    'relatedEntity.model': 'Animal',
                    'relatedEntity.id': animal._id,
                    title: { $regex: 'malade' },
                    isActive: true
                });

                if (!existingAlert) {
                    const priority = animal.healthStatus === 'critical' ? 'critical' : 'high';

                    const alert = await this.createAlert({
                        title: `Animal malade: ${animal.name}`,
                        message: `L'animal ${animal.name} (Tag: ${animal.tagNumber}) est ${animal.healthStatus === 'critical' ? 'dans un état critique' : 'malade'}`,
                        type: 'error',
                        category: 'animal',
                        priority: priority,
                        relatedEntity: {
                            model: 'Animal',
                            id: animal._id
                        },
                        metadata: {
                            animalName: animal.name,
                            tagNumber: animal.tagNumber,
                            healthStatus: animal.healthStatus,
                            campaignName: animal.campaign?.name
                        }
                    });
                    alerts.push(alert);
                }
            }

            return alerts;
        } catch (error) {
            console.error('Error generating health alerts:', error);
            throw error;
        }
    }

    /**
     * Génère toutes les alertes automatiques
     */
    async generateAllAutomatedAlerts() {
        try {
            const results = await Promise.allSettled([
                this.generateLowStockAlerts(),
                this.generateExpirationAlerts(),
                this.generateHealthAlerts()
            ]);

            const allAlerts = results.flatMap(result =>
                result.status === 'fulfilled' ? result.value : []
            );

            return {
                totalGenerated: allAlerts.length,
                alerts: allAlerts
            };
        } catch (error) {
            console.error('Error generating automated alerts:', error);
            throw error;
        }
    }
}

export default new AlertService();