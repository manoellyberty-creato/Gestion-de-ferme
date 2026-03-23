// Animal individual management controller
import * as animalService from "../services/animal.service.js";

    //creer et enregistrer un animal (mes amis)
export async function createAnimal(req, res , next){
    try {
        const animal = await animalService.createAnimal(req.body)
        res.status(201).json(animal)
    } catch (error) {
        next(error)
    }
}

//récupérer tous les animaux d'une campagne
export async function getAnimalsByCampaign(req ,  res , next) {
    try {
        const animals = await animalService.getAnimalsByCampaign(req.params.campaignId)
        res.status(200).json(animals)
        
    } catch (error) {
        next (error)
        
    }
    
}

//récupèrer un animal pas son ID
export async function getAnimalById(req , res , next ){
    try {
        const animal= await animalService.getAnimalById(req.params.id)
        if(!animal){
            return res.status(404).json({error:{message:"Animal not found"}})
        }
        res.status(200).json(animal)
        
    } catch (error) {
        next(error)
        
    }
}

//modifier un animal (mettre a jour)
export async function updateAnimalById(req, res , next){
    try {
        const animal = await animalService.updateAnimal(req.params.id , req.body) 
        if (!animal){
            return res.status(404).json({error:{message:"Animal not found"}})
        }  
        res.status(200).json(animal)   
    } catch (error) {
        next(error)
        
    }
}

//ajouter une donnée dans l'historique de l'animal
export async function addGrowthRecord(req, res, next) {
    try {
        const animal = await animalService.addGrowthRecord(req.params.id, req.body);
        if (!animal) return res.status(404).json({ error: { message: 'Animal not found' } });
        res.status(200).json(animal);
    } catch (error) {
        next(error);
    }
}


//mentionner la sortie d'un animal
export async function exitAnimal(req, res, next) {
    try {
        const animal = await animalService.exitAnimal(req.params.id, req.body);
        if (!animal) return res.status(404).json({ error: { message: 'Animal not found' } });
        res.status(200).json(animal);
    } catch (error) {
        next(error);
    }
}

//récuperer un animal pas son code QR
export async function getAnimalByQrCode(req , res , next){
    try {
        const animal= await animalService.getAnimalByQrCode(req.params.qrCode)
        if(!animal){
          return  res.status(404).json({error:{message:'Animal not found'}})    
        }
        res.status(200).json(animal)
        
    } catch (error) {
        next(error)
    }
}

//supprimer un animal 
export async function deleteAnimal(req , res , next ){
    try {
        const animal = await animalService.deleteAnimal(req.params.id)
        if(!animal){
          return  res.status(404).json({error:{message:'Animal not found'}})    
        }
        res.status(200).json(animal)
        
    } catch (error) {
        next (error)
    }
}
