import mongoose from "mongoose";

export async function connectDb() {
    const MONGO_URL = process.env.MONGO_URL;
    const DB_NAME = process.env.DB_NAME ?? "ferme_db";

    if (!MONGO_URL) { throw new Error("Missing MONGO_URL env var") }

    await mongoose.connect(MONGO_URL, { dbName: DB_NAME });
    console.log("Mongo connected");
}

export async function disconnectDB() {
    try {
        await mongoose.disconnect();
        console.log('MongoDB disconnected');
    } catch (error) {
        console.error('MongoDB disconnection error:', error.message);
    }
};

