let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let coprosSchema = new Schema({
    nomCopro    	: {
        type    : String,
        required: true
    },
    reference       : {
        type    : String,
        default : null
    },
    address    	    : {
        type    : String,
        required: true
    },
    codePostal      : {
        type    : String,
        required: true
    },
    ville    	    : {
        type    : String,
        required: true
    },
    nbBatiments     : {
        type    : Number,
        default : 1
    },
    imgCopro        : {
        type    : String,
        default : null
    },
    nbrLot          : {
        type    : String,
        default : 1
    },
    batiments       : {
        type    : [Schema.Types.ObjectId],
        default : []
    },
    surface         : {
        type    : Number,
        default : 0,
        required: true
    },
    multiDevis      : {
        type    : Number,
        default : 0
    },
    maxTravaux      : {
        type    : Number,
        default : 0
    },
    moisAG          : {
        type    : Date,
        default : null
    },
    dateVisite          : {
        type    : Date,
        default : null
    },
    dateDemandeVisite   : {
        type    : Date,
        default : null
    },
    syndicNominated : {
        type    : Schema.Types.ObjectId,
        default : null
    },
    syndicDateNom   : {
        type    : Date,
        default : null
    },
    syndicEnCours   : {
        type    : [Schema.Types.ObjectId],
        default : []
    },
    gestionnaire    : {
        type    : Schema.Types.ObjectId,
        default : null,
    },
    pcs             : {
        type: Schema.Types.ObjectId,
        default: null,
    },
    courtier        : {
        type    : Schema.Types.ObjectId,
        default : null
    },
    compagnie       : {
        assurance : {
            type: String,
            default: null
        },
        echeance  : {
            type: Date,
            default: null
        }
    },
    incidentId      : {
        type    : [Schema.Types.ObjectId],
        default : []
    },
    assignableImage : {
        type    : [String],
        default : []
    },
    ParcelleCadastrale : {
        type    : String,
        default : null
    },
    VueGenGoogle       : {
        type    : String,
        default : null
    },
    statSinistres      : {
        type    : String,
        default : null
    }
});

let copros = mongoose.model('copros', coprosSchema);

module.exports = copros;
