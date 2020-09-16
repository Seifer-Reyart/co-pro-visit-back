let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let visitesSchema = new Schema({
    architecteId    : Schema.Types.ObjectId,
    coproId    	    : Schema.Types.ObjectId,
    nomCopro        : String,
    reference       : String,
    gardien         : Boolean,
    accessCode      : String,
    cleCabinet      : Boolean,
    commentaire     : String,
    nomPCS          : String,
    emailPCS        : String,
    phonePCS        : String,
    syndicId        : Schema.Types.ObjectId,
    gestionnaireId  : Schema.Types.ObjectId,
    demandeLe       : Date,
    faiteLe         : Date,
    done            : Boolean
});

let visites = mongoose.model('visites', visitesSchema);

module.exports = visites;
