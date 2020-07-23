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
    syndics             : [Schema.Types.ObjectId],
    representant        : {
        firstName   	: String,
        lastName    	: String,
        phone           : String,
        email           : String,
    },
    corpsEtat           : [String],
    RCProfessionnelle   : String,
    RCDecennale         : String,
    role        	: {
        type: String,
        default: 'prestataire'
    },
});

let prestataires = mongoose.model('prestataires', prestatairesSchema);

module.exports = prestataires;