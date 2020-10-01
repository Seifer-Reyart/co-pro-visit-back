let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let gestionnairesSchema = new Schema({
    email       	: {
        type    : String,
        required: true
    },
    firstName   	: {
        type    : String,
        required: true
    },
    lastName    	: {
        type    : String,
        required: true
    },
    password    	: String,
    syndic          : {
        type    : Schema.Types.ObjectId,
        required: true
    },
    phone           : {
        type    : String,
        required: true
    },
    image           : {
        type    : String,
        default : null
    },
    parc            : {
        type    : [Schema.Types.ObjectId],
        default : []
    },
    enCoursSelect   : {
        type    : [Schema.Types.ObjectId],
        default : []
    },
    permissions     : {
        type    : [Number],
        default : []
    },
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
