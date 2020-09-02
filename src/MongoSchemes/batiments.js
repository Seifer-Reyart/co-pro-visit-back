let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let batimentsSchema = new Schema({
    reference               : String,
    surface                 : Number,
    natureConstruction      : String,
    etatFacadeCanal         : String,
    precisezConstr          : String,
    nbEtages                : Number,
    facadeRue               : {
        etatGen     : String,
        commerces   : Boolean,
        natCommerce : String
    },
    facadeArriere           : {
        access      : Boolean,
        etatGen     : String
    },
    entrees                 : [
        {
            refEntree       : String,
            specEntree      : String,
            codeAccess      : String,
            porteVitree     : Boolean,
            codeAccess2     : Boolean,
            specCodeAccess2 : String,
            cameraVideo     : Boolean
        }
    ],
    planEvacHall            : Boolean,
    cmdDesenfumage          : Boolean,
    alarmeIncendie          : Boolean,
    Ascenceur               : Boolean,
    etatAscenceur           : String,
    escalier                : {
        natureMarches       : String,
        naturePaliers       : String,
        etatGenMurs         : String,
        etatGenPlafonds     : String,
        etatGenEscaliers    : String,
        extincteurs         : Boolean,
        visite12mois        : Boolean
    },
    cleCabinet              : {
      type      : Boolean,
      default   : false
    },
    occupation      : {
        habitation  : {
            type      : Boolean,
            default   : false
        },
        bureaux             : {
            type      : Boolean,
            default   : false
        },
        habPro  : {
            type      : Boolean,
            default   : false
        },
        occupant            : String,
        nbNiveaux           : Number,
    },
    cave                    : {
        presence        : {
            type      : Boolean,
            default   : false
        },
        accessible      : {
            type      : Boolean,
            default   : false
        },
        encombrement  : String,
        nbSousSol     : Number,
        extincteurs   : Boolean,
        visite12mois  : Boolean
    },
    parkingST      : {
        presence      : Boolean,
        nbNiveaux     : Number,
        visite12mois  : Boolean,
        controlAccess : Boolean,
        etatPorte     : String,
        planEvac      : Boolean
    },
    chaufferie              : {
        collective      : Boolean,
        individuelle    : Boolean,
        genre           : {
            type: String,
            enum: ['Fuel', 'Gaz', 'Cpu', 'Electrique']
        },
        visite12mois    : Boolean,
        dateLastVisite  : Date,
        exitincteursExt : Boolean,
        exitincteursInt : Boolean,
        Access          : Boolean
    },
    images                  : {
        front           : [String],
        entrees         : [String],
        back            : [String],
        etages          : [String],
        parking         : [String],
        environnement   : [String],
        contiguite      : [String]
    },
    coproId    	        : Schema.Types.ObjectId,
});

let batiments = mongoose.model('batiments', batimentsSchema);

module.exports = batiments;
