let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let devisSchema = new Schema({
    reference       : {
        type    : String,
        default : null
    },
    descriptif      : {
        type    : String,
        default : null
    },
    naturetravaux   : {
        type    : [String],
        default : []
    },
    support         : {
        type    : String,
        default : null
    },
    hauteur         : {
        type    : Number,
        default : null
    },
    couleur         : {
        type    : String,
        default : null
    },
    photos          : {
        type    : [String],
        default : []
    },
    evaluationTTC   : {
        type    : Number,
        default : 0
    },
    coproId    	    : {
        type    : Schema.Types.ObjectId,
        required: true
    },
    batimentId      : {
        type    : Schema.Types.ObjectId,
        default : null
    },
    prestataireId   : {
        type    : Schema.Types.ObjectId,
        required: true
    },
    syndicId        : {
        type    : Schema.Types.ObjectId,
        required: true
    },
    gestionnaireId  : {
        type    : Schema.Types.ObjectId,
        default : null
    },
    pcsId           : {
        type    : Schema.Types.ObjectId,
        default : null
    },
});

let devis = mongoose.model('devis', devisSchema);

module.exports = devis;
