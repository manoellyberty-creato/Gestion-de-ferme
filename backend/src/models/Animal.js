// Animal/Subject individual schema

import mongoose from 'mongoose';

const { Schema } = mongoose;

const animalSchema = new Schema(
    {
        campaignId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Campaign',
            required: true
        },

        qrCode: {
            type: String,
            required: true,
            unique: true
        },

        name: { // identifiant lisible / surnom
            type: String,
            default: null
        },

        species: { // espèce animale
            type: String,
            required: true,
            enum: ['bovin', 'ovin', 'caprin', 'porcin', 'volaille', 'autre']
        },

        breed: { // race
            type: String,
            default: null
        },

        gender: { // sexe
            type: String,
            required: true,
            enum: ['male', 'femelle']
        },
        tagNumber: {
    type: String,
    unique: true,
    sparse:true,
    default: null
},

        status: { // état actuel de l'animal
            type: String,
            required: true,
            enum: ['vivant', 'mort', 'vendu'],
            default: 'vivant'
        },

        initialWeight: { // poids initial
            type: Number,
            required: true,
            min: 0
        },

        dateOfBirth: { // date de naissance
            type: Date,
            required: true
        },

        entryDate: { // date d'entrée
            type: Date,
            default: null
        },

        exitDate: { // date de sortie
            type: Date,
            default: null
        },

        exitReason: { // raison de sortie
            type: String,
            default: null,
            enum: ['mort', 'vendu', 'transfert', null]
        },

        growthHistory: [ // historique de croissance
            {
                date: {
                    type: Date,
                    default: Date.now
                },
                weight: {
                    type: Number,
                    required: true,
                    min: 0
                },
                notes: {
                    type: String,
                    default: ""
                }
            }
        ],

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    {
        timestamps: true
    }
)

const Animal = mongoose.model('Animal', animalSchema);

export default Animal;
