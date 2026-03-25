import express from 'express';
import * as deptCtrl from '../controllers/department.controller.js';

const router = express.Router();
router.get('/', deptCtrl.getAllWithStats); // Utilise la nouvelle fonction avec stats

export default router;