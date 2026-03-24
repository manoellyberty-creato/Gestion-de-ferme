import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Configuration du chemin pour trouver le .env à la racine
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedUsers = async () => {
    try {
        // 2. Récupération de l'URI depuis le .env
        const uri = process.env.MONGO_URL;
        
        if (!uri || uri.includes('127.0.0.1')) {
            console.warn(" Attention : Vous utilisez peut-être encore une adresse locale !");
        }

        if (!uri) throw new Error("MONGO_URL est absente du fichier .env");
        // 3. Connexion
        await mongoose.connect(uri);
        console.log(' Connecté à la base de données distante !');

        // 4. Nettoyage
        await User.deleteMany({});
        console.log('Anciens utilisateurs supprimés.');

        // 5. Hachage
        const salt = await bcrypt.genSalt(10);
        const commonPassword = await bcrypt.hash('ferme2026', salt);

        // 6. Données
        const users = [
            { name: 'Admin Global', email: 'admin@ferme.com', password: commonPassword, role: 'admin', department: 'Direction' },
            { name: 'Gérant Volaille', email: 'gerant@ferme.com', password: commonPassword, role: 'manager', department: 'Volaille' },
            { name: 'Agent Terrain', email: 'agent@ferme.com', password: commonPassword, role: 'agent', department: 'Bétail' },
            { name: 'Dr. Sarah (Veto)', email: 'veto@ferme.com', password: commonPassword, role: 'veterinaire', department: 'Santé' },
            { name: 'Dr. Mano (Veto)', email: 'comptable@ferme.com', password: commonPassword, role: 'comptable', department: 'Finance' }
        ];

        // 7. Insertion
        await User.insertMany(users);
        console.log('Les 5 utilisateurs de base ont été créés avec succès !');
        console.log('Mot de passe par défaut : ferme2026');

    } catch (error) {
        console.error('Erreur lors du seed :', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

seedUsers();