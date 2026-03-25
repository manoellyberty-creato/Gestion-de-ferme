import express from 'express';
import * as animalCtrl from '../controllers/animal.controller.js';

const router = express.Router();

router.get('/', animalCtrl.getAll);
router.post('/', animalCtrl.create);
router.put('/:id', animalCtrl.update);
router.delete('/:id', animalCtrl.remove);

export default router;