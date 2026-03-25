import alertService from "../services/alert.service.js";

class AlertController {
    async getAllAlerts(req, res, next) {
        try {
            const alerts = await alertService.getAllAlerts();
            res.json({
                success: true,
                data: alerts
            });
        } catch (error) {
            next(error);
        }
    }

    async getAlertById(req, res, next) {
        try {
            const alert = await alertService.getAlertById(req.params.id);
            res.json({
                success: true,
                data: alert
            });
        } catch (error) {
            next(error);
        }
    }

    async createAlert(req, res, next) {
        try {
            const alertData = {
                ...req.body,
                createdBy: req.user.id
            };
            const alert = await alertService.createAlert(alertData);
            res.status(201).json({
                success: true,
                message: 'Alerte créée avec succès',
                data: alert
            });
        } catch (error) {
            next(error);
        }
    }

    async markAsRead(req, res, next) {
        try {
            const alert = await alertService.markAsRead(req.params.id);
            res.json({
                success: true,
                message: 'Alerte marquée comme lue',
                data: alert
            });
        } catch (error) {
            next(error);
        }
    }

    async resolveAlert(req, res, next) {
        try {
            const alert = await alertService.resolveAlert(req.params.id, req.user.id);
            res.json({
                success: true,
                message: 'Alerte résolue avec succès',
                data: alert
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteAlert(req, res, next) {
        try {
            const alert = await alertService.deleteAlert(req.params.id);
            res.json({
                success: true,
                message: 'Alerte supprimée avec succès',
                data: alert
            });
        } catch (error) {
            next(error);
        }
    }

    async generateAutomatedAlerts(req, res, next) {
        try {
            const result = await alertService.generateAutomatedAlerts(req.body.campaignId);
            res.json({
                success: true,
                message: 'Alertes automatiques générées',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AlertController();
