import mongoose from 'mongoose';

// Optionnel : mongodb-memory-server est utilisé uniquement si USE_MONGO_MEMORY=true
let mongoServer = null;

export async function connectDb() {
  const DB_NAME = process.env.DB_NAME?.trim() || 'ferme_db';
  const NODE_ENV = process.env.NODE_ENV?.trim() || 'development';
  const MONGO_URL = process.env.MONGO_URL?.trim();
  const USE_MONGO_MEMORY = (process.env.USE_MONGO_MEMORY || 'false').toLowerCase() === 'true';

  try {
    if (USE_MONGO_MEMORY) {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      console.log('Démarrage de MongoDB en mémoire (USE_MONGO_MEMORY=true)...');

      mongoServer = await MongoMemoryServer.create({
        instance: {
          dbName: DB_NAME,
          port: 27017,
        },
      });

      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri, {
        dbName: DB_NAME,
        autoIndex: true,
      });

      console.log(`Connecté à MongoDB en mémoire: ${mongoUri}`);
      return;
    }

    const envUrl = MONGO_URL || (NODE_ENV === 'production' ? '' : 'mongodb://127.0.0.1:27017');

    if (!envUrl) {
      throw new Error('MONGO_URL non défini. Définissez-le dans .env (ou activez USE_MONGO_MEMORY=true pour le dev)');
    }

    console.log(`🔌 Connexion à MongoDB (${NODE_ENV}) via ${envUrl.replace(/:[^:]*@/, ':****@')}`);

    await mongoose.connect(envUrl, {
      dbName: DB_NAME,
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    });

    console.log(`Connecté à MongoDB (${DB_NAME})`);
  } catch (error) {
    console.error('Échec de connexion MongoDB:', error.message);
    throw error;
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();

    if (mongoServer) {
      await mongoServer.stop();
      console.log('🧠 MongoDB en mémoire arrêté');
      mongoServer = null;
    }

    console.log(' MongoDB déconnecté');
  } catch (error) {
    console.error('Erreur lors de la déconnexion MongoDB:', error.message);
  }
}

