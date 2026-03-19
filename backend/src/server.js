import app from "./app.js";
import { connectDb, disconnectDB } from "./db/database.js";
const PORT = process.env.PORT ?? 3000;

await connectDb();
// await disconnectDB();

app.listen(PORT, () => console.log(`API: http://localhost:${PORT}`));
