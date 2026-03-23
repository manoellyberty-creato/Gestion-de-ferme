import express from "express";
import cors from "cors";
import apiRouter from "./routes/index.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import 'dotenv/config';

const app = express();

// Configuration CORS
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use("/api", apiRouter);
app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
});
app.use(notFound);
app.use(errorHandler);
export default app;