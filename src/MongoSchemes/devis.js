let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let devisSchema = new Schema({
    date                    : {
        type    : Date,
        default : new Date()
    },
    corpsEtat       : {
        type    : [String],
        default : []
    },
    evaluationTTC   : {
        type    : Number,
        default : 0
    },
    commentaire     : {
        type    : String,
        default : ''
    },
    devisPDF        : {
        type    : String,
        default : null
    },
    facturePDF      : {
        type    : String,
        default : null
    },
    coproId    	    : {
        type    : Schema.Types.ObjectId,
        required: true
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
    demandeDevis    : {
        type    : Boolean,
        default : false
    }
});

let devis = mongoose.model('devis', devisSchema);

module.exports = devis;
