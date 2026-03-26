import mongoose from 'mongoose';
import Animal from '../models/Animal.js';
import Department from '../models/Departement.js';

// 1. Remplace par ton URL MongoDB réelle
const MONGO_URI = 'mongodb+srv://manoellyberty_db_user:Tgr0KrWJu1q2LaqB@clusterferme.55tehdt.mongodb.net/ferme_db?appName=ClusterFerme'; 

const seed = async () => {
  try {
    // 2. CONNEXION À LA BASE
    await mongoose.connect(MONGO_URI);
    console.log("📡 Connecté à MongoDB...");

    // 3. RÉCUPÉRATION DES DÉPARTEMENTS
    const depts = await Department.find();
    
    if (depts.length === 0) {
      console.log("❌ Erreur : Aucun département trouvé. Crée-les d'abord !");
      process.exit(1);
    }

    // 4. NETTOYAGE
    await Animal.deleteMany({});
    console.log("🧹 Anciens animaux supprimés.");

    const volailleId = depts.find(d => d.name.toUpperCase().includes('VOLAILLE'))?._id;
    const betailId = depts.find(d => d.name.toUpperCase().includes('BETAIL'))?._id;
    const pisciId = depts.find(d => d.name.toUpperCase().includes('PISCICULTURE'))?._id;

    // 5. LISTE DES ANIMAUX (5 par catégorie)
    const animals = [
      // VOLAILLE
      { nom: "Poulet-Bio-1", espece: "Volaille", race: "Label Rouge", department: volailleId, statut: "En forme", qrCode: "V-001" },
      { nom: "Poule-Sussex", espece: "Volaille", race: "Sussex", department: volailleId, statut: "En forme", qrCode: "V-002" },
      { nom: "Coq-Gaulois", espece: "Volaille", race: "Gauloise", department: volailleId, statut: "En forme", qrCode: "V-003" },
      { nom: "Canard-Colvert", espece: "Volaille", race: "Colvert", department: volailleId, statut: "Quarantaine", qrCode: "V-004" },
      { nom: "Dinde-Noire", espece: "Volaille", race: "Sologne", department: volailleId, statut: "En forme", qrCode: "V-005" },

      // BÉTAIL
      { nom: "Vache-Alpha", espece: "Bétail", race: "Charolaise", department: betailId, statut: "En forme", qrCode: "B-001" },
      { nom: "Marguerite", espece: "Bétail", race: "Prim'Holstein", department: betailId, statut: "En forme", qrCode: "B-002" },
      { nom: "Veau-Junior", espece: "Bétail", race: "Limousine", department: betailId, statut: "Traitement", qrCode: "B-003" },
      { nom: "Vache-Belle", espece: "Bétail", race: "Normande", department: betailId, statut: "En forme", qrCode: "B-004" },
      { nom: "Taureau-Thor", espece: "Bétail", race: "Angus", department: betailId, statut: "En forme", qrCode: "B-005" },

      // PISCICULTURE
      { nom: "Carpe-Koil-1", espece: "Pisciculture", race: "Miroir", department: pisciId, statut: "En forme", qrCode: "P-001" },
      { nom: "Truite-Arc-en-ciel", espece: "Pisciculture", race: "Fario", department: pisciId, statut: "En forme", qrCode: "P-002" },
      { nom: "Esturgeon-Star", espece: "Pisciculture", race: "Baeri", department: pisciId, statut: "En forme", qrCode: "P-003" },
      { nom: "Saumon-Flash", espece: "Pisciculture", race: "Atlantique", department: pisciId, statut: "En forme", qrCode: "P-004" },
      { nom: "Silure-Ombre", espece: "Pisciculture", race: "Glanis", department: pisciId, statut: "Quarantaine", qrCode: "P-005" }
    ];

    // 6. INSERTION
    await Animal.insertMany(animals);
    console.log(`✅ Succès : ${animals.length} animaux créés !`);

    // 7. FERMETURE
    mongoose.connection.close();
    process.exit(0);

  } catch (err) {
    console.error("❌ Erreur lors du seed:", err);
    process.exit(1);
  }
};

// 8. L'APPEL CRUCIAL
seed();