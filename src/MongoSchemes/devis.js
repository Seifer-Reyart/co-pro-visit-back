let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let devisSchema = new Schema({
    reference       : String,
    descriptif      : String,
    naturetravaux   : [String],
    support         : String,
    hauteur         : String,
    couleur         : String,
    photos          : [String],
    evaluationTTC   : Number,
    coproId    	    : Schema.Types.ObjectId,
    batimentId      : Schema.Types.ObjectId,
    prestataireId   : Schema.Types.ObjectId,
    syndicId        : Schema.Types.ObjectId,
    gestionnaireId  : Schema.Types.ObjectId,
    pcsId           : Schema.Types.ObjectId,
});

let devis = mongoose.model('devis', devisSchema);

module.exports = devis;