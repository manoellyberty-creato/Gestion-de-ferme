// Contrôleur pour la gestion des campagnes
import campaignService from '../services/campaign.service.js';

class CampaignController {
    /**
     * Récupère toutes les campagnes
     */
    async getAllCampaigns(req, res) {
        try {
            const filters = req.query;
            const campaigns = await campaignService.getAllCampaigns(filters);

            res.json({
                success: true,
                data: campaigns,
                count: campaigns.length
            });
        } catch (error) {
            console.error('Error in getAllCampaigns:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors de la récupération des campagnes'
            });
        }
    }

    /**
     * Récupère une campagne par son ID
     */
    async getCampaignById(req, res) {
        try {
            const { id } = req.params;
            const campaign = await campaignService.getCampaignById(id);

            res.json({
                success: true,
                data: campaign
            });
        } catch (error) {
            console.error('Error in getCampaignById:', error);
            const statusCode = error.message === 'Campaign not found' ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Crée une nouvelle campagne
     */
    async createCampaign(req, res) {
        try {
            const campaignData = req.body;
            const campaign = await campaignService.createCampaign(campaignData);

            res.status(201).json({
                success: true,
                data: campaign,
                message: 'Campagne créée avec succès'
            });
        } catch (error) {
            console.error('Error in createCampaign:', error);
            const statusCode = error.message.includes('not found') ? 400 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Met à jour une campagne
     */
    async updateCampaign(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const campaign = await campaignService.updateCampaign(id, updateData);

            res.json({
                success: true,
                data: campaign,
                message: 'Campagne mise à jour avec succès'
            });
        } catch (error) {
            console.error('Error in updateCampaign:', error);
            const statusCode = error.message === 'Campaign not found' || error.message === 'Invalid status' ? 400 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Clôture une campagne
     */
    async closeCampaign(req, res) {
        try {
            const { id } = req.params;
            const campaign = await campaignService.closeCampaign(id);

            res.json({
                success: true,
                data: campaign,
                message: 'Campagne clôturée avec succès'
            });
        } catch (error) {
            console.error('Error in closeCampaign:', error);
            const statusCode = error.message.includes('not found') || error.message.includes('already completed') ? 400 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Supprime une campagne
     */
    async deleteCampaign(req, res) {
        try {
            const { id } = req.params;
            await campaignService.deleteCampaign(id);

            res.json({
                success: true,
                message: 'Campagne supprimée avec succès'
            });
        } catch (error) {
            console.error('Error in deleteCampaign:', error);
            const statusCode = error.message.includes('associated animals') ? 400 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Récupère les statistiques d'une campagne
     */
    async getCampaignStats(req, res) {
        try {
            const { id } = req.params;
            const result = await campaignService.getCampaignStats(id);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Error in getCampaignStats:', error);
            const statusCode = error.message === 'Campaign not found' ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Récupère les campagnes actives
     */
    async getActiveCampaigns(req, res) {
        try {
            const campaigns = await campaignService.getActiveCampaigns();

            res.json({
                success: true,
                data: campaigns,
                count: campaigns.length
            });
        } catch (error) {
            console.error('Error in getActiveCampaigns:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Erreur lors de la récupération des campagnes actives'
            });
        }
    }
}

export default new CampaignController();