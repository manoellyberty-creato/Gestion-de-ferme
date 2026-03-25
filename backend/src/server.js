import app from "./app.js";
import { connectDb, disconnectDB } from "./db/database.js";
import 'dotenv/config';
const PORT = process.env.PORT ?? 7000;

try {
    await connectDb();

    app.listen(PORT, () => console.log(`API: http://localhost:${PORT}`));
} catch (error) {
    console.error("Échec du démarrage du serveur :", error.message);
    process.exit(1);
}

process.on('SIGINT', async () => {
    console.log('Arrêt en cours, fermeture de MongoDB...');
    await disconnectDB();
    process.exit(0);
});
