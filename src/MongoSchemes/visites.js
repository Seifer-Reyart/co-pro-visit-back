let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let visitesSchema = new Schema({
    architecteId    : Schema.Types.ObjectId,
    coproId    	    : Schema.Types.ObjectId,
    syndicId        : Schema.Types.ObjectId,
    gestionnaireId  : Schema.Types.ObjectId,
    done            : Boolean
});

let visites = mongoose.model('visites', visitesSchema);

module.exports = visites;