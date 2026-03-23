// QR code generation and management
import QRCode from 'qrcode';
import Animal from '../models/Animal.js';

class QRCodeService {
    /**
     * Génère un QR code pour un animal
     * @param {string} animalId - ID de l'animal
     * @returns {Promise<string>} - URL du QR code en base64
     */
    async generateAnimalQRCode(animalId) {
        try {
            const animal = await Animal.findById(animalId);
            if (!animal) {
                throw new Error('Animal not found');
            }

            // Créer les données à encoder dans le QR code
            const qrData = {
                id: animal._id.toString(),
                tagNumber: animal.tagNumber,
                species: animal.species,
                name: animal.name,
                campaign: animal.campaign.toString()
            };

            // Générer le QR code en base64
            const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
                errorCorrectionLevel: 'M',
                type: 'image/png',
                quality: 0.92,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });

            return qrCodeDataURL;
        } catch (error) {
            console.error('Error generating QR code:', error);
            throw error;
        }
    }

    /**
     * Génère un QR code avec des données personnalisées
     * @param {Object} data - Données à encoder
     * @param {Object} options - Options de génération
     * @returns {Promise<string>} - QR code en base64
     */
    async generateCustomQRCode(data, options = {}) {
        try {
            const defaultOptions = {
                errorCorrectionLevel: 'M',
                type: 'image/png',
                quality: 0.92,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                },
                ...options
            };

            const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(data), defaultOptions);
            return qrCodeDataURL;
        } catch (error) {
            console.error('Error generating custom QR code:', error);
            throw error;
        }
    }

    /**
     * Décode les données d'un QR code (simulation - en réalité utiliserait un scanner)
     * @param {string} qrData - Données du QR code
     * @returns {Object} - Données décodées
     */
    decodeQRCode(qrData) {
        try {
            // En réalité, ceci serait fait par un scanner QR
            // Ici on simule le décodage
            const decodedData = JSON.parse(qrData);
            return decodedData;
        } catch (error) {
            console.error('Error decoding QR code:', error);
            throw new Error('Invalid QR code data');
        }
    }

    /**
     * Génère un QR code pour une campagne entière
     * @param {string} campaignId - ID de la campagne
     * @returns {Promise<string>} - QR code en base64
     */
    async generateCampaignQRCode(campaignId) {
        try {
            const qrData = {
                type: 'campaign',
                campaignId: campaignId,
                timestamp: new Date().toISOString()
            };

            const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
                errorCorrectionLevel: 'M',
                type: 'image/png',
                quality: 0.92,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });

            return qrCodeDataURL;
        } catch (error) {
            console.error('Error generating campaign QR code:', error);
            throw error;
        }
    }

    /**
     * Valide les données d'un QR code d'animal
     * @param {Object} qrData - Données du QR code
     * @returns {Promise<Object>} - Animal validé
     */
    async validateAnimalQRCode(qrData) {
        try {
            if (!qrData.id || !qrData.tagNumber) {
                throw new Error('Invalid QR code format');
            }

            const animal = await Animal.findById(qrData.id);
            if (!animal) {
                throw new Error('Animal not found');
            }

            if (animal.tagNumber !== qrData.tagNumber) {
                throw new Error('QR code data mismatch');
            }

            return animal;
        } catch (error) {
            console.error('Error validating animal QR code:', error);
            throw error;
        }
    }
}

export default new QRCodeService();
