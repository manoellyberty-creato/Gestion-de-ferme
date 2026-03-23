import { Router } from 'express';
import animalsRouter from './animals.routes.js';

const router = Router();

router.use('/animals', animalsRouter);

export default router;
