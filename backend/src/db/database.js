import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer = null;

export async function connectDb() {
    const NODE_ENV = process.env.NODE_ENV || 'development';
    const DB_NAME = process.env.DB_NAME?.trim() || "ferme_db";

    try {
        if (NODE_ENV === 'development') {
            console.log("🧠 Démarrage MongoDB en mémoire pour le développement...");

            // Démarrer MongoDB en mémoire
            mongoServer = await MongoMemoryServer.create({
                instance: {
                    dbName: DB_NAME,
                    port: 27017
                }
            });

            const mongoUri = mongoServer.getUri();
            console.log(`✅ MongoDB en mémoire démarré: ${mongoUri}`);

            await mongoose.connect(mongoUri, {
                dbName: DB_NAME,
                autoIndex: true
            });

            console.log(`✅ Connecté à MongoDB en mémoire (${DB_NAME})`);
        } else {
            // Production: utiliser MongoDB Atlas ou local
            let MONGO_URL = process.env.MONGO_URL?.trim();

            if (!MONGO_URL) {
                MONGO_URL = "mongodb://127.0.0.1:27017";
                console.log("⚠️  MONGO_URL non défini. Utilisation de MongoDB local...");
            }

            console.log(`🔌 Connexion à MongoDB: ${MONGO_URL.replace(/:[^:]*@/, ':****@')}`);

            await mongoose.connect(MONGO_URL, {
                dbName: DB_NAME,
                autoIndex: true,
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
                family: 4
            });

            console.log(`✅ Connecté à MongoDB (${DB_NAME})`);
        }
    } catch (error) {
        console.error("❌ Échec de connexion MongoDB:", error.message);
        throw new Error(`Impossible de se connecter à MongoDB: ${error.message}`);
    }
}

export async function disconnectDB() {
    try {
        await mongoose.disconnect();

        // Arrêter le serveur MongoDB en mémoire si il existe
        if (mongoServer) {
            await mongoServer.stop();
            console.log('🧠 MongoDB en mémoire arrêté');
        }

        console.log('✅ MongoDB déconnecté');
    } catch (error) {
        console.error('❌ Erreur lors de la déconnexion MongoDB:', error.message);
    }
}

