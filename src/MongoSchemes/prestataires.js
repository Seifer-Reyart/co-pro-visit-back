let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let prestatairesSchema = new Schema({
    email       	    : String,
    password    	    : String,
    company             : String,
    address             : String,
    codePostal          : String,
    ville               : String,
    phone               : String,
    nbSalaries          : {type: Number, default: 1},
    siret               : String,
    image               : {
        type    : String,
        default : null
    },
    syndics             : {
        type    : [Schema.Types.ObjectId],
        default : []
    },
    abonnements         : {
        type    : [Schema.Types.ObjectId],
        default : []
    },
    incidentId          : {
        type    : [Schema.Types.ObjectId],
        default : []
    },
    representant        : {
        firstName   	: String,
        lastName    	: String,
        phone           : String,
        email           : String,
    },
    corpsEtat           : {
        type    : [String],
        default : []
    },
    RCProfessionnelle   : {
        type    : String,
        default : null
    },
    RCPdetails          : {
        compagnie           : {type: String, default: null},
        echeanceAnnuelle    : {type: Date, default: null}
    },
    RCDecennale         : {
        type    : String,
        default : null
    },
    RCDdetails          : {
        compagnie           : {type: String, default: null},
        echeanceAnnuelle    : {type: Date, default: null}
    },
    role        	: {
        type: String,
        default: 'prestataire'
    },
});

let prestataires = mongoose.model('prestataires', prestatairesSchema);

module.exports = prestataires;
