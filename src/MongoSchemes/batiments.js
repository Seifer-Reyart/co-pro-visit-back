let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let batimentsSchema = new Schema({
    reference               : {
        type    : String,
        default : null
    },
    nbEtages                : {
        type    : Number,
        default : 1
    },
    localisation            : {
        type    : String,
        default : null
    },
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
        natCommerce : {
            type    : String,
            default : null
        }
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
            porteVitreeSecond: Boolean,
            specAccess2     : String,   //Interphone/digicode/aucun contrôle/autre (préciser)
            specAutre2      : String,
            cameraVideo     : Boolean,
            planEvacHall    : Boolean,
            cmdDesenfumage  : Boolean,
            alarmeIncendie  : Boolean,
            Ascenceur       : Boolean,
            photosEntree    : [String],
            photosAscenseur : [String],
            etatAscenceur   : {
                type: String,
                enum: ['bon', 'moyen', 'mauvais']
            },
            escalier                : {
                natureMarches       : {
                    type: String,
                    enum: ['bois', 'en dur']
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
        extincteurs   : Boolean,
        bacSable      : Boolean,
        access	      : Boolean,
        visite12mois  : Boolean,
        controlAccess : Boolean,
        etatPorte     : {
            type: String,
            enum: ['bon', 'moyen', 'mauvais', 'sansObjet']
        },
        planEvac      : Boolean,
    },
    chaufferie              : {
        collective      : Boolean,
        exitincteursExt : Boolean,  // à remplir si chaufferie collective
        visite12moisCollecExt    : Boolean,  // à remplir si chaufferie collective
        exitincteursInt : Boolean,  // à remplir si chaufferie collective
        visite12moisCollecInt    : Boolean,  // à remplir si chaufferie collective
        exitincteursIndivExt     : Boolean,
        visite12moisIndivExt    : Boolean,  // à remplir si chaufferie collective
        Access          : Boolean,  // à remplir si chaufferie collective
        carnet          : Boolean,  // à remplir si chaufferie collective
        dateLastVisite  : Date,     // à remplir si chaufferie collective
        individuelle    : Boolean,
        genre           : {
            type: String,
            enum: ['Fuel', 'Gaz', 'Cpcu', 'Electrique', 'Inconnu']  // Fuel ou gaz ou cpu si Collective
        },                                              // Électrique ou gaz si Individuelle
    },
    image                  : {
        ParcelleCadastrale : [String],
        VueGenGoogle       : [String],
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
