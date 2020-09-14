let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let devisSchema = new Schema({
    reference       : {
        type: String,
        required: true,
    },
    descriptif      : {
        type: String,
        required: true
    },
    naturetravaux   : [String],
    support         : String,
    hauteur         : String,
    couleur         : String,
    document        : String,
    photos          : [String],
    evaluationTTC   : Number,
    coproId    	    : {
        type: Schema.Types.ObjectId,
        required: true
    },
    batimentId      : Schema.Types.ObjectId,
    prestataireId   : {
        type: Schema.Types.ObjectId,
        required: true,
    },
    syndicId        : {
        type: Schema.Types.ObjectId,
        required: true,
    },
    gestionnaireId  : Schema.Types.ObjectId,
    pcsId           : Schema.Types.ObjectId,
});

let devis = mongoose.model('devis', devisSchema);

module.exports = devis;
