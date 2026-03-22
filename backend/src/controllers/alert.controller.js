import { detectAlerts } from "../services/alert.service.js";

export async function getAlerts(req, res) {
    try {
        const { campaignId } = req.params;
        const alerts = await detectAlerts(campaignId);
        res.status(200).json(alerts);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
}