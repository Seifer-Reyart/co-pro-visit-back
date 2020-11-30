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
    nbSalaries          : Number,
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
    echeanceRCP         : {
        type    : Date,
        default : null
    },
    RCDecennale         : {
        type    : String,
        default : null
    },
    echeanceRCD         : {
        type    : Date,
        default : null
    },
    role        	: {
        type: String,
        default: 'prestataire'
    },
});

let prestataires = mongoose.model('prestataires', prestatairesSchema);

module.exports = prestataires;
