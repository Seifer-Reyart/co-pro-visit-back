let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let batimentsSchema = new Schema({
    reference               : String,
    nbEtages                : Number,
    localisation            : String,
    bacAsable               : Boolean,
    facadeRue               : {
        etatGen     : {
            type: String,
            enum: ['bon', 'moyen', 'mauvais', 'dangereux']
        },
        commerces   : {
            type: Boolean,
            default: false
        },
        natCommerce : String
    },
    facadeArriere           : {
        access      : Boolean,
        etatGen     : {
            type: String,
            enum: ['bon', 'moyen', 'mauvais']
        }
    },
    entrees                 : [
        {
            refEntree       : String,
            porteVitree     : Boolean,
            specAccess1     : String,   //Interphone/digicode/aucun contrôle/autre (préciser)
            specAutre1      : String,
            isAccess2       : Boolean,
            specAccess2     : String,   //Interphone/digicode/aucun contrôle/autre (préciser)
            specAutre2      : String,
            cameraVideo     : Boolean,
            planEvacHall    : Boolean,
            cmdDesenfumage  : Boolean,
            alarmeIncendie  : Boolean,
            Ascenceur       : Boolean,
            etatAscenceur   : {
                type: String,
                enum: ['bon', 'moyen', 'mauvais']
            },
            escalier                : {
                natureMarches       : {
                    type: String,
                    enum: ['bois', 'En dur']
                },
                naturePaliers       : {
                    type: String,
                    enum: ['bois','en dur', 'bois et en dur']
                },
                etatGenMurs         : {
                    type: String,
                    enum: ['bon', 'moyen', 'mauvais']
                },
                etatGenPlafonds     : {
                    type: String,
                    enum: ['bon', 'moyen', 'mauvais']
                },
                etatGenEscaliers    : {
                    type: String,
                    enum: ['bon', 'moyen', 'mauvais']
                },
                extincteurs         : Boolean,
                visite12mois        : Boolean
            },
        }
    ],
    cave                    : {
        presence        : {
            type      : Boolean,
            default   : false
        },
        accessible      : {
            type      : Boolean,
            default   : false
        },
        encombrement  : {
            type: String,
            enum: ['bon', 'moyen', 'mauvais']
        },
        nbSousSol     : Number,
        extincteurs   : Boolean,
        visite12mois  : Boolean
    },
    parkingST      : {
        presence      : Boolean,
        nbNiveaux     : Number,
        visite12mois  : Boolean,
        controlAccess : Boolean,
        etatPorte     : {
            type: String,
            enum: ['bon', 'moyen', 'mauvais']
        },
        planEvac      : Boolean,
    },
    chaufferie              : {
        collective      : Boolean,
        visite12mois    : Boolean,  // à remplir si chaufferie collective
        exitincteursExt : Boolean,  // à remplir si chaufferie collective
        exitincteursInt : Boolean,  // à remplir si chaufferie collective
        Access          : Boolean,  // à remplir si chaufferie collective
        carnet          : Boolean,  // à remplir si chaufferie collective
        dateLastVisite  : Date,     // à remplir si chaufferie collective
        individuelle    : Boolean,
        genre           : {
            type: String,
            enum: ['Fuel', 'Gaz', 'Cpu', 'Electrique']  // Fuel ou gaz ou cpu si Collective
        },                                              // Électrique ou gaz si Individuelle
    },
    image                  : {
        ParcelleCadastrale : String,
        VueGenGoogle       : String,
        facadeRue          : [String],
        facadeArriere      : [String],
        entrees            : [String],
        etages             : [String],
        caves              : [String],
        parking            : [String],
        environnement      : [String],
        contiguite         : [String]
    },
    coproId    	        : Schema.Types.ObjectId,
    faitLe              : Date,
});

let batiments = mongoose.model('batiments', batimentsSchema);

module.exports = batiments;
