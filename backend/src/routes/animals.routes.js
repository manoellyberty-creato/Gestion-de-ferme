// Routes pour la gestion des animaux
import express from 'express';
import QRCodeService from '../services/qrCode.service.js';
import Animal from '../models/Animal.js';

const router = express.Router();

// Route pour récupérer tous les animaux
router.get('/', (req, res) => {
    res.json({
        success: true,
        data: []
    });
});

// Générer un QR code pour un animal spécifique
router.get('/:id/qrcode', async (req, res) => {
    try {
        const { id } = req.params;
        const qrCode = await QRCodeService.generateAnimalQRCode(id);

        res.json({
            success: true,
            data: {
                animalId: id,
                qrCode: qrCode
            }
        });
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la génération du QR code'
        });
    }
});

// Scanner un QR code d'animal (récupérer les infos via tagNumber)
router.get('/scan/:tagNumber', async (req, res) => {
    try {
        const { tagNumber } = req.params;

        const animal = await Animal.findOne({ tagNumber })
            .populate('campaign', 'name type startDate endDate')
            .select('-__v');

        if (!animal) {
            return res.status(404).json({
                success: false,
                message: 'Animal non trouvé'
            });
        }

        res.json({
            success: true,
            data: animal
        });
    } catch (error) {
        console.error('Error scanning QR code:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du scan du QR code'
        });
    }
});

// Mettre à jour le poids d'un animal via QR code
router.put('/scan/:tagNumber/weight', async (req, res) => {
    try {
        const { tagNumber } = req.params;
        const { weight } = req.body;

        if (!weight || weight <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Poids invalide'
            });
        }

        const animal = await Animal.findOneAndUpdate(
            { tagNumber },
            {
                weight: weight,
                updatedAt: new Date()
            },
            { new: true }
        ).populate('campaign', 'name type');

        if (!animal) {
            return res.status(404).json({
                success: false,
                message: 'Animal non trouvé'
            });
        }

        res.json({
            success: true,
            data: animal,
            message: 'Poids mis à jour avec succès'
        });
    } catch (error) {
        console.error('Error updating weight:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du poids'
        });
    }
});

// Changer le statut d'un animal via QR code
router.put('/scan/:tagNumber/status', async (req, res) => {
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

        const updateData = {
            status: status,
            updatedAt: new Date()
        };

        if (status === 'sold' && salePrice) {
            updateData.salePrice = salePrice;
            updateData.saleDate = saleDate || new Date();
        }

        const animal = await Animal.findOneAndUpdate(
            { tagNumber },
            updateData,
            { new: true }
        ).populate('campaign', 'name type');

        if (!animal) {
            return res.status(404).json({
                success: false,
                message: 'Animal non trouvé'
            });
        }

        res.json({
            success: true,
            data: animal,
            message: 'Statut mis à jour avec succès'
        });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du statut'
        });
    }
});

// Récupérer l'historique d'un animal via QR code
router.get('/scan/:tagNumber/history', async (req, res) => {
    try {
        const { tagNumber } = req.params;

        const animal = await Animal.findOne({ tagNumber })
            .populate('campaign', 'name type startDate endDate')
            .select('-__v');

        if (!animal) {
            return res.status(404).json({
                success: false,
                message: 'Animal non trouvé'
            });
        }

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
        console.error('Error getting animal history:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de l\'historique'
        });
    }
});

export default router;