// Animal individual management business logic

import Animal from '../models/Animal.js';

// export async function createAnimal(data) {
    //     const animal=new Animal(data)
    //     return animal.save()
    // }
    
    //creer et enregistrer un animal (mes amis)
export async function createAnimal({campaignId, qrCode, name, species, breed, gender, initialWeight, dateOfBirth, entryDate}){
    return Animal.create({campaignId, qrCode, name, species, breed, gender, initialWeight, dateOfBirth, entryDate})
}


//récupérer tous les animaux d'une campagne
export async function getAnimalsByCampaign(campaignId){
    return Animal.find({campaignId})
}

//récupèrer un animal pas son ID
export async function getAnimalById(id){
    return Animal.findById(id)
}

//modifier un animal (mettre a jour)
export async function updateAnimal(id , data){
    return Animal.findByIdAndUpdate(id, data, {new:true , runValidators: true})
}

//ajouter une donnée dans l'historique de l'animal
export async function addGrowthRecord(id , {weight, notes}) {
    return Animal.findByIdAndUpdate(
        id,
        {$push:{growthHistory:{weight, notes}}},
        {new: true} //retourne l'animal aprés modification
    )
    
}

//mentionner la sortie d'un animal
export async function exitAnimal (id , {exitReason , exitDate}){
    const statusMap = {
        mort: 'mort',
        vendu: 'vendu',
        tranfert : 'vendu'
    };
     
    return Animal.findByIdAndUpdate(
             id,
        {
            status: statusMap[exitReason],
            exitReason,
            exitDate: exitDate || new Date()
        },
        { new: true,
         runValidators: true  //permet de vérifier que les régles du schema sont bien respecter
            }
    
    )
}

//récuperer un animal pas son code QR
export async function getAnimalByQrCode(qrCode){
   return Animal.findOne({qrCode})

}

//supprimer un animal 
export async function deleteAnimal(id){
    return Animal.findByIdAndDelete(id)

}