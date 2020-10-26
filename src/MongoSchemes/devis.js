let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

let devisSchema = new Schema({
    incidentId      : {type: Schema.Types.ObjectId, default: null},
    evaluationTTC   : {type: Number, default: 0},
    metrages        : {type: Number, default: 0},
    coproId    	    : {type: Schema.Types.ObjectId, default: null},
    pcsId           : {type: Schema.Types.ObjectId, default: null},
    syndicId        : {type: Schema.Types.ObjectId, default: null},
    visiteId        : {type: Schema.Types.ObjectId, default: null},
    courtierId      : {type: Schema.Types.ObjectId, default: null},
    architecteId    : {type: Schema.Types.ObjectId, default: null},
    prestataireId   : {type: Schema.Types.ObjectId, default: null},
    gestionnaireId  : {type: Schema.Types.ObjectId, default: null},
    commentaire     : {type: String, default: null},
    desordre        : {type: String, default: null},
    description     : {type: String, default: null},
    situation       : {type: String, default: null},
    corpsEtat       : {type: [String], default: []},
    images          : {type: [String], default: []},
    date            : {type: Date, default: new Date()},
    demandeDevis    : {type: Boolean, default: false},
    devisPDF        : {type: String, default: null},
    facturePDF      : {type: String, default: null}
});

let devis = mongoose.model('devis', devisSchema);

module.exports = devis;
