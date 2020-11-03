let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let visitesSchema = new Schema({
    img             : {
        type    : String,
        default : null
    },
    architecteId    : {
        type    : Schema.Types.ObjectId,
        default : null
    },
    coproId    	    : {
        type    : Schema.Types.ObjectId,
        required: true
    },
    nomCopro        : {
        type    : String,
        default : null
    },
    reference       : {
        type    : String,
        default : null
    },
    gardien         : {
        type    : Boolean,
        default : false
    },
    accessCode      : {
        type    : String,
        default : null
    },
    cleCabinet      : {
        type    : Boolean,
        default : false
    },
    commentaire     : {
        type    : String,
        default : null
    },
    nomPCS          : {
        type    : String,
        default : null
    },
    emailPCS        : {
        type    : String,
        default : null
    },
    phonePCS        : {
        type    : String,
        default : null
    },
    syndicId        : {
        type    : Schema.Types.ObjectId,
        required: true
    },
    gestionnaireId  : {
        type    : Schema.Types.ObjectId,
        default : null
    },
    demandeLe       : {
        type    : Date,
        default : null
    },
    faiteLe         : {
        type    : Date,
        default : null
    },
    done            : {
        type    : Boolean,
        default : false
    },
    demandeReception: {
        type    : Boolean,
        default : false
    }
});

let visites = mongoose.model('visites', visitesSchema);

module.exports = visites;
