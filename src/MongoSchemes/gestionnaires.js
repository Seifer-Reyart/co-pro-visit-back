let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let gestionnairesSchema = new Schema({
    email       	: String,
    firstName   	: String,
    lastName    	: String,
    password    	: String,
    syndic          : Schema.Types.ObjectId,
    phone           : String,
    image           : String,
    parc            : [Schema.Types.ObjectId],
    enCoursSelect   : [Schema.Types.ObjectId],
    permissions     : [Number],
    role        	: {
        type: String,
        default: 'gestionnaire'
    },
});

let gestionnaires = mongoose.model('gestionnaires', gestionnairesSchema);

module.exports = gestionnaires;

/*
Valeurs Permissions:
'Lecture seule' == 0
'Demander un devis' == 1
'Retrait immeuble' == 2
'Vision totale' == 3
'Retirer un prestataire' == 4
'Retirer un courtier' == 5
'Ouvrir un accès PCS' == 6
*/
