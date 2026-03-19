// Animal/Subject individual schema

import mongoose from 'mongoose';

const { Schema } = mongoose;

const animalSchema = new Schema(
    {
        campaignId: {
            type: String,
            required: true
        },

        qrCode: {
            type: String,
            required: true
        },
        initialWeight: { //poids initial 
            type: Number,
            required: true,
            min: 0
        },
        // status:{
        //     type:String,
        //     required:true
        // },
        dateOfBirth: {  ///date de naissance
            type: Date,
            required: true
        },
        entryDate: { //date d'entrée
            type: Date,
            default: null
        },
        exitDate: {  //date de sortie 
            type: Date,
            default: null
        },
        exitReason: {  //raison de sortie 
            type: String,
            default: null,
            enum: {
                type:String,
                default:[]
            }
        },
        growthHistory:[  //historique de croissance
            {
                date:{
                    type:Date,
                    default:Date.now
                },
                weight:{
                    type:Number,
                    required:true,
                    min:0
                },
                notes:{
                    type:String,
                    default:""
                }
            }
        ],
        metadata:{
            type:mongoose.Schema.Types.Mixed
        }
    },
    {
        timestamps:true
    }
)

const Animal = mongoose.model('Animal', animalSchema);

export default Animal;