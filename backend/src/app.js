import express from "express";
import cors from "cors";
import apiRouter from "./routes/index.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import 'dotenv/config';

const app = express();

// Configuration CORS
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use("/api", apiRouter);
app.use(notFound);
app.use(errorHandler);
export default app;