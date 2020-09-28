let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let coprosSchema = new Schema({
    nomCopro    	: String,
    reference       : String,
    address    	    : String,
    codePostal      : Number,
    ville    	    : String,
    nbBatiments     : {
        type    : Number,
        default : 1
    },
    imgCopro        : String,
    nbrLot          : Number,
    batiments       : [Schema.Types.ObjectId],
    surface         : Number,
    multiDevis      : Number,
    maxTravaux      : Number,
    moisAG          : Date,
    dateVisite          : {
        type: Date,
        default: null
    },
    dateDemandeVisite   : {
        type: Date,
        default: null
    },
    syndicNominated : Schema.Types.ObjectId,
    syndicDateNom   : Date,
    syndicEnCours   : [Schema.Types.ObjectId],
    gestionnaire    : {
        type: Schema.Types.ObjectId,
        default: null,
    },
    pcs             : {
        type: Schema.Types.ObjectId,
        default: null,
    },
    courtier        : Schema.Types.ObjectId,
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
    incidentId      : [Schema.Types.ObjectId],
    assignableImage : [String],
});

let copros = mongoose.model('copros', coprosSchema);

module.exports = copros;
