import mongoose from "mongoose";

export async function connectDb() {
    const MONGO_URL = process.env.MONGO_URL?.trim() || "mongodb://127.0.0.1:27017";
    const DB_NAME = process.env.DB_NAME?.trim() || "ferme_db";

    if (!MONGO_URL) {
        throw new Error("MONGO_URL non défini. Ajoute une variable .env ou lance MongoDB local.");
    }

    try {
        await mongoose.connect(MONGO_URL, {
            dbName: DB_NAME,
            autoIndex: true,
            serverSelectionTimeoutMS: 5000
        });
        console.log(`MongoDB connecté sur ${MONGO_URL} / ${DB_NAME}`);
    } catch (error) {
        console.error("Impossible de se connecter à MongoDB :", error.message);
        throw error;
    }
}

export async function disconnectDB() {
    try {
        await mongoose.disconnect();
        console.log('MongoDB disconnected');
    } catch (error) {
        console.error('MongoDB disconnection error:', error.message);
    }
};

