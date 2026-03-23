// Animal individual management routes

import {Router} from 'express'

import {requireAuth} from '../middleware/requireAuth.js'

import * as animalController from '../controllers/animal.controller.js'

const router= Router()

//post/api/animals  ******    //creer et enregistrer un animal (mes amis)
router.post('/'  ,animalController.createAnimal)

//get/api/animals/compaign/:campaignId ******  //récupérer tous les animaux d'une campagne
router.get('/campaign/:campaignId' , animalController.getAnimalsByCampaign)


//get/api/animals/ID  ****** //récupèrer un animal pas son ID
router.get('/:id', animalController.getAnimalById)


//patch/api/animal/ID ***** //modifier un animal (mettre a jour)
router.patch('/:id' , animalController.updateAnimalById)

//post/api/animals/:id/growth  ******** //ajouter une donnée dans l'historique de l'animal
router.post('/:id/growth' , animalController.addGrowthRecord)

// patch /api/animals/:id/exit ******* //mentionner la sortie d'un animal
router.patch('/:id/exit', animalController.exitAnimal);

//patch/api/animal/qrCode/:qrCode  ********** //récuperer un animal pas son code QR
router.get('/qrCode/:qrCode' , animalController.getAnimalByQrCode)

//delete /api/animal/id/:id  **** //supprimer un animal 
router.delete('/:id' , animalController.deleteAnimal)

export default router